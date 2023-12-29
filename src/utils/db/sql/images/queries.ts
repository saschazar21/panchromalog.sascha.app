import {
  CAMERAS,
  DEVELOPERS_IMAGES_META,
  FILMS,
  IMAGES,
  IMAGES_META,
  LENSES,
} from "..";

const BASE_SELECT = `SELECT ${IMAGES}.*,
to_jsonb(${IMAGES_META}.*) || jsonb_build_object(
  'camera', to_jsonb(${CAMERAS}.*),
  'film', to_jsonb(${FILMS}.*),
  'lens', to_jsonb(${LENSES}.*),
  'developer', to_jsonb(${DEVELOPERS_IMAGES_META}.*)
) AS meta
FROM ${IMAGES_META}
JOIN ${IMAGES} ON ${IMAGES_META}.id = ${IMAGES}.id
JOIN ${CAMERAS} ON ${IMAGES_META}.camera = ${CAMERAS}.id
JOIN ${FILMS} ON ${IMAGES_META}.film = ${FILMS}.id
LEFT JOIN ${LENSES} ON ${IMAGES_META}.lens = ${LENSES}.id
LEFT JOIN ${DEVELOPERS_IMAGES_META} ON ${IMAGES_META}.id = ${DEVELOPERS_IMAGES_META}.image`;

export const SELECT_IMAGE_BY_ID = `WITH data AS (
  ${BASE_SELECT}
  WHERE ${IMAGES_META}.id = $1
)
SELECT data.*
FROM data;
`;

export const SELECT_IMAGES = `WITH data AS (
  ${BASE_SELECT}
  WHERE (${IMAGES_META}.camera = $3 OR $3 IS NULL)
  AND (${IMAGES_META}.lens = $4 OR $4 IS NULL)
  AND (${IMAGES_META}.film = $5 OR $5 IS NULL)
  ORDER BY ${IMAGES}.created_at DESC,
  ${IMAGES_META}.date DESC
  LIMIT $1
  OFFSET $2
),
page_meta AS (
  SELECT COUNT(*) AS entries,
  CEIL(COUNT(*) / $1::REAL) AS pages,
  CEIL(($2 + 1) / $1::REAL) AS page
  FROM ${IMAGES_META}
  WHERE (${IMAGES_META}.camera = $3 OR $3 IS NULL)
  AND (${IMAGES_META}.lens = $4 OR $4 IS NULL)
  AND (${IMAGES_META}.film = $5 OR $5 IS NULL)
)
SELECT jsonb_agg(data) AS data, to_jsonb(page_meta) AS meta
FROM data, page_meta
GROUP BY page_meta.*;
`;
