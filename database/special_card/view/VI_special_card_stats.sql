CREATE OR REPLACE VIEW VI_special_card_stats AS
    SELECT 
            sc.id AS special_card_id
        ,   sc.name AS special_card_name
        ,   COUNT(rppt.round_id) AS special_card_count
        ,   SUM(rppt.is_win) AS wins
        ,   ROUND(AVG(rppt.game_value), 2) AS mean_game_value
        ,   ROUND(CAST(SUM(rppt.is_win) AS DECIMAL(10,4)) / NULLIF(COUNT(rppt.round_id), 0), 4) AS winrate

    FROM special_card sc
    LEFT JOIN team_in_round_has_special_card tirhsc
        ON sc.id = tirhsc.special_card_id
    LEFT JOIN VI_round_points_per_team rppt
        ON      rppt.round_id = tirhsc.round_id 
            AND rppt.team_id  = tirhsc.team_id
    GROUP BY special_card_id, special_card_name
;