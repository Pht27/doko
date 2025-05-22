-- GAME MODES
INSERT INTO game_mode (name) VALUES ('Armut');
INSERT INTO game_mode (name) VALUES ('Hochzeit');
INSERT INTO game_mode (name) VALUES ('Normal');
INSERT INTO game_mode (name, is_solo, point_multiplier_re) VALUES ('Bubensolo', TRUE, 3);
INSERT INTO game_mode (name, is_solo, point_multiplier_re) VALUES ('Damensolo', TRUE, 3);
INSERT INTO game_mode (name, is_solo, point_multiplier_re) VALUES ('Farbsolo', TRUE, 3);
INSERT INTO game_mode (name, is_solo, point_multiplier_re) VALUES ('Fleischloses', TRUE, 3);
INSERT INTO game_mode (name, is_solo, point_multiplier_re) VALUES ('Knochenloses', TRUE, 3);
INSERT INTO game_mode (name, is_solo, point_multiplier_kontra) VALUES ('Kontrasolo', TRUE, 3);
INSERT INTO game_mode (name, is_solo, point_multiplier_re) VALUES ('Schlanker Martin', TRUE, 3);
INSERT INTO game_mode (name, is_solo, point_multiplier_re) VALUES ('Schwarze Sau', TRUE, 3);
INSERT INTO game_mode (name, is_solo, point_multiplier_re) VALUES ('Stille Hochzeit', TRUE, 3);

-- SPECIAL CARDS
INSERT INTO special_card (name) VALUES ('Gegengenscherdamen');
INSERT INTO special_card (name) VALUES ('Genscherdamen');
INSERT INTO special_card (name) VALUES ('Heidfrau');
INSERT INTO special_card (name) VALUES ('Heidmann');
INSERT INTO special_card (name) VALUES ('Hyperschweinchen');
INSERT INTO special_card (name) VALUES ('Kemmerich');
INSERT INTO special_card (name) VALUES ('Linksdrehender Gehängter');
INSERT INTO special_card (name) VALUES ('Schweinchen');
INSERT INTO special_card (name) VALUES ('Superschweinchen');

-- EXTRA CARDS
INSERT INTO extra_point (name) VALUES ('Agathe');
INSERT INTO extra_point (name) VALUES ('Doppelkopf');
INSERT INTO extra_point (name) VALUES ('Fischauge');
INSERT INTO extra_point (name) VALUES ('Fuchs gefangen');
INSERT INTO extra_point (name) VALUES ('Gans gefangen');
INSERT INTO extra_point (name) VALUES ('Kaffeekränzchen');
INSERT INTO extra_point (name) VALUES ('Karlchen');
INSERT INTO extra_point (name) VALUES ('Klabautermann gefangen');
