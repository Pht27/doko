SELECT
    date_played,
    SUM(daily_points) OVER (ORDER BY date_played) + start_points AS cumulative_points
FROM (
    SELECT
        DATE(r.time_stamp) AS date_played,
        SUM(v.earned_points) AS daily_points,
        p.start_points
    FROM VI_round_points_per_player v
    JOIN player p ON p.id = v.player_id
    JOIN round r ON r.id = v.round_id
    WHERE v.player_id = %s
    GROUP BY DATE(r.time_stamp), p.start_points
) daily
ORDER BY date_played;
