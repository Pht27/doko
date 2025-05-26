-- Stats should be
-- Alice:   Rounds played 5, Points 10 + 4,5    = 14,5
-- Bob:     Rounds played 5, Points -10 + 5,5   = -4,5
-- Charlie: Rounds played 5, Points             = -9
-- Diana:   Rounds played 5, Points             = -4
-- Eve:     Rounds played 4, Points             = 0,5
-- Frank:   Rounds played 3, Points             = 2,5

-- Fill player
INSERT INTO player (name, start_points) VALUES
('Alice', 10),
('Bob', -10),
('Charlie', 0),
('Diana', 0),
('Eve', 0),
('Frank', 0),
('Gustav', 0);


-- Fill round
INSERT INTO round (winning_party, points, time_stamp) VALUES
('Re',      1, '2024-01-01 12:00:00'),  -- Round 1:                 (Alice, Bob) Kontra, Charlie Kontra, Diana Re, (Eve, Frank) Re
('Kontra',  3, '2024-01-01 12:30:00'),  -- Round 2:                 (Alice, Bob) Kontra, Charlie Re, Diana Re, (Eve, Frank) Kontra
('Re',      1, '2024-01-01 13:00:00'),  -- Round 3:                 (Alice, Eve) Kontra, Charlie Kontra, Diana Re, (Bob, Frank) Re
('Kontra',  2, '2024-01-01 14:00:00'),  -- Round 4 (Kontrasolo):    Alice Kontra, Bob Charlie Diana Re
('Re',      2, '2024-01-01 14:30:00');  -- Round 5 (Fleischloses):  Bob Re, Alice Charlie (Diana, Eve) Re

-- Link game_mode to round
INSERT INTO round_is_game_mode (round_id, game_mode_id) VALUES
(1, 3),  -- Normal
(2, 3),  -- Normal
(3, 3),  -- Normal
(4, 9),  -- Kontrasolo
(5, 7);  -- Fleischloses

-- Create 8 teams
INSERT INTO team (name) VALUES
(NULL), (NULL),
(NULL), (NULL),
(NULL), (NULL),
(NULL), (NULL),
(NULL);

-- Fill teams
-- Round 1: Alice + Bob, Charlie, Diana, Eve + Frank
INSERT INTO team_has_member VALUES
(1, 1), (1, 2),     -- Alice Bob
(2, 3),             -- Charlie
(3, 4),             -- Diana
(4, 5), (4, 6);     -- Eve Frank

-- Round 2: Same teams as 1

-- Round 3: Alice + Eve, Bob + Frank, rest exists already
INSERT INTO team_has_member VALUES
(5, 1), (5, 5),     -- Alice Eve
(6, 2), (6, 6);     -- Bob Frank

-- Round 4: Alice, Bob
INSERT INTO team_has_member VALUES
(7, 1),             -- Alice
(8, 2);             -- Bob

-- Round 5: Diana, Eve
INSERT INTO team_has_member VALUES
(9, 4), (9, 5);

-- Fill teams to rounds
-- Round 1:                 (Alice, Bob) Kontra, Charlie Kontra, Diana Re, (Eve, Frank) Re
INSERT INTO round_has_team VALUES
(1, 1, 1, 'Kontra'),
(1, 2, 2, 'Kontra'),
(1, 3, 3, 'Re'),
(1, 4, 4, 'Re');
-- Round 2:                 (Alice, Bob) Kontra, Charlie Re, Diana Re, (Eve, Frank) Kontra
INSERT INTO round_has_team VALUES
(2, 1, 1, 'Kontra'),
(2, 2, 2, 'Re'),
(2, 3, 3, 'Re'),
(2, 4, 4, 'Kontra');
-- Round 3:                 (Alice, Eve) Kontra, Charlie Kontra, Diana Re, (Bob, Frank) Re
INSERT INTO round_has_team VALUES
(3, 5, 1, 'Kontra'),
(3, 2, 2, 'Kontra'),
(3, 3, 3, 'Re'),
(3, 6, 4, 'Re');
-- Round 4 (Kontrasolo):    Alice Kontra, Bob Charlie Diana Re
INSERT INTO round_has_team VALUES
(4, 7, 1, 'Kontra'),
(4, 8, 2, 'Re'),
(4, 2, 3, 'Re'),
(4, 3, 4, 'Re');
-- Round 5 (Fleischloses):  Bob Re, Alice Charlie Diana Kontra
INSERT INTO round_has_team VALUES
(5, 8, 1, 'Re'),
(5, 7, 2, 'Kontra'),
(5, 2, 3, 'Kontra'),
(5, 9, 4, 'Kontra');

-- SPECIAL CARDS AND EXTRA POINTS

-- Round 1: Diana’s team (Team 3) gets "Heidfrau"
INSERT INTO team_in_round_has_special_card VALUES (1, 3, 3);  -- Heidfrau

-- Round 2: Charlie’s team (Team 2) gets "Schweinchen"
INSERT INTO team_in_round_has_special_card VALUES (2, 2, 8);  -- Schweinchen

-- Round 3: Bob & Frank (Team 6) get "Kemmerich"
INSERT INTO team_in_round_has_special_card VALUES (3, 6, 6);  -- Kemmerich

-- Round 3: Charlie (Team 2) gets "Genscherdamen"
INSERT INTO team_in_round_has_special_card VALUES (3, 2, 2);  -- Genscherdamen


-- Round 1: Eve & Frank (Team 4) get Karlchen and Fuchs
INSERT INTO team_in_round_has_extra_point VALUES (1, 4, 7, 1);  -- Karlchen
INSERT INTO team_in_round_has_extra_point VALUES (1, 4, 4, 1);  -- Fuchs gefangen

-- Round 2: Charlie (Team 2) gets a Doppelkopf
INSERT INTO team_in_round_has_extra_point VALUES (2, 2, 2, 1);  -- Doppelkopf

-- Round 3: Bob & Frank (Team 6) get Fischauge
INSERT INTO team_in_round_has_extra_point VALUES (3, 6, 3, 2);  -- Fischauge

-- Round 3: Alice (Team 7) gets Agathe
INSERT INTO team_in_round_has_extra_point VALUES (4, 7, 1, 1);  -- Agathe


-- COMMENTS
INSERT INTO comment (text) VALUES ('Das Spiel war ja crazy!');
INSERT INTO comment (text) VALUES ('Kaum zu glauben! -A.');
INSERT INTO comment (text) VALUES ('Outplayed -B.');
INSERT INTO comment (text) VALUES ('Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development. Its purpose is to permit a page layout to be designed, independently of the copy that will subsequently populate it, or to demonstrate various fonts of a typeface without meaningful text that could be distracting. Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text by the Roman statesman and philosopher Cicero, with words altered, added, and removed to make it nonsensical and improper Latin.');
INSERT INTO comment (text) VALUES ('Cicero mit Schlaganfall');

INSERT INTO round_has_comment (round_id, comment_id) VALUES (1, 1);
INSERT INTO round_has_comment (round_id, comment_id) VALUES (3, 2);
INSERT INTO round_has_comment (round_id, comment_id) VALUES (3, 3);
INSERT INTO round_has_comment (round_id, comment_id) VALUES (4, 4);
INSERT INTO round_has_comment (round_id, comment_id) VALUES (4, 5);