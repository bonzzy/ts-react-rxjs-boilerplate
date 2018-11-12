import {Repository} from './Repository';
import {Observable} from 'rxjs';

export interface ObservableRepository<T> extends Repository<T> {
    getObservable(): Observable<T[]>;
}