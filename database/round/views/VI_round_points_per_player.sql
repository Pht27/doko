CREATE OR REPLACE VIEW VI_round_points_per_player AS
    SELECT
            p.id AS player_id,
            p.start_points,
            r.id AS round_id,
            r.winning_party,
            r.points,
            r.time_stamp,
            rht.party,
            ts.player_count,
            gm.is_solo,
            gm.solo_party,
            ts.player_count = 1 AS plays_alone,

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

            CASE 
                WHEN gm.solo_party = rht.party THEN 
                    (CASE
                        WHEN r.winning_party = rht.party THEN 3 * r.points
                        ELSE -3 * r.points
                    END) / ts.player_count
                ELSE 
                    (CASE
                        WHEN r.winning_party = rht.party THEN r.points
                        ELSE -r.points
                    END) / ts.player_count         
            END AS earned_points,

            IF(rht.party = r.winning_party, 1, 0) AS is_win,

            IF(gm.solo_party = rht.party, 1, 0) AS player_played_solo


        FROM round r
        JOIN round_has_team rht ON rht.round_id = r.id
        JOIN team_has_member thm ON thm.team_id = rht.team_id
        JOIN player p ON p.id = thm.player_id
        JOIN VI_team_sizes ts ON ts.team_id = thm.team_id
        JOIN round_is_game_mode rigm ON rigm.round_id = r.id
        JOIN game_mode gm ON gm.id = rigm.game_mode_id;