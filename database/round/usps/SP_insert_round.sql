DELIMITER $$
CREATE PROCEDURE insert_round (
    IN p_winning_party VARCHAR(50),
    IN p_points INT,
    IN p_time_stamp DATETIME,
    OUT p_round_id INT
)
BEGIN
    INSERT INTO round (winning_party, points, time_stamp)
    VALUES (p_winning_party, p_points, p_time_stamp);

    SET p_round_id = LAST_INSERT_ID();
END;
DELIMITER ;
