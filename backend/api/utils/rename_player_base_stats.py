def rename_player_base_stats(stats):
    stats.pop('player_id', None)
    stats.pop('start_points', None)

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
