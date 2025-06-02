DELIMITER $$

CREATE PROCEDURE SP_set_activity_status (
    IN in_player_id INT,
    IN in_active BOOLEAN
)
BEGIN
    UPDATE player
    SET
        active = in_active
    WHERE
        id = in_player_id;
END $$

DELIMITER ;
