CREATE OR REPLACE VIEW VI_game_mode_stats AS
    SELECT 
        gm.id AS game_mode_id,
        gm.name AS game_mode_name,
        COUNT(r.id) AS game_mode_count,
        
        SUM(CASE WHEN r.winning_party = 'Re' THEN 1 ELSE 0 END) AS re_wins,

        ROUND(
            SUM(
                CASE 
                    WHEN r.winning_party = 'Re' THEN 
                        CASE 
                            WHEN gm.solo_party = 'Re' THEN 3 * r.points 
                            ELSE r.points 
                        END
                    ELSE 
                        CASE 
                            WHEN gm.solo_party = 'Re' THEN -3 * r.points 
                            ELSE -r.points 
                        END
                END
            ) / NULLIF(COUNT(r.id), 0),
            2
        ) AS re_mean_points,

        ROUND(
            SUM(CASE WHEN r.winning_party = 'Re' THEN 1 ELSE 0 END) 
            / NULLIF(COUNT(r.id), 0),
            4
        ) AS re_winrate

    FROM game_mode gm
    LEFT JOIN round_is_game_mode rigm ON gm.id = rigm.game_mode_id
    LEFT JOIN round r ON rigm.round_id = r.id
    GROUP BY gm.id, gm.name;
