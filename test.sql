SELECT
    r.id                            AS round_id,
    r.time_stamp                    AS time_stamp,
    gm.name                         AS game_type,
    r.points                        AS points,
    r.winning_party                 AS winning_party,
    p.id                            AS player_id,
    p.name                          AS player_name,
    rht.position                    AS position,
    gm.is_solo                      AS is_solo,
    rht.party                       AS team_party,
    sc.name                         AS special_card_name,
    ep.name                         AS extra_point_name,
    tirhep.count                    AS extra_point_count
FROM
    (
        SELECT *
        FROM round
        WHERE id = 947
        ORDER BY time_stamp DESC
    ) AS r
LEFT JOIN round_is_game_mode rigm 
        ON r.id = rigm.round_id
LEFT JOIN game_mode gm
        ON rigm.game_mode_id = gm.id
LEFT JOIN round_has_team rht
        ON r.id = rht.round_id
LEFT JOIN team_has_member thm
        ON rht.team_id = thm.team_id
LEFT JOIN player p
        ON thm.player_id = p.id
LEFT JOIN team_in_round_has_extra_point tirhep
        ON (tirhep.round_id = r.id AND  tirhep.team_id = thm.team_id)
LEFT JOIN extra_point ep
        ON tirhep.extra_point_id = ep.id
LEFT JOIN team_in_round_has_special_card tirhsc
        ON (tirhsc.round_id = r.id AND  tirhep.team_id = thm.team_id)
LEFT JOIN special_card sc
        ON tirhsc.special_card_id = sc.id
ORDER BY r.time_stamp DESC;
