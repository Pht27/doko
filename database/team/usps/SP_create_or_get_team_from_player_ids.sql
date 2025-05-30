DELIMITER $$

CREATE PROCEDURE SP_create_or_get_team_from_player_ids (
    IN player_id1 INT,
    IN player_id2 INT,
    IN team_name VARCHAR(100)
)
BEGIN
    DECLARE found_team_id INT;

    -- Case 1: Both players are present
    IF player_id2 IS NOT NULL THEN
        SET found_team_id = (
            SELECT thm.team_id
            FROM team_has_member thm
            WHERE thm.player_id IN (player_id1, player_id2)
            GROUP BY thm.team_id
            HAVING COUNT(*) = 2 AND
                   SUM(thm.player_id = player_id1) = 1 AND
                   SUM(thm.player_id = player_id2) = 1
        );
    ELSE
        -- Case 2: Only one player is present
        SET found_team_id = (
            SELECT thm.team_id
            FROM team_has_member thm
            WHERE thm.team_id IN (
                SELECT team_id
                FROM team_has_member
                GROUP BY team_id
                HAVING COUNT(*) = 1
            )
            GROUP BY thm.team_id
            HAVING MAX(player_id) = player_id1
            LIMIT 1
        );
    END IF;

    -- If no existing team was found, create a new one
    IF found_team_id IS NULL THEN
        INSERT INTO team (name) VALUES (team_name);
        SET found_team_id = LAST_INSERT_ID();

        INSERT INTO team_has_member (team_id, player_id) VALUES (found_team_id, player_id1);
        IF player_id2 IS NOT NULL THEN
            INSERT INTO team_has_member (team_id, player_id) VALUES (found_team_id, player_id2);
        END IF;
    END IF;

    -- Return the team_id
    SELECT found_team_id AS team_id;
END $$

DELIMITER ;
