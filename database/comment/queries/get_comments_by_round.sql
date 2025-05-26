SELECT
    r.id AS round_id,
    c.id AS comment_id,
    c.text AS comment
FROM
    round r
LEFT JOIN round_has_comment rhc
    ON r.id = rhc.round_id
LEFT JOIN comment c
    ON rhc.comment_id = c.id
;

