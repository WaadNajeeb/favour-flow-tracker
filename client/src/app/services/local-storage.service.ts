import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {
  }

  public getItem<T>(key: string): T | null {
    key = this.getKey(key);
    const item = localStorage.getItem(key);

    if (item === null || item === undefined) {
      return null;
    }

    try {
      return JSON.parse(item);

    } catch {
      this.removeItem(key);
    }
    return null;
  }

  public setItem(key: string, value: any): boolean {
    try {
      key = this.getKey(key);
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  public removeItem(key: string) {
    key = this.getKey(key);
    console.log(key)
    localStorage.removeItem(key);
  }


  private getKey(key: string) {
    return key;
  }
}
