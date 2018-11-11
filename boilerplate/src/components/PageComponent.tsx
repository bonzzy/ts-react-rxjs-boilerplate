import * as React from 'react';
import {SimpleComponent} from './SimpleComponent';
import {SimpleModel} from '../models/SimpleModel';
import {SimpleRepository} from "../repositories/SimpleRepository";

export interface PageComponentProps {
    models: SimpleModel[];
}

export interface PageComponentState {
    models: SimpleModel[];
}

export class PageComponent extends React.Component<PageComponentProps, PageComponentState> {
    private models: SimpleModel[] = [];

    constructor(props: PageComponentProps) {
        super(props);

        this.state = {
            models: this.models,
        };

        this.loadModels();
        this.addObserable();

        const model = new SimpleModel('New model', 'New model description');
        setTimeout(() => {
            this.addModel(model);
        }, 2000);
    }

    async loadModels() {
        const repository = SimpleRepository.getInstance();
        this.models = await repository.getAll();
        this.setState({models: this.models});
    }

    addObserable() {
        const repository = SimpleRepository.getInstance();
        const a = repository.getObservable();
        a.subscribe((models: SimpleModel[]) => {
            this.models = models;
            this.setState({});
        });
    }

    async addModel(simpleModel: SimpleModel): Promise<SimpleModel> {
        const repository = SimpleRepository.getInstance();
        return await repository.add(simpleModel);
    }

    render() {
        return (
            <div>
                {this.models.map((simpleModel: SimpleModel) => {
                    return (<SimpleComponent key={simpleModel.id} model={simpleModel}/>);
                }, '')}
                <button onClick={this.addNewDummyModel}>Add new model</button>
                <button onClick={this.removeAllModels}>Reset</button>
            </div>
        );
    }

    private addNewDummyModel() {
        const repository = SimpleRepository.getInstance();
        const model = new SimpleModel('New dummy model', 'New dummy model description');
        repository.add(model);
    }

    private removeAllModels() {
        const repository = SimpleRepository.getInstance();
        repository.removeAll();
    }
}