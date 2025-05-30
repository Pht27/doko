-- RUN_ON_DB_CREATION
DELIMITER $$

CREATE PROCEDURE SP_update_team_names()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE current_team_id INT;

    -- Cursor for looping through all team ids
    DECLARE team_cursor CURSOR FOR SELECT id FROM team;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN team_cursor;

    read_loop: LOOP
        FETCH team_cursor INTO current_team_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Update team name with concatenated player names
        UPDATE team
        SET name = (
            SELECT GROUP_CONCAT(p.name ORDER BY p.name SEPARATOR ', ')
            FROM team_has_member thm
            JOIN player p ON p.id = thm.player_id
            WHERE thm.team_id = current_team_id
        )
        WHERE id = current_team_id;

    END LOOP;

    CLOSE team_cursor;
END $$

DELIMITER ;
