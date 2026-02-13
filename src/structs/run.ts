import { invoke } from "@tauri-apps/api/core";
import loaders, { Platform } from "./platforms";

declare function $loader$(stop: () => void): void;

export async function go(platform: Platform, url: URL) {
    const runner = () => {
        const req = () => {
            let stop = false;
            $loader$(() => stop = true);
            if (!stop) requestAnimationFrame(req);
        };
        requestAnimationFrame(req);
    };
    const loader = loaders[platform];
    const code = `(${String(runner).replaceAll("$loader$", `(function ${loader.run})`)})()`;
    await invoke("navigate", {
        config: {
            url: loader.url,
            run_after: code
        }
    });
}