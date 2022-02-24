import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { ShoppingCartService } from './services/shoppingcart.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { DecimalPipe } from '@angular/common';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShoppingCartSummaryComponent } from './shopping-cart-summary/shopping-cart-summary.component';
import { ProductQuantityComponent } from './product-quantity/product-quantity.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ProductsComponent,
    ProductFilterComponent,
    ProductCardComponent,
    ManageProductsComponent,
    ProductFormComponent,
    ShoppingCartComponent,
    ShoppingCartSummaryComponent,
    ProductQuantityComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: ProductsComponent },
      { path: 'manage-products', component: ManageProductsComponent },
      { path: 'manage-products/new', component: ProductFormComponent },
      { path: 'manage-products/:id', component: ProductFormComponent },
      { path: 'shopping-cart', component: ShoppingCartComponent }
    ]),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
    NgxPaginationModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [CategoryService, ProductService, ShoppingCartService, ToastrService, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
