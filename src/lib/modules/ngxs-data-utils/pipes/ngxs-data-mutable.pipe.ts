import { Pipe, PipeTransform } from '@angular/core';
import {
    DeepImmutableArray,
    DeepImmutableMap,
    DeepImmutableObject,
    Immutable,
    Mutable
} from '../../../interfaces/external.interface';

@Pipe({ name: 'mutable', pure: true })
export class NgxsDataMutablePipe implements PipeTransform {
    transform<T>(value: DeepImmutableArray<T> | null): T[];
    transform<T, K>(value: DeepImmutableMap<T, K> | null): Map<T, K>;
    transform<T>(value: DeepImmutableObject<T> | null): T;
    transform<T>(value: Immutable<T> | null): T;
    transform<T>(value: T | null): T;
    public transform<T>(value: T | null): Mutable<T> {
        return value as Mutable<T>;
    }
}
