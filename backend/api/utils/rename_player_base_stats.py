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

    if stats['Punkte'] is not None:
        stats['Punkte'] = round(stats['Punkte'], 1)

    return stats


def rename_player_alone_stats(stats):
    stats.pop('player_id', None)
    stats.pop('start_points', None)

    stats['Spiele Gespielt'] = stats.pop('games_played')
    stats['Siege'] = stats.pop('games_won')
    stats['Winrate'] = stats.pop('winrate')
    stats['Mittlerer Spielwert'] = stats.pop('mean_game_value')
    stats['Solos gespielt'] = stats.pop('solos_played')
    stats['Solos gewonnen'] = stats.pop('solos_won')
    stats['Mittlerer Solo Spielwert'] = stats.pop('mean_solo_game_value')

    if stats['Winrate'] is not None:
        stats['Winrate'] = str(round(stats['Winrate'] * 100, 2)) + "%"

    return stats
