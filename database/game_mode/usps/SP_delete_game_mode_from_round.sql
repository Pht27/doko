DELIMITER $$

CREATE PROCEDURE SP_delete_game_mode_from_round (
    IN in_round_id INT
)
BEGIN
    DELETE FROM round_is_game_mode
    WHERE round_id = in_round_id;
END $$

DELIMITER ;
