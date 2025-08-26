import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cart, order, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number | undefined;
  cartData: cart[] | undefined;
  orderMsg: string | undefined;
  buyNowItem: product | undefined;

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    // --- Check for Buy Now product in navigation state ---
  const savedBuyNow = localStorage.getItem('buyNowItem');
  if (savedBuyNow) {
    this.buyNowItem = JSON.parse(savedBuyNow);

    if (this.buyNowItem) {  // ✅ type guard to avoid "possibly undefined"
      this.totalPrice = this.buyNowItem.price * (this.buyNowItem.quantity || 1);
    }

    return; // ✅ Skip cart loading
  }

  // Normal cart flow
  this.product.currentCart().subscribe((result) => {
    let price = 0;
    this.cartData = result;
    result.forEach((item) => {
      if (item.quantity) {
        price += (+item.price * +item.quantity);
      }
    });
    this.totalPrice = price + (price / 10) + 100 - (price / 10);
  });
}

  orderNow(data: { email: string, address: string, contact: string }) {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;

    if (this.totalPrice) {
      let orderData: order = {
        ...data,
        totalPrice: this.totalPrice,
        userId,
        id: undefined
      };

      // Delete from cart if not Buy Now
      if (!this.buyNowItem) {
        this.cartData?.forEach((item) => {
          setTimeout(() => {
            item.id && this.product.deleteCartItems(item.id);
          }, 700);
        });
      }

      this.product.orderNow(orderData).subscribe((result) => {
        if (result) {
          this.orderMsg = "Order has been placed";
          setTimeout(() => {
            this.orderMsg = undefined;
            localStorage.removeItem('buyNowItem');
            this.router.navigate(['/my-orders']);
          }, 4000);
        }
      });
    }
  }

}
