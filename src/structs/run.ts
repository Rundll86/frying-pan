import { invoke } from "@tauri-apps/api/core";
import loaders, { LoaderContext, LoaderExecute, Platform } from "./platforms";

declare const $loader$: LoaderExecute<LoaderContext>;
declare const $context$: LoaderContext;
declare const $url$: string;
declare global {
    interface Window {
        __TAURI_INTERNALS__: {
            invoke: typeof invoke;
        }
    }
}

export async function go(platform: Platform, url: URL) {
    const runner = async () => {
        const { invoke } = window.__TAURI_INTERNALS__;
        console.log("正在下载拓展源码：", $url$);
        const code = await invoke("get", { url: $url$ }) as string;
        console.log("下载完成：", code);
        const context = $context$;
        const req = async () => {
            let stop = false;
            await $loader$(() => stop = true, context, code);
            if (!stop) requestAnimationFrame(req);
        };
        requestAnimationFrame(req);
    };
    const loader = loaders[platform];
    const iife = String(runner)
        .replaceAll("$loader$", `(function ${loader.run})`)
        .replaceAll("$context$", JSON.stringify(loader.initialContext))
        .replaceAll("$url$", `"${url}"`);
    const code = `(${iife})()`;
    await invoke("navigate", {
        config: {
            url: loader.url,
            run_after: code
        }
    });
}