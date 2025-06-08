-- priority 1
CREATE OR REPLACE VIEW VI_team_sizes AS
    SELECT 
        team_id,
        COUNT(player_id) AS player_count
    FROM team_has_member
    GROUP BY team_id;