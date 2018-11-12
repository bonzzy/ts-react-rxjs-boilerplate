import {Observable} from "rxjs";

export interface Repository<T> {
    add(model: T): Promise<T>;
    remove(model: T): Promise<T>;
}
