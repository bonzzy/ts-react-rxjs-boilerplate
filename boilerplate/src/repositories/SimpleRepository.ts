import {SimpleModel} from '../models/SimpleModel';
import {Subject} from 'rxjs';
import {ObservableRepository} from './ObservableRepository';

export class SimpleRepository implements ObservableRepository<SimpleModel> {
    private observable: Subject<SimpleModel[]> = new Subject();
    private data: SimpleModel[] = [];
    private static instance = new SimpleRepository();

    public static getInstance(): SimpleRepository {
        return this.instance;
    }

    private constructor() {}

    async remove(simpleModel: SimpleModel): Promise<SimpleModel> {
        this.data = this.data.filter((data: SimpleModel) => {
            return data.id !== simpleModel.id;
        });
        this.observable.next(this.data);
        return simpleModel;
    }

    async add(simpleModel: SimpleModel): Promise<SimpleModel> {
        this.data.push(simpleModel);
        this.observable.next(this.data);

        return simpleModel;
    }

    getObservable(): Subject<SimpleModel[]> {
        return this.observable;
    }

    async getAll() {
        return this.data;
    }

    async removeAll() {
        this.data = [];
        this.observable.next(this.data);
        return this.data;
    }
}