CREATE OR REPLACE VIEW VI_player_stats AS
SELECT 
    id, 
    name, 
    total_points,
    games_played,
    games_won / nullif(games_played,0) AS winrate,
    total_points / nullif(games_played,0) AS mean_points,
    active
FROM
(
    SELECT
        p.id AS id,
        p.name AS name,

        p.start_points + COALESCE(SUM(
            CASE
                WHEN team_player_counts.player_count = 2 THEN tp.total_points / 2
                ELSE tp.total_points
            END
        ), 0) AS total_points,

        COALESCE(SUM(tp.games_played), 0) AS games_played,

        COALESCE(SUM(tp.games_won), 0) AS games_won,

        p.active AS active
    FROM
        player p
    LEFT JOIN
        team_has_member thm ON p.id = thm.player_id
    LEFT JOIN
        (
            -- Count how many players per team
            SELECT
                team_id,
                COUNT(player_id) AS player_count
            FROM
                team_has_member
            GROUP BY
                team_id
        ) AS team_player_counts ON thm.team_id = team_player_counts.team_id
    LEFT JOIN
        VI_team_stats tp ON tp.team_id = thm.team_id
    GROUP BY
        p.id, p.name
) AS alias;