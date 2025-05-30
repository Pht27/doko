DELIMITER $$

CREATE PROCEDURE SP_update_round (
    IN in_round_id INT,
    IN in_winning_party VARCHAR(50),
    IN in_points INT
)
BEGIN
    UPDATE round
    SET
        winning_party = in_winning_party,
        points = in_points
    WHERE
        id = in_round_id;
    SELECT ROW_COUNT() AS affected_rows;
END $$

DELIMITER ;
