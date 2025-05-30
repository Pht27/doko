DELIMITER $$

CREATE PROCEDURE SP_delete_comments_from_round (
    IN in_round_id INT
)
BEGIN
    DELETE FROM round_has_comment
    WHERE round_id = in_round_id;
END $$

DELIMITER ;
