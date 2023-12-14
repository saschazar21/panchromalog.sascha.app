import { LENSES } from "../lenses/queries";
import { MOUNTS } from "../mounts/queries";

export const CAMERAS = "cameras";

const MIN_ACCURACY = 0.2;

export const SELECT_CAMERA_BY_ID = `SELECT ${CAMERAS}.*, to_jsonb(${MOUNTS}.*) as mount, jsonb_agg(${LENSES}.*) as ${LENSES}
FROM ${CAMERAS}
LEFT JOIN ${LENSES} on ${CAMERAS}.mount = ${LENSES}.mount
LEFT JOIN ${MOUNTS} on ${CAMERAS}.mount = ${MOUNTS}.id
WHERE ${CAMERAS}.id = $1
GROUP BY ${CAMERAS}.id, ${LENSES}.id
`;

export const SELECT_CAMERAS = `WITH data AS (
  SELECT ${CAMERAS}.*,
  to_jsonb(${MOUNTS}.*) as mount,
  CASE
    WHEN ${LENSES}.* IS NULL
    THEN '[]'::jsonb
    ELSE jsonb_agg(${LENSES}.*)
  END as ${LENSES},
  SIMILARITY(${CAMERAS}.id, $3) AS accuracy
  FROM ${CAMERAS}
  LEFT JOIN ${LENSES} on ${CAMERAS}.mount = ${LENSES}.mount
  LEFT JOIN ${MOUNTS} on ${CAMERAS}.mount = ${MOUNTS}.id
  WHERE (SIMILARITY(${CAMERAS}.id, $3) > ${MIN_ACCURACY} OR $3 IS NULL) AND (${CAMERAS}.mount = $4 OR $4 IS NULL)
  GROUP BY ${CAMERAS}.id, ${LENSES}.id, ${MOUNTS}.id
  LIMIT $1
  OFFSET $2
),
meta AS (
  SELECT COUNT(*) as entries,
  CEIL(COUNT(*) / $1::REAL) as pages,
  CEIL(($2 + 1) / $1::REAL) as page
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
