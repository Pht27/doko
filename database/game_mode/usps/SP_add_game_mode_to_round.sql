DELIMITER $$
CREATE PROCEDURE SP_add_game_mode_to_round (
    IN round_id INT,
    IN game_mode_id INT
)
BEGIN
    INSERT INTO round_is_game_mode (round_id, game_mode_id)
    VALUES (round_id, game_mode_id);
END $$

DELIMITER ;
