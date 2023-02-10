import type { SuspendedPictureProps } from "@components/preact/SuspendedPicture";
import type { Image } from "@utils/graphql/images/image";

export const getImageUrl = (path: string) => {
  const p = path.startsWith("/") ? path : "/" + path;

  return new URL(`/api/image${p}`, import.meta.env.SITE).toString();
};

export const mapImageDataToProps = ({
  id,
  meta,
  path,
}: Image): SuspendedPictureProps => ({
  alt: meta.alt,
  decoding: "async",
  formats: ["avif", "webp", "jpeg"],
  height: 123,
  id,
  loading: "lazy",
  sizes: "(min-width: 940px) 300px, 30vw",
  src: getImageUrl(path),
  width: 123,
  widths: [123, 256, 512, 600, 900],
});
