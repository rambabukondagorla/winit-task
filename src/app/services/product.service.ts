import { DecimalPipe } from '@angular/common';
import { Injectable, PipeTransform } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { ProductModel } from '../models/product.model';
import { SortColumn, SortDirection } from './sortable.directive';

interface SearchResult {
  productList: ProductModel[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(products: ProductModel[], column: SortColumn, direction: string): ProductModel[] {
  if (direction === '' || column === '') {
    return products;
  } else {
    return [...products].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(product: ProductModel, term: string, pipe: PipeTransform) {
  return product.title.toLowerCase().includes(term.toLowerCase())
    || product.category.toLowerCase().includes(term.toLowerCase())
    || product.imageUrl.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(product.price).includes(term);
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _products$ = new BehaviorSubject<ProductModel[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  productList: ProductModel[];
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe,
    private db: AngularFireDatabase,
    private toastrService: ToastrService
  ) {
    this.getAll()
      .subscribe(
        response => {
          this.productList = response;
          this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()),
            delay(200),
            tap(() => this._loading$.next(false))
          ).subscribe(result => {
            this._products$.next(result.productList);
            this._total$.next(result.total);
          });
          this._search$.next();
        });
  }
  get products$() { return this._products$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let products = sort(this.productList, sortColumn, sortDirection);

    // 2. filter
    products = products.filter(products => matches(products, searchTerm, this.pipe));
    const total = products.length;

    // 3. paginate
    products = products.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ productList: products, total });
  }
  create(product: ProductModel) {
    this.toastrService.success('Product saved successfully...!');
    return this.db.list('/products').push(product);
  }
  getAll() {
    return this.db.list('products').snapshotChanges().pipe(map((changes: any) => {
      return changes.map((c: any) => ({ id: c.payload.key, ...c.payload.val() as ProductModel }));
    }));
  }
  getById(productId: string) {
    return this.db.object('/products/' + productId).valueChanges();
  }

  update(productId: string, product: ProductModel) {
    this.toastrService.success('Product saved successfully...!');
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId: string) {
    this.toastrService.success('Product deleted successfully...!');
    return this.db.object('/products/' + productId).remove();
  }
}
