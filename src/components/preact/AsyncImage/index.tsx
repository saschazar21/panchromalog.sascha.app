import type { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

export interface AsyncImageProps {
  src: string;
}

export const AsyncImage: FunctionComponent<AsyncImageProps> = ({ src }) => {
  const [count, setCount] = useState(0);

  const handleClick = (e: MouseEvent) => setCount((c) => c + 1);

  return (
    <>
      <img src={src} />
      <button onClick={handleClick}>Clicked {count} times</button>
    </>
  );
};
