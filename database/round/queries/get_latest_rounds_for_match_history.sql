SELECT
    r.id AS round_id,
    r.time_stamp,
    gm.name AS game_type,
    r.points AS points,
    r.winning_party AS winning_party,
    p.id AS player_id,
    p.name AS player_name,
    rht.position AS position,
    gm.is_solo AS is_solo,
    rht.party AS team_party
FROM
    (
        SELECT *
        FROM round
        ORDER BY time_stamp DESC
        LIMIT %s OFFSET %s
    ) AS r
LEFT JOIN round_is_game_mode rigm ON r.id = rigm.round_id
LEFT JOIN game_mode gm ON rigm.game_mode_id = gm.id
LEFT JOIN round_has_team rht ON r.id = rht.round_id
LEFT JOIN team_has_member thm ON rht.team_id = thm.team_id
LEFT JOIN player p ON thm.player_id = p.id
ORDER BY r.time_stamp DESC;
