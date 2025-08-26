import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cart, priceSummary } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartData: cart[] | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadDetails();
  }

  removeToCart(cartId: number | undefined) {
    cartId && this.cartData && this.product.removeToCart(cartId)
      .subscribe(() => {
        this.loadDetails();
      })
  }

  loadDetails() {
    this.product.currentCart().subscribe((result) => {
      this.cartData = result;

      if (!result || result.length === 0) {
        // Reset summary if empty cart
        this.priceSummary = {
          price: 0,
          discount: 0,
          tax: 0,
          delivery: 0,
          total: 0
        };
        return;
      }

      // ✅ Calculate price safely
      let price = 0;
      result.forEach((item) => {
        if (item.quantity) {
          // Convert price string ("1,00,000") into number
          const itemPrice = Number(String(item.price).replace(/,/g, ''));
          price += (itemPrice * +item.quantity);
        }
      });

      this.priceSummary.price = price;
      this.priceSummary.discount = price / 10;
      this.priceSummary.tax = price / 10;
      this.priceSummary.delivery = 100;
      this.priceSummary.total =
        price + this.priceSummary.tax + this.priceSummary.delivery - this.priceSummary.discount;
    });
  }

  checkout() {
    this.router.navigate(['/checkout'])
  }
}
