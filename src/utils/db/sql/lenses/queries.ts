import { CAMERAS } from "../cameras/queries";
import { MOUNTS } from "../mounts/queries";

export const LENSES = "lenses";

const MIN_ACCURACY = 0.2;

const BASE_SELECT = `SELECT ${LENSES}.*,
to_jsonb(${MOUNTS}.*) as mount,
CASE
  WHEN ${CAMERAS}.* IS NULL
  THEN '[]'::jsonb
  ELSE jsonb_agg(${CAMERAS}.*)
END as ${CAMERAS}`;

const JOINS = `FROM ${LENSES}
JOIN ${CAMERAS} ON ${LENSES}.mount = ${CAMERAS}.mount
JOIN ${MOUNTS} ON ${LENSES}.mount = ${MOUNTS}.id`;

const GROUP_BY = `GROUP BY ${LENSES}.id, ${MOUNTS}.id, ${CAMERAS}.id`;

export const SELECT_LENS_BY_ID = `${BASE_SELECT}
${JOINS}
WHERE id = $1
${GROUP_BY};
`;

export const SELECT_LENSES = `WITH data AS (
  ${BASE_SELECT},
  SIMILARITY(${LENSES}.id, $3) AS accuracy
  ${JOINS}
  WHERE (SIMILARITY(${LENSES}.id, $3) > ${MIN_ACCURACY} OR $3 IS NULL) AND (${LENSES}.mount = $4 OR $4 IS NULL)
  ${GROUP_BY}
  LIMIT $1
  OFFSET $2
),
meta AS (
  SELECT COUNT(*) as entries,
  CEIL(COUNT(*) / $1::REAL) as pages,
  SUM(FLOOR($2 / $1::REAL) + 1) as page
  FROM ${LENSES}
  WHERE (SIMILARITY(${LENSES}.id, $3) > ${MIN_ACCURACY} OR $3 IS NULL) AND (${LENSES}.mount = $4 OR $4 IS NULL)
)
SELECT jsonb_agg(data) AS data, to_jsonb(meta) AS meta
FROM data, meta
GROUP BY meta.*;
`;

export const CREATE_LENS = `INSERT INTO ${LENSES} (id, model, make, mount, max_aperture, min_focal_length, max_focal_length)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (id) DO NOTHING
RETURNING id;
`;

export const DELETE_LENS = `DELETE FROM ${LENSES} WHERE id = $1;`;
