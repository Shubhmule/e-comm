import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '@/types/product-type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environment/environment';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

const state = {
  cart_products: JSON.parse(sessionStorage['cart_products'] || '[]'),
};

const token = {
  accessToken: JSON.parse(sessionStorage['accessToken'] || '[]'),
};

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private countercartkey = 'countercartkey';

  public orderQuantity: number = 1;
  public isCartOpen: boolean = false;
  constructor(private toastrService: ToastrService, private http: HttpClient, private router: Router) {}

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${token.accessToken}`,
      'Content-Type': 'application/json',
    });
  }

  placeOrder(orderRequest:any)
  {
    
     return this.http.post(`${environment.apiBase}/order/place/order`, orderRequest );
    // return this.http.post(`${environment.apiBase}/order/place`, { orderRequest });
  }


  setCount(count: number): void {
    sessionStorage.setItem(this.countercartkey, count.toString());
  }

  getcartCount(): number {
    const count = sessionStorage.getItem(this.countercartkey);
    return count ? parseInt(count, 10) : 0;
  }

  incrementcount(): void {
    const currentCount = this.getcartCount();
    this.setCount(currentCount + 1);
  }

  decrementcount(): void {
    const currentCount = this.getcartCount();
    if (currentCount > 0) {
      // Ensure count doesn't go negative
      this.setCount(currentCount - 1);
    }
  }

  isBilling(userId: number) {
    return this.http.get(`${environment.apiBase}/address/isbilling/` + userId);
  }

  getUserDetails(id: number) {
    return this.http.get(`${environment.apiBase}/api/user/getById/` + id);
  }

  public getCartProducts(): any {
     return this.http.get(`${environment.apiBase}/cart-list/all`);
  }

  getaddress(userId: any) {
    return this.http.get(`${environment.apiBase}/address/type/` + userId);
  }

  getCartProductstwo() {
    return this.http.get<any[]>(`${environment.apiBase}/cart-list/all`, {
      headers: this.getHeaders(),
    });
  }

  handleOpenCartSidebar() {
    this.isCartOpen = !this.isCartOpen;
  }

  addCartProduct(payload: any,baseSizeMrpId:any=0,offerId:any=0) {
    this.http
      .post(
        `${environment.apiBase}/cart-list/add/to/cart`,
        {
          baseSizeMrpId:baseSizeMrpId || 0,
          stockId:payload.stock_id || payload.stockId,
          productId:payload.product_id || payload.productId,
          offerId:offerId,
          productAmount: 0,
          quantityInKit: 0,
          userId: 0,
        },
        { headers: this.getHeaders(), responseType: 'text' }
      )
      .subscribe(
        (response: any) => {
          this.toastrService.success(`Product successfully added to cart!`);
          this.incrementcount();
          // console.log('Successfully added to cart:', response);
        },
        (error):any => {
          // const errorResponse = JSON.parse(error.error);
          if (error.status == 401) {
            this.router.navigate(['/pages/login']);
          } else {
            return this.toastrService.error(
              'This Product is already added to cart'
            );
          }
        }
      );
  }

  // total price quantity
  public totalPriceQuantity() {
    return state.cart_products.reduce(
      (cartTotal: { total: number; quantity: number }, cartItem: IProduct) => {
        const { price, orderQuantity, discount } = cartItem;
        if (typeof orderQuantity !== 'undefined') {
          if (discount && discount > 0) {
            // Calculate the item total with discount
            const itemTotal =
              (price - (price * discount) / 100) * orderQuantity;
            cartTotal.total += itemTotal;
          } else {
            // Calculate the item total without discount
            const itemTotal = price * orderQuantity;
            cartTotal.total += itemTotal;
          }
          cartTotal.quantity += orderQuantity;
        }
        return cartTotal;
      },
      {
        total: 0,
        quantity: 0,
      }
    );
  }

  // quantity increment
  increment() {
    return (this.orderQuantity = this.orderQuantity + 1);
  }

  // quantity decrement
  decrement() {
    return (this.orderQuantity =
      this.orderQuantity > 1
        ? this.orderQuantity - 1
        : (this.orderQuantity = 1));
  }

  // quantityDecrement
  quantityDecrement(payload: IProduct) {
    state.cart_products.map((item: IProduct) => {
      if (item.id === payload.id) {
        if (typeof item.orderQuantity !== 'undefined') {
          if (item.orderQuantity > 1) {
            item.orderQuantity = item.orderQuantity - 1;
            this.toastrService.info(`Decrement Quantity For ${item.title}`);
          }
        }
      }
      return { ...item };
    });
    sessionStorage.setItem('cart_products', JSON.stringify(state.cart_products));
  }

  initializeCounter(): void {
    this.getCartProductstwo().subscribe(
      (products) => {
        const count = products.length; // Get the length of the wishlist
        this.setCount(count); // Set the initial count value
      },
      (error) => {
        console.error('Error fetching wishlist products', error);
        this.setCount(0); // In case of error, set count to 0
      }
    );
  }

  removeCartProduct(cartId: any): Observable<any> {
    // state.cart_products = state.cart_products.filter(
    //   (p: IProduct) => p.id !== payload.id
    // );
    // sessionStorage.setItem('cart_products', JSON.stringify(state.cart_products));
    // this.toastrService.error(
    //   `${payload.stockResponse.productName} is removed from Cart`
    // );
    this.decrementcount();
    return this.http.delete<any>(
      `${environment.apiBase}/cart-list/removefromcart/${cartId}`,
      { headers: this.getHeaders() }
    );
  }

  // clear cart
  // clear_cart(userId: number) {
  //   const confirmMsg = window.confirm('Are you sure you want to delete all cart items?');
  //   if (confirmMsg) {
  //     this.http.delete<any>(`${environment.apiBase}/cart-list/delete-orders/${userId}`,
  //       { headers: this.getHeaders() }
  //     ).subscribe(
  //       (res) => {
  //         console.log('Cart cleared successfully:', res);
  //         state.cart_products = []; // Clear state only after API success

  //         // sessionStorage.setItem(this.countercartkey, "0");; // Update sessionStorage
  //       },
  //       (error) => {
  //         console.error('Error clearing cart:', error);
  //       }
  //     );
  //     this.setCount(0)
  //   }

  // }

  clear_cart(userId: number): Observable<any> {
    //if (!window.confirm('Are you sure you want to delete all cart items?'))
     // return of(null);

    // Optimistically clear UI before API response
    const previousCart = [...state.cart_products];
    state.cart_products = [];
    this.setCount(0);

    return this.http
      .delete<any>(`${environment.apiBase}/cart-list/delete-orders/${userId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        // tap(() => console.log('Cart cleared successfully')),
        catchError((error) => {
          console.error('Error clearing cart:', error);

          // Rollback if API fails
          state.cart_products = previousCart;
          this.setCount(previousCart.length);

          return throwError(() => error); // Properly propagate error
        })
      );
  }

  clear_checkout(userId: number): Observable<any> {
    // Optimistically clear UI before API response
    const previousCart = [...state.cart_products];
    state.cart_products = [];
    this.setCount(0);

    return this.http
      .delete<any>(`${environment.apiBase}/cart-list/delete-orders/${userId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        // tap(() => console.log('Cart cleared successfully')),
        catchError((error) => {
          console.error('Error clearing cart:', error);

          // Rollback if API fails
          state.cart_products = previousCart;
          this.setCount(previousCart.length);

          return throwError(() => error); // Properly propagate error
        })
      );
  }

  // initialOrderQuantity
  initialOrderQuantity() {
    return (this.orderQuantity = 1);
  }

  updateQuantity(
    productId: number,
    quantityInKit: number,
    cartId: number
  ): Observable<any> {
    return this.http.put(
      `${environment.apiBase}/cart-list/edit/cart/${cartId}`,
      { quantityInKit }
    );
  }
}
