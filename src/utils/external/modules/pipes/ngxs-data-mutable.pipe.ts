import { Pipe, PipeTransform } from '@angular/core';
import { Immutable, Mutable } from '../../../../interfaces/external.interface';

@Pipe({ name: 'mutable', pure: true })
export class NgxsDataMutablePipe implements PipeTransform {
    transform<T>(value: Immutable<T> | null): Mutable<T>;
    transform<T>(value: T | null): T;
    public transform<T>(value: Immutable<T> | T | null): T {
        return (value as Mutable<T>) as T;
    }
}
