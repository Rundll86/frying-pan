import TurboWarp from "./platforms/tw";
import GandiIDE from "./platforms/gandi";

export const platforms = ["TurboWarp", "GandiIDE"] as const;
export type Platform = typeof platforms[number];
export type LoaderContext = Record<string, string | number | boolean>;
export type LoaderExecute<T extends LoaderContext> = ((stop: () => void, context: T, code: string) => void | Promise<void>);
export interface Loader<T extends LoaderContext = LoaderContext> {
    url: string;
    run: LoaderExecute<T>;
    initialContext: T;
}

declare global {
    interface HTMLTextAreaElement {
        _valueTracker: {
            setValue(old: string): void;
        };
    }
}
export const loaders = {
    TurboWarp,
    GandiIDE
};
export default loaders;