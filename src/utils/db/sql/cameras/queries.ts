import { CAMERAS, LENSES, MOUNTS } from "..";

const MIN_ACCURACY = 0.2;

const BASE_SELECT = `SELECT ${CAMERAS}.*,
to_jsonb(${MOUNTS}.*) AS mount,
CASE
  WHEN COUNT(${LENSES}.id) > 0
  THEN jsonb_agg(${LENSES}.*)
  ELSE '[]'::jsonb
END AS ${LENSES}`;

const JOINS = `FROM ${CAMERAS}
LEFT JOIN ${LENSES} on ${LENSES}.mount = ${CAMERAS}.mount
LEFT JOIN ${MOUNTS} on ${MOUNTS}.id = ${CAMERAS}.mount`;

const GROUP_BY = `GROUP BY ${CAMERAS}.id, ${MOUNTS}.id`;

export const SELECT_CAMERA_BY_ID = `${BASE_SELECT}
${JOINS}
WHERE ${CAMERAS}.id = $1
${GROUP_BY};
`;

export const SELECT_CAMERAS = `WITH data AS (
  ${BASE_SELECT},
  SIMILARITY(${CAMERAS}.id, $3) AS accuracy
  ${JOINS}
  WHERE (SIMILARITY(${CAMERAS}.id, $3) > ${MIN_ACCURACY} OR $3 IS NULL) AND (${CAMERAS}.mount = $4 OR $4 IS NULL)
  ${GROUP_BY}
  ORDER BY SIMILARITY(${CAMERAS}.id, $3) DESC, ${CAMERAS}.created_at DESC
  LIMIT $1
  OFFSET $2
),
meta AS (
  SELECT COUNT(*) AS entries,
  CEIL(COUNT(*) / $1::REAL) AS pages,
  CEIL(($2 + 1) / $1::REAL) AS page
  FROM ${CAMERAS}
  WHERE (SIMILARITY(${CAMERAS}.id, $3) > ${MIN_ACCURACY} OR $3 IS NULL) AND (${CAMERAS}.mount = $4 OR $4 IS NULL)
)
SELECT jsonb_agg(data) AS data, to_jsonb(meta) AS meta
FROM data, meta
GROUP BY meta.*;
`;

export const COUNT_CAMERAS = `SELECT COUNT(*) FROM ${CAMERAS};`;

export const CREATE_CAMERA = `INSERT INTO ${CAMERAS} (id, model, make, mount)
VALUES ($1, $2, $3, $4)
ON CONFLICT (id) DO NOTHING
RETURNING id;
`;

export const DELETE_CAMERA = `DELETE FROM ${CAMERAS} WHERE ${CAMERAS}.id = $1;`;
