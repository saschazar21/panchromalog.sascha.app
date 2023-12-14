import { CAMERAS } from "../cameras/queries";
import { DEVELOPERS_IMAGES_META } from "../developers/queries";
import { FILMS } from "../films/queries";
import { LENSES } from "../lenses/queries";

export const IMAGES = "images";
export const IMAGES_META = "images_meta";

const BASE_SELECT = `SELECT ${IMAGES_META}.*,
to_jsonb(${CAMERAS}.*) as camera,
to_jsonb(${FILMS}.*) as film,
to_jsonb(${LENSES}.*) as lens,
to_jsonb(${DEVELOPERS_IMAGES_META}.*) as developer
FROM ${IMAGES_META}
JOIN ${CAMERAS} ON ${IMAGES_META}.camera = ${CAMERAS}.id
JOIN ${FILMS} ON ${IMAGES_META}.film = ${FILMS}.id
LEFT JOIN ${LENSES} ON ${IMAGES_META}.lens = ${LENSES}.id
LEFT JOIN ${DEVELOPERS_IMAGES_META} ON ${IMAGES_META}.id = ${DEVELOPERS_IMAGES_META}.image`;

export const SELECT_IMAGE_BY_ID = `WITH meta AS (
  ${BASE_SELECT}
  WHERE ${IMAGES_META}.id = $1
)
SELECT ${IMAGES}.*, to_jsonb(meta) AS meta
FROM ${IMAGES}, meta
WHERE ${IMAGES}.id = $1;
`;

export const SELECT_IMAGES = `WITH data AS (
  ${BASE_SELECT}
  WHERE (${IMAGES_META}.camera = $3 OR $3 IS NULL)
  AND (${IMAGES_META}.lens = $4 OR $4 IS NULL)
  AND (${IMAGES_META}.film = $5 OR $5 IS NULL)
),
meta AS (
  SELECT COUNT(*) as entries,
  CEIL(COUNT(*) / $1::REAL) as pages,
  CEIL(($2 + 1) / $1::REAL) as page
  FROM ${IMAGES_META}
  WHERE (${IMAGES_META}.camera = $3 OR $3 IS NULL)
  AND (${IMAGES_META}.lens = $4 OR $4 IS NULL)
  AND (${IMAGES_META}.film = $5 OR $5 IS NULL)
)
SELECT jsonb_agg(data) AS data, to_jsonb(meta) AS meta
FROM data, meta
GROUP BY meta.*;
`;
