import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: AngularFireDatabase) { }

  getAll(): Observable<Category> {
    return this.db.list('categories').snapshotChanges().pipe(map((changes: any) => {
      return changes.map((c: any) => ({ id: c.payload.key, ...c.payload.val() as Category }));
    }));
  }
}
