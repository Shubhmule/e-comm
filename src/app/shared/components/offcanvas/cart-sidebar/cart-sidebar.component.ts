import { Component } from '@angular/core';
import { CartService } from '@/shared/services/cart.service';

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.scss']
})
export class CartSidebarComponent {
  data:any=[];

  constructor(public cartService:CartService){
    this.getCartProductstwo()
  }

  getCartProductstwo() {
    this.cartService.getCartProductstwo().subscribe((res) => {
      this.data = res;
    });
  }

  getTotalPrice() {
    return this.data.reduce((total:number, item:any) => {
      if (item.stockResponse.minmrp) {
        total += item.stockResponse.minmrp; 
      }
      return total;
    }, 0).toFixed(2); 
  }

  removeCartProduct(payload: any): void {
    this.cartService.removeCartProduct(payload).subscribe(
      (res) => {
        if (res) {
          console.log('res----------->', res);
        }
      },
      (error: string) => {
        this.getCartProductstwo();

        console.log(error);
      }
    );
  }


}
