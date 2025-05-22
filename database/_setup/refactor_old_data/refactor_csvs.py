import pandas as pd
import hashlib
import os


# Get the directory where the script lives
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths relative to script location
OLD_DATA_DIR = os.path.join(BASE_DIR, 'old_data')

tables_path = OLD_DATA_DIR + '/'
output_dir = BASE_DIR + '/new_csvs/'
static_dir = BASE_DIR + '/static_csvs/'

#######################
####### TEAMS #########
#######################

teams_df = pd.read_csv(tables_path + 'teams.csv')
memberships_df = pd.read_csv(tables_path + 'player_is_in_team.csv')

# 1. Gruppiere alle Teams nach ihren player_ids (egal welche team_id sie bisher hatten)
# -> Erstelle eine Repräsentation jedes Teams als sortierte Tuple aller player_ids
team_members = (
    memberships_df.groupby('team_id')['player_id']
    .apply(lambda x: tuple(sorted(x)))
    .reset_index(name='player_list')
)

# 2. Hash diese player_list, um Duplikate eindeutig zu erkennen


def hash_players(player_list):
    return hashlib.md5(str(player_list).encode()).hexdigest()


team_members['team_hash'] = team_members['player_list'].apply(hash_players)

# 3. Entferne Duplikate → Das sind unsere eindeutigen Teams
unique_teams = team_members.drop_duplicates('team_hash').reset_index(drop=True)

# 4. Weise neue team_ids zu
unique_teams['new_team_id'] = range(1, len(unique_teams) + 1)

# 5. Erzeuge team.csv
team_csv = unique_teams[['new_team_id']].rename(columns={'new_team_id': 'id'})
team_csv.to_csv(output_dir + '/team.csv', index=False)

# 6. Erzeuge team_has_member.csv aus player_list und new_team_id
# Für jede Zeile player_list in unique_teams → viele rows mit player_id, new_team_id
rows = []
for _, row in unique_teams.iterrows():
    for player_id in row['player_list']:
        rows.append({'team_id': row['new_team_id'], 'player_id': player_id})

team_has_member_df = pd.DataFrame(rows)
team_has_member_df.to_csv(output_dir + 'team_has_member.csv', index=False)


##############################
####### TEAMS ROUNDS #########
##############################

# Laden der benötigten Tabellen

# team_round_id, team_id, round_id
teams_in_round_df = pd.read_csv(tables_path + 'teams_in_round.csv')
teams_df = pd.read_csv(tables_path + 'teams.csv')  # alte team_id + partei
memberships_df = pd.read_csv(
    tables_path + 'player_is_in_team.csv')  # player_id, team_id

# Vorbereitung: Hash-basierte Zuordnung alter team_id → neue team_id
# Gleich wie vorher:
team_members = (
    memberships_df.groupby('team_id')['player_id']
    .apply(lambda x: tuple(sorted(x)))
    .reset_index(name='player_list')
)


def hash_players(player_list):
    return hashlib.md5(str(player_list).encode()).hexdigest()


team_members['team_hash'] = team_members['player_list'].apply(hash_players)
unique_teams = team_members.drop_duplicates('team_hash').reset_index(drop=True)
unique_teams['new_team_id'] = range(1, len(unique_teams) + 1)

# Mapping: alte team_id -> new_team_id
old_to_new_team_ids = pd.merge(
    team_members,
    unique_teams[['team_hash', 'new_team_id']],
    on='team_hash',
    how='left'
)[['team_id', 'new_team_id']]

# Join mit teams_in_round, um alte team_id → neue team_id zu mappen
merged = pd.merge(teams_in_round_df, old_to_new_team_ids,
                  on='team_id', how='left')

# Join mit teams.csv, um Partei zu bekommen
merged = pd.merge(merged, teams_df[['team_id', 'party']],
                  on='team_id', how='left')

# Partei-Standardisierung (optional)
merged['party'] = merged['party'].replace(
    {'re': 'Re', 'kontra': 'Kontra'}).str.capitalize()

# Position bestimmen: 1–4 innerhalb jeder round_id (z. B. über group + cumcount)
merged['position'] = (
    merged.groupby('round_id').cumcount() % 4 + 1
)

# Ergebnis-Tabelle
round_has_team = merged[['round_id', 'new_team_id', 'position', 'party']].rename(
    columns={'new_team_id': 'team_id'}
)

# Speichern
round_has_team.to_csv(output_dir + 'round_has_team.csv', index=False)


############################
####### GAME MODES #########
############################

# Lädt die schon zuvor erstellte Tabelle aus create_database, da game modes statisch sind
game_mode_df = pd.read_csv(static_dir + 'game_mode.csv')
game_mode_df = game_mode_df.rename(columns={'id': 'game_mode_id'})

# Lade rounds.csv
# enthält: round_id, game_type, ...
rounds_df = pd.read_csv(tables_path + 'rounds.csv')

# Mapping von alten zu neuen game_type-Namen
rounds_df['game_type'] = rounds_df['game_type'].replace({
    'Trumpfsolo': 'Farbsolo'
})


# Join mit game_mode über game_type = name
round_mode_df = pd.merge(
    rounds_df,
    game_mode_df,
    left_on='game_type',
    right_on='name',
    how='left'
)

