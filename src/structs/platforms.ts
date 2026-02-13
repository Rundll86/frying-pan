export const platforms = ["TurboWarp", "GandiIDE"] as const;
export type Platform = typeof platforms[number];
export const loaders: Record<Platform, {
    url: string;
    run(stop: () => void): void;
}> = {
    TurboWarp: {
        url: "https://turbowarp.org/editor?lang=zh-CN",
        run(stop) {
            const btn = document.querySelector("button[title='添加扩展']");
            if (btn) {
                console.log(btn);
                stop();
            }
        },
    },
    GandiIDE: {
        url: "https://ccw.site/gandi/extension",
        run() {
            //pass
        },
    }
};
export default loaders;