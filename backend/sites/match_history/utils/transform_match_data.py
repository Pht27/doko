from collections import defaultdict
from datetime import datetime


def transform_match_data(rows, comments, player_team_links):
    """
    Transforms flat match row data into structured match format.

    Each match includes:
      - game_type as dict (id, name, is_solo)
      - list of comment dicts (id, text)
      - teams with player_ids
    """
    matches = {}

    # Group comments by round_id
    comments_by_round = defaultdict(list)
    for entry in comments:
        if entry.get('comment'):  # Ignore None comments
            comments_by_round[entry['round_id']].append({
                'id': entry['comment_id'],
                'text': entry['comment']
            })

    # Group player_ids by team_id
    player_ids_by_team = defaultdict(list)
    for pt in player_team_links:
        player_ids_by_team[pt['team_id']].append(pt['player_id'])

    for row in rows:
        round_id = row['round_id']
        position = row['position']
        party = row.get('team_party')  # 'Re' or 'Kontra'
        team_name = row['team_name']
        team_id = row['team_id']

        # Game type info
        game_type = {
            'game_type_id': row['game_type_id'],
            'game_type_name': row['game_type'],
            'is_solo': bool(row.get('is_solo', False))
        }

        # Cards and extras
        special_card = row.get('special_card_name')
        extra_point_name = row.get('extra_point_name')
        extra_point_count = row.get('extra_point_count')

        # Initialize match if new
        if round_id not in matches:
            matches[round_id] = {
                'round_id': round_id,
                'time_stamp': row['time_stamp'],
                'game_type': game_type,
                'points': row['points'],
                'winning_party': row['winning_party'],
                'comments': comments_by_round.get(round_id, []),
                'teams': defaultdict(lambda: {
                    'party': None,
                    'name': None,
                    'special_cards': set(),
                    'extra_points': defaultdict(int),
                    'player_ids': []
                })
            }

        team = matches[round_id]['teams'][position]
        team['party'] = party
        team['name'] = team_name
        team['player_ids'] = player_ids_by_team.get(team_id, [])

        if special_card:
            team['special_cards'].add(special_card)

        if extra_point_name and extra_point_count:
            team['extra_points'][extra_point_name] = extra_point_count

    # Final cleanup: convert sets and defaultdicts to lists and dicts
    result = []
    for match in matches.values():
        for team in match['teams'].values():
            team['special_cards'] = list(team['special_cards'])
            team['extra_points'] = dict(team['extra_points'])

        result.append(match)

    return sorted(result, key=lambda m: m['time_stamp'], reverse=True)
