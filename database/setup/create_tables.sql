DROP TABLE IF EXISTS team_has_member;
DROP TABLE IF EXISTS round_has_team;
DROP TABLE IF EXISTS round_is_game_mode;
DROP TABLE IF EXISTS team_in_round_has_extra_point;
DROP TABLE IF EXISTS team_in_round_has_special_card;

DROP TABLE IF EXISTS player;
DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS round;
DROP TABLE IF EXISTS extra_point;
DROP TABLE IF EXISTS special_card;
DROP TABLE IF EXISTS game_mode;

CREATE TABLE player (
    id              INT AUTO_INCREMENT,
    name            VARCHAR(50) NOT NULL,
    active          BOOLEAN DEFAULT TRUE,
    start_points    DECIMAL(10, 1) DEFAULT 0,

    PRIMARY KEY(id)
);

CREATE TABLE round (
    id              INT AUTO_INCREMENT,
    winning_party   VARCHAR(50) NOT NULL CHECK (winning_party = 'Re' OR winning_party = 'Kontra'),
    points          INT NOT NULL,
    time_stamp      DATETIME NOT NULL,

    PRIMARY KEY(id)
);

CREATE TABLE team (
    id              INT AUTO_INCREMENT,
    name            VARCHAR(100) NULL,

    PRIMARY KEY(id)
);

CREATE TABLE special_card (
    id              INT AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    description     TEXT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE extra_point (
    id              INT AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    description     TEXT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE game_mode (
    id              INT AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    description     TEXT NULL,

    PRIMARY KEY (id)            
);

CREATE TABLE team_has_member (
    team_id     INT,
    player_id   INT,

    PRIMARY KEY (team_id, player_id),
    FOREIGN KEY (player_id)                             REFERENCES player(id),
    FOREIGN KEY (team_id)                               REFERENCES team(id)
);

CREATE TABLE round_has_team (
    round_id    INT,
    team_id     INT,
    position    INT CHECK (position BETWEEN 1 AND 4),  -- Position 1 bis 4 in der Runde
    party       VARCHAR(50) NOT NULL CHECK (party = 'Re' OR party = 'Kontra'),

    PRIMARY KEY (round_id, position),
    FOREIGN KEY (round_id)                              REFERENCES round(id),
    FOREIGN KEY (team_id)                               REFERENCES team(id)
);

CREATE TABLE round_is_game_mode (
    round_id            INT,
    game_mode_id        INT,

    PRIMARY KEY (round_id, game_mode_id),
    FOREIGN KEY (round_id)                              REFERENCES round(id),
    FOREIGN KEY (game_mode_id)                          REFERENCES game_mode(id)
);

CREATE TABLE team_in_round_has_special_card (
    round_id            INT,
    team_id             INT,
    special_card_id     INT,

    PRIMARY KEY (round_id, team_id, special_card_id),
    FOREIGN KEY (round_id)                              REFERENCES round(id),
    FOREIGN KEY (team_id)                               REFERENCES team(id),
    FOREIGN KEY (special_card_id)                       REFERENCES special_card(id)
);

CREATE TABLE team_in_round_has_extra_point (
    round_id        INT,
    team_id         INT,
    extra_point_id  INT,
    count           INT,

    PRIMARY KEY (round_id, team_id, extra_point_id),
    FOREIGN KEY (round_id)                              REFERENCES round(id),
    FOREIGN KEY (team_id)                               REFERENCES team(id),
    FOREIGN KEY (extra_point_id)                        REFERENCES extra_point(id)
);