DELIMITER $$
CREATE PROCEDURE SP_add_team_to_round (
    IN round_id INT,
    IN team_id INT,
    IN position INT,
    IN party VARCHAR(50)
)
BEGIN
    INSERT INTO round_has_team (round_id, team_id, position, party)
    VALUES (round_id, team_id, position, party);
END $$

DELIMITER ;
