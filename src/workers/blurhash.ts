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

    console.log(hash);

    const message = {
      height,
      pixels: decode(hash, height, width),
      width,
    };

    return self.postMessage(message);
  }
);
