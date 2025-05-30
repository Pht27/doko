DELIMITER $$

CREATE PROCEDURE SP_delete_special_cards_from_round (
    IN in_round_id INT
)
BEGIN
    DELETE FROM team_in_round_has_special_card
    WHERE round_id = in_round_id;
END $$

DELIMITER ;
