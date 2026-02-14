import { Loader, LoaderContext } from ".";

export function defineLoader<T extends LoaderContext>(data: Loader<T>) {
    return data;
}