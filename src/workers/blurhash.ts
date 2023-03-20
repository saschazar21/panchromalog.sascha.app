import { decode } from "blurhash";

export interface BlurhashWorkerMessage {
  hash: string;
  height: number;
  width: number;
}

self.addEventListener(
  "message",
  ({ data }: MessageEvent<BlurhashWorkerMessage>) => {
    const { hash, height, width } = data;

    const message = {
      height,
      pixels: decode(hash, width, height),
      width,
    };

    return self.postMessage(message);
  }
);
