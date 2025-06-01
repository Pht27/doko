-- GAME MODES
INSERT INTO game_mode (name) VALUES ('Armut');
INSERT INTO game_mode (name) VALUES ('Hochzeit');
INSERT INTO game_mode (name) VALUES ('Normal');
INSERT INTO game_mode (name, is_solo, solo_party) VALUES ('Bubensolo', TRUE, 'Re');
INSERT INTO game_mode (name, is_solo, solo_party) VALUES ('Damensolo', TRUE, 'Re');
INSERT INTO game_mode (name, is_solo, solo_party) VALUES ('Farbsolo', TRUE, 'Re');
INSERT INTO game_mode (name, is_solo, solo_party) VALUES ('Fleischloses', TRUE, 'Re');
INSERT INTO game_mode (name, is_solo, solo_party) VALUES ('Knochenloses', TRUE, 'Re');
INSERT INTO game_mode (name, is_solo, solo_party) VALUES ('Kontrasolo', TRUE, 'Kontra');
INSERT INTO game_mode (name, is_solo, solo_party) VALUES ('Schlanker Martin', TRUE, 'Re');
INSERT INTO game_mode (name, is_solo, solo_party) VALUES ('Schwarze Sau', TRUE, 'Re');
INSERT INTO game_mode (name, is_solo, solo_party) VALUES ('Stille Hochzeit', TRUE, 'Re');

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
