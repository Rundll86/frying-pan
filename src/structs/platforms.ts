export const platforms = ["TurboWarp", "GandiIDE"] as const;
export type Platform = typeof platforms[number];
export type LoaderContext = Record<string, string | number | boolean>;
export type LoaderExecute<T extends LoaderContext> = (stop: () => void, context: T, code: string) => void | Promise<void>;
export interface Loader<T extends LoaderContext> {
    url: string;
    run: LoaderExecute<T>;
    initialContext: T;
}
export function defineLoader<T extends LoaderContext>(data: Loader<T>) {
    return data;
}
declare global {
    interface HTMLTextAreaElement {
        _valueTracker: {
            setValue(old: string): void;
        };
    }
}
export const loaders = {
    TurboWarp: defineLoader({
        url: "https://turbowarp.org/editor?lang=zh-CN",
        run(stop, context, code) {
            if (context.exted) {
                if (context.customed) {
                    if (context.texted) {
                        if (context.inputed) {
                            const btns = document.querySelectorAll("button");
                            for (const btn of btns) {
                                if (btn instanceof HTMLButtonElement && btn.textContent === "加载") {
                                    btn.click();
                                    stop();
                                    break;
                                }
                            }
                        } else {
                            const ta = document.querySelector("textarea");
                            if (ta instanceof HTMLTextAreaElement) {
                                ta.value = code;
                                ta._valueTracker.setValue("");
                                ta.dispatchEvent(new Event("input", { bubbles: true, }));
                            }
                            const input = document.querySelector("input[type='checkbox']");
                            if (input instanceof HTMLInputElement) {
                                if (!input.checked) {
                                    input.click();
                                }
                                context.inputed = true;
                            }
                        }
                    } else {
                        const div = document.querySelector("div[data-active=false]:nth-child(3)");
                        if (div instanceof HTMLDivElement) {
                            div.click();
                            context.texted = true;
                        }
                    }
                } else {
                    const spans = document.querySelectorAll("span");
                    for (const span of spans) {
                        if (span instanceof HTMLSpanElement && span.innerHTML === "自定义扩展") {
                            span.click();
                            context.customed = true;
                            break;
                        }
                    }
                }
            } else {
                const btn = document.querySelector("button[title='添加扩展']");
                if (btn instanceof HTMLButtonElement) {
                    btn.click();
                    context.exted = true;
                }
            }
        },
        initialContext: {
            exted: false as boolean,
            customed: false as boolean,
            texted: false as boolean,
            inputed: false as boolean,
        }
    }),
    GandiIDE: {
        url: "https://ccw.site/gandi/extension",
        run() {
            //pass
        },
        initialContext: {}
    }
};
export default loaders;