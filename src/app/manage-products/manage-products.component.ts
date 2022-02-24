import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { SortEvent } from '../services/sortable.directive';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css'],
  providers: [ProductService, DecimalPipe]
})
export class ManageProductsComponent {

  products$: Observable<ProductModel[]>;
  total$: Observable<number>;
  defaultPage: number = 1;

  constructor(public service: ProductService) {
    this.products$ = service.products$;
    this.total$ = service.total$;
  }

  onSort({ column, direction }: any) {
    // resetting other headers
    // this.headers.forEach(header => {
    //   if (header.sortable !== column) {
    //     header.direction = '';
    //   }
    // });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
