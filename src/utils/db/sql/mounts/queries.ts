import { CAMERAS, LENSES, MOUNTS } from "..";

const MIN_ACCURACY = 0.2;

const BASE_SELECT = `SELECT ${MOUNTS}.*,
CASE
  WHEN COUNT(${CAMERAS}.id) > 0
  THEN jsonb_agg(${CAMERAS}.*)
  ELSE '[]'::jsonb
END as ${CAMERAS},
CASE 
  WHEN COUNT(${LENSES}.id) > 0
  THEN jsonb_agg(${LENSES}.*)
  ELSE '[]'::jsonb
END as ${LENSES}`;

const JOINS = `FROM ${MOUNTS}
JOIN ${CAMERAS} ON ${MOUNTS}.id = ${CAMERAS}.mount
JOIN ${LENSES} ON ${MOUNTS}.id = ${LENSES}.mount`;

const GROUP_BY = `GROUP BY ${MOUNTS}.id`;

export const SELECT_MOUNT_BY_ID = `${BASE_SELECT}
${JOINS}
WHERE mounts.id = $1
${GROUP_BY};
`;

export const SELECT_MOUNTS = `WITH data AS (
  ${BASE_SELECT},
  SIMILARITY(${MOUNTS}.id, $3) as accuracy
  ${JOINS}
  WHERE SIMILARITY(${MOUNTS}).id, $3) > ${MIN_ACCURACY} OR $3 IS NULL
  ${GROUP_BY}
  LIMIT $1
  OFFSET $2
),
meta AS (
  SELECT COUNT(*) AS entries,
  CEIL(COUNT(*) / $1::REAL) AS pages,
  CEIL(($2 + 1) / $1::REAL) AS page
  FROM ${MOUNTS}
  WHERE SIMILARITY(${MOUNTS}.id, $3) > ${MIN_ACCURACY} OR $3 IS NULL
)
SELECT jsonb_agg(data) AS data, to_jsonb(meta) AS meta
FROM data, meta
GROUP BY meta.*;
`;

export const CREATE_MOUNT = `INSERT INTO ${MOUNTS} (id, make, mount)
VALUES ($1, $2, $3)
ON CONFLICT (id) DO NOTHING
RETURNING id;
`;
