import {SimpleModel} from '../models/SimpleModel';
import * as React from 'react';

export interface PageComponentState {
    model: SimpleModel;
}

export interface PageComponentProps extends PageComponentState {
    readonly model: SimpleModel;
}

export class SimpleComponent extends React.Component<PageComponentProps, PageComponentState> {
    render() {
        const model = this.props.model;

        return (
            <div>
                Simple Component
                <h2>{this.props.model.title}</h2>
                <p>
                    {this.props.model.description}
                </p>
            </div>
        );
    }
}