SELECT
    t.id AS team_id,
    thm.player_id AS player_id
FROM
    team t LEFT JOIN team_has_member thm
    ON t.id = thm.team_id
;