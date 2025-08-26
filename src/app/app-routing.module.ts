import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CartPageComponent } from './cart-page/cart-page.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SearchComponent } from './search/search.component';
import { SellerAddProductComponent } from './seller-add-product/seller-add-product.component';
import { SellerAuthComponent } from './seller-auth/seller-auth.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';
import { SellerUpdateProductComponent } from './seller-update-product/seller-update-product.component';
import { UserAuthComponent } from './user-auth/user-auth.component';
import { ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '', component: HomeComponent, //default route
  },
  {
    path: 'seller-auth', component: SellerAuthComponent, //static route
  },
  {
    path:'seller-home', component:SellerHomeComponent, canActivate:[AuthGuard] //guarded route
 }, 
 {
    path:'seller-add-product', component:SellerAddProductComponent, canActivate:[AuthGuard]
  },
  {
    path:'seller-update-product/:id', component:SellerUpdateProductComponent, canActivate:[AuthGuard]
  },
  {
    path:'search/:query', component: SearchComponent,
    
  },{
    component:ProductDetailsComponent,
    path:'details/:productId' // dynamic route
  },{
    component:UserAuthComponent,
    path:'user-auth'
  },{
    component:CartPageComponent,
    path:'cart-page'
  },{
    component:CheckoutComponent,
    path:'checkout'
  },{
    component:MyOrdersComponent,
    path:'my-orders'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
     ReactiveFormsModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
