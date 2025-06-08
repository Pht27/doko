-- priority 1
CREATE OR REPLACE VIEW VI_round_points_per_team AS
    SELECT
            r.id AS round_id,
            r.winning_party,
            r.points,
            rht.party,
            rht.team_id,
            gm.is_solo,
            gm.solo_party,

            CASE 
                WHEN gm.solo_party = rht.party THEN
                    CASE
                        WHEN r.winning_party = rht.party THEN 3 * r.points
                        ELSE -3 * r.points
                    END
                ELSE
                    CASE
                        WHEN r.winning_party = rht.party THEN r.points
                        ELSE -r.points
                    END
            END AS game_value,

            IF(rht.party = r.winning_party, 1, 0) AS is_win,

            IF(gm.solo_party = rht.party, 1, 0) AS team_played_solo


        FROM round r
        JOIN round_has_team rht ON rht.round_id = r.id
        JOIN round_is_game_mode rigm ON rigm.round_id = r.id
        JOIN game_mode gm ON gm.id = rigm.game_mode_id
;