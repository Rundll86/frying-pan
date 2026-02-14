import { defineLoader } from "../define";

export default defineLoader({
    url: "https://turbowarp.org/editor?lang=zh-CN",
    run(stop, context, code) {
        if (!context.exted) {
            const btn = document.querySelector("button[title='添加扩展']");
            if (btn instanceof HTMLButtonElement) {
                btn.click();
                context.exted = true;
            }
            return;
        }
        if (!context.customed) {
            const spans = document.querySelectorAll("span");
            for (const span of spans) {
                if (span instanceof HTMLSpanElement && span.innerHTML === "自定义扩展") {
                    span.click();
                    context.customed = true;
                    break;
                }
            }
            return;
        }
        if (!context.texted) {
            const div = document.querySelector("div[data-active=false]:nth-child(3)");
            if (div instanceof HTMLDivElement) {
                div.click();
                context.texted = true;
            }
            return;
        }
        if (!context.inputed) {
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
            return;
        }
        const btns = document.querySelectorAll("button");
        for (const btn of btns) {
            if (btn instanceof HTMLButtonElement && btn.textContent === "加载") {
                btn.click();
                stop();
                break;
            }
        }
    },
    initialContext: {
        exted: false as boolean,
        customed: false as boolean,
        texted: false as boolean,
        inputed: false as boolean,
    }
});