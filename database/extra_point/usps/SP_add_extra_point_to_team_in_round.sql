DELIMITER $$
CREATE PROCEDURE SP_add_extra_point_to_team_in_round (
    IN round_id INT,
    IN team_id INT,
    IN extra_point_id INT,
    IN count INT
)
BEGIN
    INSERT INTO team_in_round_has_extra_point (round_id, team_id, extra_point_id, count)
    VALUES (round_id, team_id, extra_point_id, count);
END $$

DELIMITER ;
