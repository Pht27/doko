CREATE OR REPLACE VIEW VI_player_alone_stats AS
    SELECT
        rppp.player_id AS player_id,
        COUNT(rppp.round_id) AS games_played,
        SUM(rppp.is_win) AS games_won,
        ROUND(CAST(SUM(rppp.is_win) AS DECIMAL(10,4)) / NULLIF(COUNT(rppp.round_id), 0), 4) AS winrate,
        ROUND(AVG(rppp.game_value), 2) AS mean_game_value

    FROM VI_round_points_per_player rppp
    LEFT JOIN VI_team_sizes ts
        ON rppp.team_id = ts.team_id
    WHERE ts.player_count = 1
    GROUP BY rppp.player_id;