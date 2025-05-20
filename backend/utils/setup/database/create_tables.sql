DROP TABLE IF EXISTS players;

CREATE TABLE Players (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    start_points INT DEFAULT 0
);

DROP TABLE IF EXISTS rounds;

CREATE TABLE Rounds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    winning_party VARCHAR(50) NOT NULL CHECK (winning_party = 'Re' OR winning_party = 'Kontra'),
    points INT NOT NULL,
    game_type VARCHAR(50) NOT NULL,
    date DATETIME NOT NULL
);


-- TEST
INSERT INTO Players(name)
VALUES ('pht'); 

-- neue tabelle specials? -> einträge für fischauge, schweinchen, ...
-- teams tabelle neu machen -> jedes team nur einmal speichern -> teams in round mit key position (1-4) -> primary key = (round_id, position) 
-- specials müssen mit team id und round id kombiniert werden%     