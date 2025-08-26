import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | product;
  productQuantity: number = 1;
  removeCart = false;
  cartData: product | undefined;
  selectedColor: string = ''; // <-- for color selection

  constructor(
    private activeRoute: ActivatedRoute,
    private product: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let productId = this.activeRoute.snapshot.paramMap.get('productId');
    console.warn(productId);

    productId && this.product.getProduct(productId).subscribe((result) => {
      this.productData = result;

      // check localCart
      let cartData = localStorage.getItem('localCart');
      if (productId && cartData) {
        let items = JSON.parse(cartData);
        items = items.filter((item: product) => productId === item.id.toString());
        this.removeCart = items.length > 0;
      }

      // check user cart
      let user = localStorage.getItem('user');
      if (user) {
        let userId = JSON.parse(user).id;
        this.product.getCartList(userId);

        this.product.cartData.subscribe((result) => {
          let item = result.filter(
            (item: product) => productId?.toString() === item.productId?.toString()
          );
          if (item.length) {
            this.cartData = item[0];
            this.removeCart = true;
          }
        });
      }
    });
  }

  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }

  addToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;

      // ✅ store selected color (fallback to first color if not chosen)
      this.productData.colors = this.selectedColor || this.productData.colors?.[0] || 'default';

      if (!localStorage.getItem('user')) {
        this.product.localAddToCart(this.productData);
        this.removeCart = true;
      } else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        let cartData: cart = {
          ...this.productData,
          colors: this.selectedColor || this.productData.colors?.[0] || 'default',
          productId: this.productData.id,
          userId
        };
        delete cartData.id;
        this.product.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.product.getCartList(userId);
            this.removeCart = true;
          }
        });
      }
    }
  }

  removeToCart(productId: number) {
    if (!localStorage.getItem('user')) {
      this.product.removeItemFromCart(productId);
    } else {
      console.warn('cartData', this.cartData);
      this.cartData &&
        this.product.removeToCart(this.cartData.id).subscribe((result) => {
          let user = localStorage.getItem('user');
          let userId = user && JSON.parse(user).id;
          this.product.getCartList(userId);
        });
    }
    this.removeCart = false;
  }

  buyNow(product: product) {
    localStorage.setItem(
      'buyNowItem',
      JSON.stringify({
        ...product,
        color: this.selectedColor || product.colors?.[0] || 'default',
        quantity: this.productQuantity || 1
      })
    );
    this.router.navigate(['/checkout']);
  }



selectColor(color: string) {
  this.selectedColor = color;
}
}
