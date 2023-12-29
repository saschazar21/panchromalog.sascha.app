import { DEVELOPERS, DEVELOPERS_IMAGES_META } from "..";

const MIN_ACCURACY = 0.2;

export const SELECT_DEVELOPER_BY_NAME = `SELECT ${DEVELOPERS}.*
FROM ${DEVELOPERS}
WHERE ${DEVELOPERS}.name = $1;
`;

export const SELECT_DEVELOPERS = `WITH data AS (
  SELECT ${DEVELOPERS}.*,
  SIMILARITY(${DEVELOPERS}.name, $3) AS accuracy
  FROM ${DEVELOPERS}
  WHERE SIMILARITY(${DEVELOPERS}.name, $3) > ${MIN_ACCURACY} OR $3 IS NULL
  LIMIT $1
  OFFSET $2
),
meta AS (
  SELECT COUNT(*) AS entries,
  CEIL(COUNT(*) / $1::REAL) AS pages,
  CEIL(($2 + 1) / $1::REAL) AS page
  FROM ${DEVELOPERS}
  WHERE SIMILARITY(${DEVELOPERS}.name, $3) > ${MIN_ACCURACY} OR $3 IS NULL
)
SELECT jsonb_agg(data) AS data, to_jsonb(meta) AS meta
FROM data, meta
GROUP BY meta.*;
`;

export const CREATE_DEVELOPER = `INSERT INTO ${DEVELOPERS} (name)
VALUES ($1)
ON CONFLICT (name) DO NOTHING
RETURNING name;
`;

export const CREATE_DEVELOPER_IMAGE_META = `INSERT INTO ${DEVELOPERS_IMAGES_META} (developer, duration, image)
VALUES ($1, $2, $3)
RETURNING name;
`;
