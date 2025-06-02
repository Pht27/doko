CREATE OR REPLACE VIEW VI_player_extra_points_stats AS
    SELECT 
        rppp.player_id,
        sc.id AS extra_point_id,
        sc.name AS extra_point_name,

        SUM(tirhep.count) AS extra_point_count,
        SUM(rppp.is_win) AS wins,
        ROUND(AVG(rppp.game_value), 2) AS mean_game_value,
        ROUND(CAST(SUM(rppp.is_win) AS DECIMAL(10,4)) / NULLIF(COUNT(rppp.round_id), 0), 4) AS winrate

    FROM team_in_round_has_extra_point tirhep
    LEFT JOIN VI_round_points_per_player rppp
    ON rppp.round_id = tirhep.round_id AND rppp.team_id = tirhep.team_id
    LEFT JOIN extra_point sc
    ON sc.id = tirhep.extra_point_id

    GROUP BY extra_point_id, extra_point_name, player_id
;