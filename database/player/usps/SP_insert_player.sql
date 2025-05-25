DELIMITER $$

CREATE PROCEDURE SP_insert_player (IN new_player_name VARCHAR(255))
BEGIN
    INSERT INTO player (name)
    VALUES (new_player_name);
END $$

DELIMITER ;
