DELIMITER $$

CREATE FUNCTION DF_check_if_name_is_taken(name_to_check VARCHAR(255))
RETURNS TINYINT(1)
DETERMINISTIC
BEGIN
    DECLARE result TINYINT(1);
    SELECT EXISTS (
        SELECT 1 
        FROM player p
        WHERE p.name = name_to_check
    ) INTO result;
    RETURN result;
END $$

DELIMITER ;
