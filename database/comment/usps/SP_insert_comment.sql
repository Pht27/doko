DELIMITER $$
CREATE PROCEDURE SP_insert_comment (
    IN in_round_id INT,
    IN in_comment_text TEXT
)
BEGIN
    DECLARE new_comment_id INT;

    -- Insert into `comment` table
    INSERT INTO comment (text)
    VALUES (in_comment_text);

    -- Get the last inserted comment ID
    SET new_comment_id = LAST_INSERT_ID();

    -- Link the comment to the round
    INSERT INTO round_has_comment (round_id, comment_id)
    VALUES (in_round_id, new_comment_id);
END $$

DELIMITER ;
