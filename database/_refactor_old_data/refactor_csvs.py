import pandas as pd
import hashlib
import os

# Get the directory where the script lives
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths relative to script location
OLD_DATA_DIR = os.path.join(BASE_DIR, 'old_data')
tables_path = OLD_DATA_DIR + '/'

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
team_csv.to_csv('new_csvs/team.csv', index=False)

# 6. Erzeuge team_has_member.csv aus player_list und new_team_id
# Für jede Zeile player_list in unique_teams → viele rows mit player_id, new_team_id
rows = []
for _, row in unique_teams.iterrows():
    for player_id in row['player_list']:
        rows.append({'team_id': row['new_team_id'], 'player_id': player_id})

team_has_member_df = pd.DataFrame(rows)
team_has_member_df.to_csv('new_csvs/team_has_member.csv', index=False)


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
round_has_team.to_csv('new_csvs/round_has_team.csv', index=False)


############################
####### GAME MODES #########
############################

# Liste der Spielmodi
game_modes = [
    'Normal', 'Hochzeit', 'Armut', 'Schwarze Sau', 'Farbsolo',
    'Damensolo', 'Bubensolo', 'Fleischloses', 'Knochenloses',
    'Schlanker Martin', 'Stille Hochzeit', 'Kontrasolo'
]

# DataFrame mit IDs ab 1
game_mode_df = pd.DataFrame({
    'game_mode_id': range(1, len(game_modes) + 1),
    'name': game_modes
})

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
round_is_game_mode_df.to_csv('new_csvs/round_is_game_mode.csv', index=False)

# noch game_mode.csv erzeugen für konsistenz in der DB
game_modes = [
    'Normal', 'Hochzeit', 'Armut', 'Schwarze Sau', 'Farbsolo',
    'Damensolo', 'Bubensolo', 'Fleischloses', 'Knochenloses',
    'Schlanker Martin', 'Stille Hochzeit', 'Kontrasolo'
]

# Alphabetisch sortieren und IDs ab 1 zuweisen
game_modes_df = pd.DataFrame({
    'id': range(1, len(game_modes) + 1),
    'name': sorted(game_modes)
})

game_modes_df.to_csv('new_csvs/game_mode.csv', index=False)

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
special_cards = [
    'Schweinchen', 'Superschweinchen', 'Hyperschweinchen',
    'Gescherdamen', 'Gegengenscherdamen',
    'Heidmann', 'Heidfrau', 'Kemmerich', 'Linksdrehender Gehängter'
]

extra_points = [
    'Doppelkopf', 'Fuchs gefangen', 'Fischauge', 'Gans gefangen',
    'Karlchen', 'Agathe', 'Klabautermann gefangen', 'Kaffeekränzchen'
]

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
special_cards_df = specials_df[specials_df['special'].isin(
    special_cards)].copy()
special_cards_df['special_card_id'] = special_cards_df['special'].astype(
    'category').cat.codes + 1
special_cards_final = special_cards_df[[
    'round_id', 'new_team_id', 'special_card_id']].drop_duplicates()
special_cards_final.columns = ['round_id', 'team_id', 'special_card_id']

# ===== EXTRA POINTS =====
extra_points_df = specials_df[specials_df['special'].isin(extra_points)].copy()
extra_points_df['extra_point_id'] = extra_points_df['special'].astype(
    'category').cat.codes + 1
extra_points_final = (
    extra_points_df
    .groupby(['round_id', 'new_team_id', 'extra_point_id'])
    .size()
    .reset_index(name='count')
)
extra_points_final.columns = ['round_id', 'team_id', 'extra_point_id', 'count']

# ===== EXPORT =====
special_cards_final.to_csv(
    'new_csvs/team_in_round_has_special_card.csv', index=False)
extra_points_final.to_csv(
    'new_csvs/team_in_round_has_extra_point.csv', index=False)

# noch special_cards.csv und extra_point.csv erzeugen für konsistenz in der DB
special_cards = [
    'Schweinchen', 'Superschweinchen', 'Hyperschweinchen',
    'Gescherdamen', 'Gegengenscherdamen',
    'Heidmann', 'Heidfrau', 'Kemmerich', 'Linksdrehender Gehängter'
]

# Alphabetisch sortieren und IDs ab 1 zuweisen
special_card_df = pd.DataFrame({
    'id': range(1, len(special_cards) + 1),
    'name': sorted(special_cards)
})

special_card_df.to_csv('new_csvs/special_card.csv', index=False)

extra_points = [
    'Doppelkopf', 'Fuchs gefangen', 'Fischauge', 'Gans gefangen',
    'Karlchen', 'Agathe', 'Klabautermann gefangen', 'Kaffeekränzchen'
]

extra_point_df = pd.DataFrame({
    'id': range(1, len(extra_points) + 1),
    'name': sorted(extra_points)
})

extra_point_df.to_csv('new_csvs/extra_point.csv', index=False)


##################
#### PLAYERS #####
##################

# Lade players.csv
players_df = pd.read_csv(tables_path + 'players.csv')

# Neue IDs vergeben (beginnend bei 1)
players_df = players_df.sort_values('player_id').reset_index(drop=True)
players_df['id'] = range(1, len(players_df) + 1)

# Spalten auswählen und umbenennen
player_df = players_df[['id', 'name', 'active', 'start_points']]

# Speichern
player_df.to_csv('new_csvs/player.csv', index=False)

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
round_df.to_csv('new_csvs/round.csv', index=False)
