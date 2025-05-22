from collections import defaultdict
from datetime import datetime

def transform_match_data(rows):
    """
    Transforms flat match row data into grouped match structure.
    Adds grouped players per team party and position.
    """
    matches = {}

    for row in rows:
        round_id = row['round_id']
        player_id = row['player_id']
        position = row['position']
        party = row.get('team_party')  # 'Re' or 'Kontra'
        is_solo = row.get('is_solo', False)
        player_name = row['player_name']

        if round_id not in matches:
            matches[round_id] = {
                'round_id': round_id,
                'time_stamp': row['time_stamp'],
                'game_type': row['game_type'],
                'points': row['points'],
                'winning_party': row['winning_party'],
                'is_solo': is_solo,
                're_team': defaultdict(list),
                'kontra_team': defaultdict(list)
            }

        if party == 'Re':
            matches[round_id]['re_team'][position].append(player_name)
        elif party == 'Kontra':
            matches[round_id]['kontra_team'][position].append(player_name)

    # Convert dicts to ordered lists
    result = []
    for match in matches.values():
        match['re_team_ordered'] = [name for pos in sorted(match['re_team']) for name in match['re_team'][pos]]
        match['kontra_team_ordered'] = [name for pos in sorted(match['kontra_team']) for name in match['kontra_team'][pos]]
        result.append(match)

    # Sort newest first
    return sorted(result, key=lambda m: m['time_stamp'], reverse=True)
