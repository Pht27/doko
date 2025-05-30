DELIMITER $$
CREATE PROCEDURE SP_insert_round (
    IN winning_party VARCHAR(50),
    IN points INT,
    IN time_stamp DATETIME
)
BEGIN
    DECLARE round_id INT;
    INSERT INTO round (winning_party, points, time_stamp)
    VALUES (winning_party, points, time_stamp);

    SET round_id = LAST_INSERT_ID();
    SELECT round_id; 
END $$

DELIMITER ;
