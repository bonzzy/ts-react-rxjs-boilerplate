import * as React from 'react';
import {SimpleComponent} from './SimpleComponent';
import {SimpleModel} from '../models/SimpleModel';
import {SimpleRepository} from '../repositories/SimpleRepository';
import {SimpleAddFormComponent} from './SimpleAddFormComponent';

interface PageComponentProps {
    models: SimpleModel[];
}

interface PageComponentState {
    models: SimpleModel[];
}

export class PageComponent extends React.Component<PageComponentProps, PageComponentState> {
    constructor(props: PageComponentProps) {
        super(props);

        this.state = {
            models: [],
        };
        this.loadModels();
        this.addObserable();
    }

    async loadModels() {
        const repository = SimpleRepository.getInstance();
        this.setState({models: await repository.getAll()});
    }

    addObserable() {
        const repository = SimpleRepository.getInstance();
        const a = repository.getObservable();
        a.subscribe((models: SimpleModel[]) => {
            this.setState({models});
        });
    }

    render() {
        const {models} = this.state;

        return (
            <div>
                <SimpleAddFormComponent model={new SimpleModel('', '')}/>
                {models.map((simpleModel: SimpleModel) => {
                    return (<SimpleComponent key={simpleModel.id} model={simpleModel}/>);
                }, '')}
            </div>
        );
    }
}