CREATE OR REPLACE VIEW VI_extra_point_stats AS
    SELECT 
            ep.id AS extra_point_id
        ,   ep.name AS extra_point_name
        ,   SUM(tirhep.count) AS extra_point_count
        ,   SUM(rppt.is_win) AS wins
        ,   ROUND(AVG(rppt.game_value), 2) AS mean_game_value
        ,   ROUND(CAST(SUM(rppt.is_win) AS DECIMAL(10,4)) / NULLIF(COUNT(rppt.round_id), 0), 4) AS winrate

    FROM extra_point ep
    LEFT JOIN team_in_round_has_extra_point tirhep
        ON ep.id = tirhep.extra_point_id
    LEFT JOIN VI_round_points_per_team rppt
        ON      rppt.round_id = tirhep.round_id 
            AND rppt.team_id  = tirhep.team_id
    GROUP BY extra_point_id, extra_point_name
;