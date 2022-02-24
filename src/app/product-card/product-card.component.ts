import { Component, Input, OnInit } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { ShoppingCart } from '../models/shopping-cart';
import { ShoppingCartService } from '../services/shoppingcart.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  @Input('product') product: ProductModel;
  @Input('show-actions') showActions = true;
  @Input('shopping-cart') shoppingCart: ShoppingCart;

  constructor(private cartService: ShoppingCartService) {
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }
  removeFromCart() {
    this.cartService.removeFromCart(this.product);
  }
  getQuantity() {
    if (!this.shoppingCart) return 0;
    let item = this.shoppingCart.itemsMap[this.product.id];
    return item ? item.quantity : 0;
  }
}
