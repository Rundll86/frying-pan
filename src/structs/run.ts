import { invoke, convertFileSrc } from "@tauri-apps/api/core";
import loaders, { LoaderContext, LoaderExecute, Platform } from "./platforms";

declare const $loader$: LoaderExecute<LoaderContext>;
declare const $context$: LoaderContext;
declare const $url$: string;
declare global {
    interface Window {
        __TAURI_INTERNALS__: {
            invoke: typeof invoke;
            convertFileSrc: typeof convertFileSrc;
        }
    }
}

export async function go(platform: Platform, url: URL) {
    const runner = async () => {
        const { invoke, convertFileSrc } = window.__TAURI_INTERNALS__;
        console.log("正在下载拓展源码：", $url$);
        const code = await invoke("get", { url: $url$ }) as string;
        console.log("下载完成");
        const context = $context$;
        const req = async () => {
            let stop = false;
            await $loader$(() => stop = true, context, code);
            if (!stop) requestAnimationFrame(req);
        };
        requestAnimationFrame(req);
        const ws = new WebSocket(new URL("/ws", $url$));
        const handler = (e: MessageEvent) => {
            try {
                const data = JSON.parse(e.data);
                if (data.type === "ok") {
                    ws.removeEventListener("message", handler);
                    invoke("navigate", {
                        config: {
                            url: convertFileSrc("index.html"),
                            run_after: "alert('sb')",
                        }
                    });
                }
            } catch (e) {
                alert(`Webpack没有发来json，解析失败：${e}，你确定这是fscontext的开发服务器地址？`);
            }
        };
        ws.addEventListener("message", handler);
        ws.addEventListener("error", () => alert(`连接开发服务器失败！你确定这是fscontext的开发服务器地址？？？`));
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
            run_after: code,
        }
    });
}