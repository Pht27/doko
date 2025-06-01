CREATE OR REPLACE VIEW VI_team_stats AS
SELECT
    t.id AS team_id,
    t.name AS team_name,

    COALESCE(SUM(
        (
            CASE
                WHEN rht.party = r.winning_party THEN
                    CASE 
                        WHEN rht.party = gm.solo_party THEN 3 * r.points
                        ELSE r.points
                    END
                ELSE
                    CASE 
                        WHEN rht.party = gm.solo_party THEN -3 * r.points
                        ELSE -r.points
                    END
            END
        )
    ), 0) AS total_points,

    COUNT(*) AS games_played,

    SUM(IF(rht.party = r.winning_party, 1, 0)) AS games_won

FROM team t
LEFT JOIN round_has_team rht ON t.id = rht.team_id
LEFT JOIN round r ON rht.round_id = r.id
LEFT JOIN round_is_game_mode rigm ON r.id = rigm.round_id
LEFT JOIN game_mode gm ON rigm.game_mode_id = gm.id
GROUP BY t.id, t.name;
