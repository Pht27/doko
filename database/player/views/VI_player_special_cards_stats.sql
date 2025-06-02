CREATE OR REPLACE VIEW VI_player_special_cards_stats AS
    SELECT 
        rppp.player_id,
        sc.id AS special_card_id,
        sc.name AS special_card_name,

        COUNT(sc.id) AS games_with_special_card,
        SUM(rppp.is_win) AS wins,
        ROUND(AVG(rppp.game_value), 2) AS mean_game_value,
        ROUND(CAST(SUM(rppp.is_win) AS DECIMAL(10,4)) / NULLIF(COUNT(rppp.round_id), 0), 4) AS winrate

    FROM team_in_round_has_special_card tirhsc
    LEFT JOIN VI_round_points_per_player rppp
    ON rppp.round_id = tirhsc.round_id AND rppp.team_id = tirhsc.team_id
    LEFT JOIN special_card sc
    ON sc.id = tirhsc.special_card_id

    GROUP BY special_card_id, special_card_name, player_id
    ;