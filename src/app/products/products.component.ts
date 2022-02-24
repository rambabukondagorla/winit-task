import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { ShoppingCartService } from '../services/shoppingcart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  category: string;
  cart: any;
  parentData: string = 'Sreeram';
  subscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    public productService: ProductService,
    private shoppingCartService: ShoppingCartService
  ) {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  async ngOnInit() {
    this.subscription = (await this.shoppingCartService.getCart())
      .subscribe(cart => {
        this.cart = cart;
      });
    this.populateProducts();
  }
  private populateProducts() {
    this.productService
      .getAll()
      .pipe(switchMap(products => {
        this.products = products;
        console.log(products)
        return this.route.queryParamMap;
      }))
      .subscribe(params => {
        this.category = params.get('category');
        this.applyFilter();
      });
  }
  private applyFilter() {
    this.filteredProducts = (this.category) ?
      this.products.filter(p => p.category === this.category) :
      this.products;
  }

}
