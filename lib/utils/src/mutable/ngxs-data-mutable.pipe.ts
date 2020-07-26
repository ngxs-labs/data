import { Immutable, Mutable } from '@angular-ru/common/typings';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mutable' })
export class NgxsDataMutablePipe implements PipeTransform {
    public transform<T>(value: Immutable<T> | null): Mutable<T>;
    public transform<T>(value: T | null): T;
    public transform<T>(value: Immutable<T> | T | null): T {
        return (value as Mutable<T>) as T;
    }
}
