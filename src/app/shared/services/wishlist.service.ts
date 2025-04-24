import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '@/types/product-type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Router } from '@angular/router';

const state = {
  wishlists: JSON.parse(sessionStorage['wishlist_products'] || '[]') as any[],
};


const token = {
  accessToken: JSON.parse(sessionStorage['accessToken'] || '[]'),
};

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private counterKey = 'counter';

  constructor(
    private toastrService: ToastrService,
    private _http: HttpClient, 
    private router: Router
  ) {}
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${token.accessToken}`,
      'Content-Type': 'application/json',
    });
  }
  public getCount(): number {
    const count = sessionStorage.getItem(this.counterKey);
    return count ? parseInt(count, 10) : 0; // If no count in sessionStorage, return 0
  }

  setCount(count: number): void {
    sessionStorage.setItem(this.counterKey, count.toString());
  }

  public getWishlistProducts() {
    return state.wishlists;
  }

  getWishlistProducts2() {
    return this._http.post<any[]>(
      `${environment.apiBase}/my-wish-list/baseproducts`,
      { headers: this.getHeaders() }
    );
  }

  initializeCounter(): void {
    this.getWishlistProducts2().subscribe(
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

  increment(): void {
    const currentCount = this.getCount();
    this.setCount(currentCount + 1);
  }

  decrement(): void {
    const currentCount = this.getCount();
    if (currentCount > 0) {
      // Ensure count doesn't go negative
      this.setCount(currentCount - 1);
    }
  }

  add_wishlist_product(payload: IProduct) {
      this._http
        .post(
          `${environment.apiBase}/my-wish-list`,
          {
            baseProductId: payload.stockId,
            productId: payload.productId,
          },
          { headers: this.getHeaders() }
        )
        .subscribe(
          (response: any) => {
            if (response.message == 'Added Successfully') {
              this.toastrService.success(`Product added to wishlist successfully`);
              this.increment();
            }else if(response.message == 'Wishlist already added'){
              this.toastrService.error(`This Product is already added to wishlist`);
            }
          },
          (error) => {
            if (error.status == 401) {
              this.router.navigate(['/pages/login']);
            } else {
              this.toastrService.error(error.message);
            }
          }
        );
    // }
  }

  // removeWishlist
  removeWishlist(payload: IProduct) {
    state.wishlists = state.wishlists.filter(
      (p: IProduct) => p.id !== payload.id
    );
    this.toastrService.error(`${payload.title} is removed from Wishlist.lhhh;
      `);
    sessionStorage.setItem('wishlist_products', JSON.stringify(state.wishlists));
  }

  public removeWishlist2(payload: any): Observable<any> {
    console.log(payload.wishListKey);
    return this._http.delete<any>(
      `${environment.apiBase}/my-wish-list/${payload.wishListKey}`,
      { headers: this.getHeaders() }
    );
  }

  deletewishlist(payload: any,del:boolean|undefined): Observable<any> {
    this.decrement();
    if(!del){
    this.toastrService.error(`${payload.productName} is removed from Wishlist.`);
    }
    return this._http.delete<any>(
      `${environment.apiBase}/my-wish-list/${payload.productId}/${payload.stockId}`,
      { headers: this.getHeaders() }
    );
  }
}
