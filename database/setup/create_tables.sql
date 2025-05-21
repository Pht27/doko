DROP TABLE IF EXISTS team_has_member;
DROP TABLE IF EXISTS round_has_team;
DROP TABLE IF EXISTS player;
DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS round;

CREATE TABLE player (
    id INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    start_points INT DEFAULT 0,
    PRIMARY KEY(id)
);

CREATE TABLE round (
    id INT AUTO_INCREMENT,
    winning_party VARCHAR(50) NOT NULL CHECK (winning_party = 'Re' OR winning_party = 'Kontra'),
    points INT NOT NULL,
    game_type VARCHAR(50) NOT NULL,
    time_stamp DATETIME NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE team (
    id INT AUTO_INCREMENT,
    name VARCHAR(100) NULL,
    PRIMARY KEY(id)
);

CREATE TABLE team_has_member (
    team_id   INT,
    player_id INT,
    PRIMARY KEY (team_id, player_id),
    FOREIGN KEY (player_id) REFERENCES player(id),
    FOREIGN KEY (team_id) REFERENCES team(id)
);

CREATE TABLE round_has_team (
    round_id  INT,
    team_id   INT,
    position  INT CHECK (position BETWEEN 1 AND 4),  -- Position 1 bis 4 in der Runde
    PRIMARY KEY (round_id, position),
    FOREIGN KEY (round_id) REFERENCES round(id),
    FOREIGN KEY (team_id) REFERENCES team(id)
);


-- neue tabelle specials? -> einträge für fischauge, schweinchen, ...
-- specials müssen mit team id und round id kombiniert werden%     