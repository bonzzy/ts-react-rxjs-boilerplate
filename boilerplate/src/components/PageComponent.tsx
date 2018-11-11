import * as React from 'react';
import {HotReloader} from '../HotReloader';

export interface PageComponentProps {
    className?: string;
}

export class PageComponent extends React.Component<PageComponentProps>{
    constructor(props: PageComponentProps) {
        super(props);

        HotReloader.accept('./components/PageComponents', this);
    }

    render() {
        return (
            <div>
                Hello ssssss  sss ssss
            </div>
        );
    }
}