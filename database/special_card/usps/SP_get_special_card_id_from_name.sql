DELIMITER $$

CREATE PROCEDURE SP_get_special_card_id_from_name (
    IN special_card_name VARCHAR(100)
)
BEGIN
    SELECT id AS special_card_id
    FROM special_card
    WHERE special_card.name = special_card_name;
END $$

DELIMITER ;
