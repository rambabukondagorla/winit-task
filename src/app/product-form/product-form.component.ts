import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { ShoppingCartService } from '../services/shoppingcart.service';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  categories$: any;
  product: ProductModel = { id: null, title: null, category: null, price: 0, imageUrl: null };
  id;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private shopCartService: ShoppingCartService,
    private productService: ProductService) {
    this.categories$ = categoryService.getAll();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.productService.getById(this.id).pipe(take(1)).subscribe(product => {
        this.product = product as ProductModel;
      })
    }
  }

  save(product: any) {
    if (this.id)
      this.productService.update(this.id, product);
    else {
      let result = this.productService.create(product);
    }

    this.router.navigate(['/manage-products']);
  }

  delete() {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(this.id);
    this.router.navigate(['/manage-products']);
  }

  ngOnInit() {
  }
}
