SELECT *
FROM VI_player_partner_stats v 
LEFT JOIN 
    (SELECT id, name FROM player) alias 
    ON v.partner_id = alias.id 
WHERE player_id = %s;
