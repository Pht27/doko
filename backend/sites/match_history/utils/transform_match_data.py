from collections import defaultdict
from datetime import datetime


def transform_match_data(rows):
    """
    Transforms flat match row data into grouped match structure.
    Adds grouped players, special cards, and extra points per team (by position).
    """
    matches = {}
    player_ids = []

    for row in rows:
        round_id = row['round_id']
        position = row['position']
        party = row.get('team_party')  # 'Re' or 'Kontra'
        player_name = row['player_name']
        is_solo = row.get('is_solo', False)

        player_id = row['player_id']

        special_card = row.get('special_card_name')
        extra_point_name = row.get('extra_point_name')
        extra_point_count = row.get('extra_point_count')

        if round_id not in matches:
            matches[round_id] = {
                'round_id': round_id,
                'time_stamp': row['time_stamp'],
                'game_type': row['game_type'],
                'points': row['points'],
                'winning_party': row['winning_party'],
                'is_solo': is_solo,
                'teams': defaultdict(lambda: {
                    'party': None,
                    'players': [],
                    'special_cards': set(),
                    'extra_points': defaultdict(int)
                })
            }
            player_ids = []

        if player_id not in player_ids:
            team = matches[round_id]['teams'][position]
            team['party'] = party
            team['players'].append(player_name)
            player_ids.append(player_id)

        if special_card:
            team['special_cards'].add(special_card)

        if extra_point_name and extra_point_count:
            team['extra_points'][extra_point_name] = extra_point_count

    # Post-process for output formatting
    result = []
    for match in matches.values():
        # Convert sets to lists for JSON/template compatibility
        for team in match['teams'].values():
            team['special_cards'] = list(team['special_cards'])
            team['extra_points'] = dict(team['extra_points'])

        # After building match['teams'] in the loop
        match['re_teams'] = {pos: team['players'] for pos,
                             team in match['teams'].items() if team['party'] == 'Re'}
        match['kontra_teams'] = {pos: team['players'] for pos,
                                 team in match['teams'].items() if team['party'] == 'Kontra'}

        result.append(match)

    return sorted(result, key=lambda m: m['time_stamp'], reverse=True)
