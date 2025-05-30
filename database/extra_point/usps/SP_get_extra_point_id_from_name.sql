DELIMITER $$

CREATE PROCEDURE SP_get_extra_point_id_from_name (
    IN extra_point_name VARCHAR(100)
)
BEGIN
    SELECT id AS extra_point_id
    FROM extra_point
    WHERE extra_point.name = extra_point_name;
END $$

DELIMITER ;
