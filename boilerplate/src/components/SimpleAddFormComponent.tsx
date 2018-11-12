import * as React from 'react';
import {SimpleModel} from '../models/SimpleModel';
import {SimpleRepository} from '../repositories/SimpleRepository';
import {ChangeEvent} from 'react';

interface Props {
    model: SimpleModel;
}

interface State {
    model: SimpleModel;
}

enum InputName {
    title = 'title',
    description = 'description',
}

export class SimpleAddFormComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            model: props.model,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.addNew = this.addNew.bind(this);
        this.removeAllModels = this.removeAllModels.bind(this);

        const model = new SimpleModel('New model', 'New model description');
        setTimeout(() => {
            this.addModel(model);
        }, 2000);
    }

    render() {
        return (
            <div className='FormComponent'>
                <input className='FormComponent--simple-input' name={InputName.title}
                       type='text' placeholder={'Write title...'} onChange={this.handleInputChange}/>
                <input className='FormComponent--simple-input' name={InputName.description} type='text'
                       placeholder={'Write description...'} onChange={this.handleInputChange}/>
                <button onClick={this.addNew}>Add new</button>
                <button onClick={this.removeAllModels}>Remove all</button>
            </div>
        );
    }

    private async addModel(simpleModel: SimpleModel): Promise<SimpleModel> {
        const repository = SimpleRepository.getInstance();
        return await repository.add(simpleModel);
    }

    private addNew() {
        const repository = SimpleRepository.getInstance();
        const model = new SimpleModel(this.state.model.title, this.state.model.description);
        repository.add(model);
    }

    private removeAllModels() {
        const repository = SimpleRepository.getInstance();
        repository.removeAll();
    }

    private handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const target = event.target;

        if (target.name === InputName.title) {
            this.setState({
                model: new SimpleModel(target.value, this.state.model.description),
            });
        }

        if (target.name === InputName.description) {
            this.setState({
                model: new SimpleModel(this.state.model.title, target.value),
            });
        }
    }
}