CREATE OR REPLACE VIEW VI_player_partner_stats AS
    SELECT
        rppp.player_id AS player_id,
        thm.player_id AS partner_id,
        COUNT(rppp.round_id) AS games_played,
        SUM(rppp.is_win) AS games_won,
        ROUND(CAST(SUM(rppp.is_win) AS DECIMAL(10,4)) / NULLIF(COUNT(rppp.round_id), 0), 4) AS winrate,
        ROUND(AVG(rppp.game_value), 2) AS mean_game_value

    FROM VI_round_points_per_player rppp
    LEFT JOIN VI_team_sizes ts
    ON rppp.team_id = ts.team_id
    LEFT JOIN team_has_member thm
    ON rppp.team_id = thm.team_id
    WHERE ts.player_count = 2 AND rppp.player_id != thm.player_id
    GROUP BY rppp.player_id, thm.player_id;