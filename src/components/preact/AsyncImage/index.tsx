import { getImageURL, ImageOptions } from "@utils/image";
import type { FunctionComponent } from "preact";
import { useMemo } from "preact/hooks";

export interface AsyncImageProps {
  src: string;
}

export const AsyncImage: FunctionComponent<AsyncImageProps> = (props) => {
  const src = useMemo(() => {
    const options: ImageOptions = {
      href: "/api/image/" + props.src,
      w: 360,
      h: 360,
      fit: "cover",
    };

    return getImageURL(options);
  }, [props.src]);

  return <img src={src} alt="" width="360" height="360" />;
};
