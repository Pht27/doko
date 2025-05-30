DELIMITER $$
CREATE PROCEDURE SP_add_special_card_to_team_in_round (
    IN round_id INT,
    IN team_id INT,
    IN special_card_id INT
)
BEGIN
    INSERT INTO team_in_round_has_special_card (round_id, team_id, special_card_id)
    VALUES (round_id, team_id, special_card_id);
END $$

DELIMITER ;
