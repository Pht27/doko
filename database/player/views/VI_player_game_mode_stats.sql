CREATE OR REPLACE VIEW VI_player_game_mode_stats AS
WITH 
parties AS (
    SELECT 'Re' AS party
    UNION ALL
    SELECT 'Kontra'
),
game_mode_party AS (
    SELECT gm.id AS game_mode_id, gm.name AS game_mode_name, p.party
    FROM game_mode gm
    CROSS JOIN parties p
),
player_game_mode_party AS (
    SELECT DISTINCT p.id AS player_id, gmp.game_mode_id, gmp.game_mode_name, gmp.party
    FROM player p
    CROSS JOIN game_mode_party gmp
),
rounds_with_modes AS (
    SELECT rigm.game_mode_id, rigm.round_id
    FROM round_is_game_mode rigm
),
stats AS (
    SELECT 
        rppp.player_id,
        rigm.game_mode_id,
        rppp.round_id,
        rppp.party,
        rppp.is_win,
        rppp.game_value
    FROM VI_round_points_per_player rppp
    JOIN rounds_with_modes rigm
        ON rppp.round_id = rigm.round_id
)
SELECT 
    pgmp.player_id,
    pgmp.party,
    pgmp.game_mode_id,
    pgmp.game_mode_name,
    COUNT(s.round_id) AS game_mode_count,
    COALESCE(SUM(s.is_win), 0) AS wins,
    ROUND(AVG(s.game_value), 2) AS mean_game_value,
    ROUND(CAST(SUM(s.is_win) AS DECIMAL(10,4)) / NULLIF(COUNT(s.round_id), 0), 4) AS winrate
FROM player_game_mode_party pgmp
LEFT JOIN stats s
    ON pgmp.player_id = s.player_id
    AND pgmp.game_mode_id = s.game_mode_id
    AND pgmp.party = s.party
GROUP BY pgmp.player_id, pgmp.party, pgmp.game_mode_id, pgmp.game_mode_name
ORDER BY pgmp.game_mode_id, pgmp.party;
