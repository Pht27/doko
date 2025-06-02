from decimal import Decimal
from datetime import date


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

def rename_stats(stats):
    stats['Punkte'] = stats.pop('total_points')
    stats['Spiele Gespielt'] = stats.pop('games_played')
    stats['Siege'] = stats.pop('wins')
    stats['Winrate'] = stats.pop('winrate')
    stats['Mittlere Punkte'] = stats.pop('mean_points')
    stats['Solos gespielt'] = stats.pop('solos_played')
    stats['Solos gewonnen'] = stats.pop('solos_won')
    stats['Mittlere Solo Punkte'] = stats.pop('solos_mean_points')

    if stats['Winrate'] is not None:
        stats['Winrate'] = str(round(stats['Winrate'] * 100, 2)) + "%"

    return stats


