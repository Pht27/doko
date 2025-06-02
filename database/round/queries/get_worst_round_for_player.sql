SELECT
    r.id                            AS round_id,
    r.time_stamp                    AS time_stamp,
    gm.name                         AS game_mode,
    gm.id                           AS game_mode_id,
    r.points                        AS points,
    r.winning_party                 AS winning_party,
    t.id                            AS team_id,
    t.name                          AS team_name,
    rht.position                    AS position,
    gm.is_solo                      AS is_solo,
    rht.party                       AS team_party,
    sc.name                         AS special_card_name,
    ep.name                         AS extra_point_name,
    tirhep.count                    AS extra_point_count
FROM round r
LEFT JOIN round_is_game_mode rigm 
        ON r.id = rigm.round_id
LEFT JOIN game_mode gm
        ON rigm.game_mode_id = gm.id
LEFT JOIN round_has_team rht
        ON r.id = rht.round_id
LEFT JOIN team t
        ON rht.team_id = t.id
LEFT JOIN team_has_member thm
        ON t.id = thm.team_id
LEFT JOIN player p
        ON thm.player_id = p.id
LEFT JOIN team_in_round_has_extra_point tirhep
        ON tirhep.round_id = r.id AND tirhep.team_id = t.id
LEFT JOIN extra_point ep
        ON tirhep.extra_point_id = ep.id
LEFT JOIN team_in_round_has_special_card tirhsc
        ON tirhsc.round_id = r.id AND tirhsc.team_id = t.id
LEFT JOIN special_card sc
        ON tirhsc.special_card_id = sc.id
WHERE r.id = (
    SELECT round_id
    FROM VI_round_points_per_player
    WHERE player_id = %s AND is_solo = 0
    ORDER BY game_value ASC
    LIMIT 1
)
ORDER BY rht.position;
