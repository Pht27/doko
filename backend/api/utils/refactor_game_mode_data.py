from decimal import Decimal


def refactor_game_mode_data(raw_data):
    formatted = {}

    for row in raw_data:
        gm_id = row['game_mode_id']
        party = row['party']

        if gm_id not in formatted:
            formatted[gm_id] = {
                'game_mode_name': row['game_mode_name'],
                'played': {'Re': 0, 'Kontra': 0},
                'winrate': {'Re': None, 'Kontra': None},
                'mean_game_value': {'Re': None, 'Kontra': None},
            }

        formatted[gm_id]['played'][party] = row['game_mode_count']
        formatted[gm_id]['winrate'][party] = float(
            row['winrate']) if row['winrate'] is not None else None
        formatted[gm_id]['mean_game_value'][party] = float(
            row['mean_game_value']) if row['mean_game_value'] is not None else None

    return list(formatted.values())
