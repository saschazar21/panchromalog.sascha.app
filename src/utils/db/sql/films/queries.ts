export const FILMS = "films";
const MIN_ACCURACY = 0.2;

export const SELECT_FILM_BY_ID = `SELECT ${FILMS}.*
FROM ${FILMS}
WHERE ${FILMS}.id = $1;
`;

export const SELECT_FILMS = `WITH data AS (
  SELECT ${FILMS}.*, SIMILARITY(${FILMS}.id, $3) AS accuracy
  FROM ${FILMS}
  WHERE (SIMILARITY(${FILMS}.id, $3) > ${MIN_ACCURACY} OR $3 IS NULL) AND (${FILMS}.type = $4 OR $4 IS NULL)
  ORDER BY SIMILARITY(${FILMS}.id, $3) DESC
  LIMIT $1
  OFFSET $2
),
meta AS (
  SELECT COUNT(*) as entries,
  CEIL(COUNT(*) / $1::REAL) as pages,
  CEIL(($2 + 1) / $1::REAL) as page
  FROM ${FILMS}
  WHERE (SIMILARITY(${FILMS}.id, $3) > ${MIN_ACCURACY} OR $3 IS NULL) AND (${FILMS}.type = $4 OR $4 IS NULL)
)
SELECT jsonb_agg(data) AS data, to_jsonb(meta) AS meta
FROM data, meta
GROUP BY meta.*;
`;

export const CREATE_FILM = `INSERT INTO ${FILMS} (id, name, brand, iso, type)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (id) DO NOTHING
RETURNING id;
`;

export const DELETE_FILM = `DELETE FROM ${FILMS} WHERE id = $1`;
