from decimal import Decimal


def transform_player_data(players):
    """
    Transforms flat player data by rounding and sorting by points
    """
    for player in players:
        player['total_points'] = round(player['total_points'], 1)
        if player['winrate'] is None:
            player['winrate'] = 0
        player['winrate'] = round(player['winrate'] * 100, 2)
        if player['mean_points'] is None:
            player['mean_points'] = 0
        player['mean_points'] = round(player['mean_points'], 2)
    sorted_players = sorted(
        players, key=lambda p: p['total_points'], reverse=True)
    return sorted_players
