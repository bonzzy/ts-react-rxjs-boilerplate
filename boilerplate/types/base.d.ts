declare module '*.css' {
    const names: {[name: string]: string};
    export default names;
}

declare module '*.scss' {
    const names: {[name: string]: string};
    export default names;
}

declare module '*.svg' {
    const names: string;
    export default names;
}