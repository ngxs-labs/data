import { Injectable } from '@angular/core';
import { AsyncStorageEngine } from '@ngxs-labs/async-storage-plugin';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NgxsDataAsyncStoragePlugin implements AsyncStorageEngine {

  constructor(
    private storage: StorageMap
  ) { }

  length(): Observable<number> {
    return this.storage.size;
  }

  getItem(key: any): Observable<any> {
    return this.storage.get(key);
  }

  setItem(key: any, val: any): void {
    this.storage.set(key, val);
  }

  removeItem(key: any): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  key(val: number): Observable<string> {
    return from(this.storage.keys().toPromise().then(keys => keys[val]));
  }

}
