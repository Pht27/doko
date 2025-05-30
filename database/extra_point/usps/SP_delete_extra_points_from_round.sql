DELIMITER $$

CREATE PROCEDURE SP_delete_extra_points_from_round (
    IN in_round_id INT
)
BEGIN
    DELETE FROM team_in_round_has_extra_point
    WHERE round_id = in_round_id;
END $$

DELIMITER ;
