export class HotReloader {
    static accept(componentPath: string, elemRoot: Document, render: React.ReactType) {
        // @ts-ignore
        if (module.hot === undefined) {
            return;
        }

        console.log("Acceept", componentPath)
        // @ts-ignore
        // module.hot.accept(componentPath, (updateComponents: string[]) => {
        //     console.log("Hot reloading PageComponent", updateComponents, componentPath);
        //     componentContext.setState({});
        // });
    }
}