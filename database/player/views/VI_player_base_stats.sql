CREATE OR REPLACE VIEW VI_player_base_stats AS
    SELECT
            p.id AS player_id,
            p.name AS player_name,
            p.start_points,
            p.active AS player_is_active,

            COUNT(rppp.round_id) AS games_played,
            SUM(rppp.is_win) AS wins,
            ROUND(AVG(rppp.earned_points), 2) AS mean_points,
            ROUND(SUM(rppp.earned_points) + p.start_points, 2) AS total_points,
            ROUND(CAST(SUM(rppp.is_win) AS DECIMAL(10,4)) / NULLIF(COUNT(rppp.round_id), 0), 4) AS winrate,

            SUM(CASE WHEN player_played_solo THEN 1 ELSE 0 END) AS solos_played,
            SUM(CASE WHEN player_played_solo AND rppp.is_win = 1 THEN 1 ELSE 0 END) AS solos_won,
            ROUND(AVG(CASE WHEN player_played_solo THEN rppp.earned_points ELSE NULL END), 2) AS solos_mean_points

        FROM player p
        LEFT JOIN VI_round_points_per_player rppp ON p.id = rppp.player_id
        GROUP BY p.id, p.start_points, p.name, p.active;