# Sicherstellen, dass alle game_types gematcht haben
assert round_mode_df['game_mode_id'].isnull(
).sum() == 0, 'Unbekannte game_type-Werte!'

# Ergebnisstruktur anpassen
round_is_game_mode_df = round_mode_df[['round_id', 'game_mode_id']]
round_is_game_mode_df.to_csv(
    output_dir + 'round_is_game_mode.csv', index=False)

# noch game_mode.csv erzeugen für konsistenz in der DB
# game_mode_df.to_csv(output_dir + 'game_mode.csv', index=False)

#############################
######### SPECIALS ##########
#############################

# ===== EINLESEN DER CSVs =====
specials_df = pd.read_csv(tables_path + 'specials.csv')
teams_in_round_df = pd.read_csv(tables_path + 'teams_in_round.csv')
# enthält: old_team_id, id (neue team_id)
team_csv_df = old_to_new_team_ids
team_csv_df = old_to_new_team_ids.rename(columns={
    'team_id': 'old_team_id',
    'new_team_id': 'id'
})


# ===== MAPPINGS =====
# Alte zu neuen Team-IDs
team_id_map = team_csv_df.set_index('old_team_id')['id'].to_dict()

# Alte Team-ID zu Round-ID
team_round_map = teams_in_round_df.set_index('team_id')['round_id'].to_dict()

# ===== NAMENSKORREKTUREN =====
specials_df['special'] = specials_df['special'].replace({
    'Klabautermann': 'Klabautermann gefangen',
    'Kämmerich': 'Kemmerich'
})

# ===== KATEGORIEN =====
ignored_specials = ['Blutbad', 'Festmahl']

# ===== BEREINIGUNG =====
specials_df = specials_df[~specials_df['special'].isin(
    ignored_specials)].copy()
specials_df['new_team_id'] = specials_df['team_id'].map(team_id_map)
specials_df['round_id'] = specials_df['team_id'].map(team_round_map)
specials_df.dropna(subset=['new_team_id', 'round_id'], inplace=True)
specials_df[['new_team_id', 'round_id']] = specials_df[[
    'new_team_id', 'round_id']].astype(int)

# ===== SPECIAL CARDS =====
special_cards_df = pd.read_csv(static_dir + 'special_card.csv')
special_cards_final = specials_df.merge(
    special_cards_df,
    how='inner',
    left_on='special',
    right_on='name'
)
special_cards_final = special_cards_final[[
    'round_id', 'new_team_id', 'id']]
special_cards_final.columns = ['round_id', 'team_id', 'special_card_id']

# ===== EXTRA POINTS =====
extra_points_df = pd.read_csv(static_dir + 'extra_point.csv')
extra_points_final = specials_df.merge(
    extra_points_df,
    how='inner',
    left_on='special',
    right_on='name'
)
extra_points_final = extra_points_final[[
    'round_id', 'new_team_id', 'id']]
extra_points_final.columns = ['round_id', 'team_id', 'extra_point_id']
extra_points_final['count'] = 1

# ===== EXPORT =====
special_cards_final.to_csv(
    output_dir + 'team_in_round_has_special_card.csv', index=False)
extra_points_final.to_csv(
    output_dir + 'team_in_round_has_extra_point.csv', index=False)

##################
#### PLAYERS #####
##################

# Lade players.csv
players_df = pd.read_csv(tables_path + 'players.csv')

# Neue IDs vergeben (beginnend bei 1)
players_df = players_df.rename(columns={
    'player_id': 'id'
})

# Spalten auswählen und umbenennen
player_df = players_df[['id', 'name', 'active', 'start_points']]

# Konvertiere active zu int (1/0)
player_df['active'] = players_df['active'].astype(int)

# Speichern
player_df.to_csv(output_dir + 'player.csv', index=False)

##################
#### ROUNDS ######
##################

# Lade rounds.csv
rounds_df = pd.read_csv(tables_path + 'rounds.csv')

# Spalten umbenennen
round_df = rounds_df.rename(columns={
    'round_id': 'id',
    'date': 'time_stamp'
})

# Ungewünschte Spalte droppen
round_df = round_df.drop(columns=['game_type'])

# Speichern
round_df.to_csv(output_dir + 'round.csv', index=False)

####################
#### ORDERING ######
####################

os.rename(output_dir + 'player.csv', output_dir + '01_player.csv')
os.rename(output_dir + 'round.csv', output_dir + '02_round.csv')
os.rename(output_dir + 'team.csv', output_dir + '03_team.csv')
# deprecated due to static tables being filled by sql at the start
# os.rename(output_dir + 'game_mode.csv', output_dir + '04_game_mode.csv')
# os.rename(output_dir + 'extra_point.csv', output_dir + '05_extra_point.csv')
# os.rename(output_dir + 'special_card.csv', output_dir + '06_special_card.csv')
os.rename(output_dir + 'round_has_team.csv',
          output_dir + '07_round_has_team.csv')
os.rename(output_dir + 'round_is_game_mode.csv',
          output_dir + '08_round_is_game_mode.csv')
os.rename(output_dir + 'team_has_member.csv',
          output_dir + '09_team_has_member.csv')
os.rename(output_dir + 'team_in_round_has_extra_point.csv',
          output_dir + '10_team_in_round_has_extra_point.csv')
os.rename(output_dir + 'team_in_round_has_special_card.csv',
          output_dir + '11_team_in_round_has_special_card.csv')
