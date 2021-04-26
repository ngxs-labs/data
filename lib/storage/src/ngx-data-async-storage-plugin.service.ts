import { Injectable } from '@angular/core';
import { AsyncStorageEngine } from '@ngxs-labs/async-storage-plugin';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NgxsDataAsyncStoragePlugin implements AsyncStorageEngine {

  constructor(
    private storage: StorageMap
  ) { }

  /**
   * Returns the size of the storage
   */
  length(): Observable<number> {
    return this.storage.size;
  }

  /**
   * @param key: any
   * @description:
   * Returns an item by the given key
   */
  getItem(key: any): Observable<any> {
    return this.storage.get(key);
  }

  /**
   * @param key: any
   * @param val: any
   * @description:
   * Set value with the given key
   */
  setItem(key: any, val: any): void {
    this.storage.set(key, val);
  }

  /**
   * @description:
   * Removes an item by the given key
   */
  removeItem(key: any): void {
    this.storage.delete(key);
  }

  /**
   * @description:
   * Clear the storage
   */
  clear(): void {
    this.storage.clear();
  }

  /**
   * @param val: number
   * @description:
   * Returns the key by the given value
   */
  key(val: number): Observable<string> {
    return from(this.storage.keys().toPromise().then(keys => keys[val]));
  }

}
