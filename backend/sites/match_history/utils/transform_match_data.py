from collections import defaultdict
from datetime import datetime


def transform_match_data(rows, comments):
    """
    Transforms flat match row data into grouped match structure.
    Adds grouped players, special cards, extra points, and comments per team (by position).
    """
    matches = {}
    player_ids = []

    # Step 1: Group comments by round_id
    comments_by_round = defaultdict(list)
    for entry in comments:
        if entry['comment']:  # Ignore None
            comments_by_round[entry['round_id']].append(entry['comment'])

    for row in rows:
        round_id = row['round_id']
        position = row['position']
        party = row.get('team_party')  # 'Re' or 'Kontra'
        team_name = row['team_name']
        is_solo = row.get('is_solo', False)

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
                'comments': comments_by_round.get(round_id, []),
                'teams': defaultdict(lambda: {
                    'party': None,
                    'name': None,
                    'special_cards': set(),
                    'extra_points': defaultdict(int)
                })
            }

        team = matches[round_id]['teams'][position]
        team['party'] = party
        team['name'] = team_name

        if special_card:
            team['special_cards'].add(special_card)

        if extra_point_name and extra_point_count:
            team['extra_points'][extra_point_name] = extra_point_count

    # Post-process for output formatting
    result = []
    for match in matches.values():
        for team in match['teams'].values():
            team['special_cards'] = list(team['special_cards'])
            team['extra_points'] = dict(team['extra_points'])

        result.append(match)

    return sorted(result, key=lambda m: m['time_stamp'], reverse=True)
