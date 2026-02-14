import { invoke, convertFileSrc } from "@tauri-apps/api/core";
import loaders, { LoaderContext, LoaderExecute, Platform } from "./platforms";

declare const $loader$: LoaderExecute<LoaderContext>;
declare const $url$: string;
declare global {
    interface Window {
        __TAURI_INTERNALS__: {
            invoke: typeof invoke;
            convertFileSrc: typeof convertFileSrc;
        }
    }
}
type Injector = (context: LoaderContext, url: string) => Promise<void>;
type InjectionRunner = (inject: Injector, initialContext: LoaderContext) => Promise<void>;

function iifeFunction(func: (...args: any[]) => unknown, fixObjectMethod: boolean, vars: LoaderContext = {}) {
    let result = `(${fixObjectMethod ? "function " : ""}${func})`;
    for (const [key, value] of Object.entries(vars)) {
        result = result.replaceAll(`$${key}$`, String(value));
    }
    return result;
}
function iifeCall(iifed: string, args?: unknown[]) {
    return `${iifed}(${args?.join(",") ?? ""})`;
}
export function go(platform: Platform, url: URL) {
    const { invoke } = window.__TAURI_INTERNALS__;
    const inject: Injector = async (context, url) => {
        function createOverlay(text: string) {
            const result = document.createElement("div");
            result.style.position = "fixed";
            result.style.left = "0";
            result.style.top = "0";
            result.style.width = "100vw";
            result.style.height = "100vh";
            result.style.color = "white";
            result.style.backgroundColor = "orange";
            result.style.display = "flex";
            result.style.alignItems = "center";
            result.style.justifyContent = "center";
            result.style.zIndex = "999999";
            result.textContent = text;
            document.body.appendChild(result);
            return result;
        }
        const { invoke } = window.__TAURI_INTERNALS__;
        const overlay = createOverlay("正在加载拓展！给我9999金碧才能加速！");
        console.log("正在下载拓展源码：", url);
        const code = await invoke("get", { url }) as string;
        console.log("下载完成");
        context = structuredClone(context);
        const req = async () => {
            let running = true;
            const stop = () => {
                running = false;
                overlay.remove();
            };
            await $loader$(stop, context, code);
            if (running) requestAnimationFrame(req);
        };
        requestAnimationFrame(req);
    }
    const runner: InjectionRunner = async (inject, initialContext) => {
        // todo：添加hmr拓展来获取runtime
        // await inject(initialContext,);
        const ws = new WebSocket(new URL("/ws", $url$));
        const handler = async (e: MessageEvent) => {
            try {
                const data = JSON.parse(e.data);
                if (data.type === "ok") {
                    console.log("收到ok消息，重新执行runner");
                    inject(initialContext, $url$);
                }
            } catch (e) {
                alert(`Webpack没有发来json，解析失败：${e}，你确定这是fscontext的开发服务器地址？`);
            }
        };
        ws.addEventListener("message", handler);
        ws.addEventListener("error", () => alert(`连接开发服务器失败！你确定这是fscontext的开发服务器地址？？？`));
    };
    const loader = loaders[platform];
    const vars = {
        loader: iifeFunction(loader.run, true),
        url: `"${url}"`
    }
    const runnerIIFE = iifeFunction(runner, false, vars);
    const injectIIFE = iifeFunction(inject, false, vars);
    const code = iifeCall(runnerIIFE, [injectIIFE, JSON.stringify(loader.initialContext)]);
    invoke("navigate", {
        config: {
            url: loader.url,
            run_after: code,
        }
    });
}