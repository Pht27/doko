CREATE OR REPLACE VIEW VI_round_with_all_team_info AS
SELECT
        r.*,

        gm.id AS game_mode_id,
        gm.name AS game_mode_name,
        gm.is_solo,
        gm.point_multiplier_re,
        gm.point_multiplier_kontra,

        rht.party,
        rht.position,

        t.id AS team_id,
        t.name AS team_name,

        tirhep.count AS extra_point_count,

        ep.id AS extra_point_id,
        ep.name AS extra_point_name,

        sc.id AS special_card_id,
        sc.name AS special_card_name

FROM round r
LEFT JOIN round_is_game_mode rigm 
        ON r.id = rigm.round_id
LEFT JOIN game_mode gm
        ON rigm.game_mode_id = gm.id
LEFT JOIN round_has_team rht
        ON r.id = rht.round_id
LEFT JOIN team t
        ON rht.team_id = t.id
LEFT JOIN team_in_round_has_extra_point tirhep
        ON tirhep.round_id = r.id AND tirhep.team_id = t.id
LEFT JOIN extra_point ep
        ON tirhep.extra_point_id = ep.id
LEFT JOIN team_in_round_has_special_card tirhsc
        ON tirhsc.round_id = r.id AND tirhsc.team_id = t.id
LEFT JOIN special_card sc
        ON tirhsc.special_card_id = sc.id
ORDER BY r.time_stamp DESC;
