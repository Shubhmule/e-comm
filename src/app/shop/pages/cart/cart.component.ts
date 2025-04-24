import { CartService } from '@/shared/services/cart.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  couponCode: number = 0;
  shipCost: number = 0;
  data: any = [];
  price: number = 0;
  isLoading = true;
  isOffer=false;
  SubTotal:number = 0.00;
  noremovedPro:boolean=true;
  constructor(
    public cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
  ) {
    this.getCartProductstwo();
    sessionStorage.removeItem('product');
  }

  getCartProductstwo(): void {
    this.cartService.getCartProductstwo().subscribe((res) => {
      this.data = res;
      this.isLoading = false;
      this.calculateOffer();
    });
  }

  getSubTotal()
  {
    this.SubTotal=0;
    this.data.map((item: { sellingPrice: number; mrp:number;offerPrice:number;quantityInKit:number;salesGst:number}) => {
      
      this.SubTotal+=(item.sellingPrice*item.quantityInKit)+(item.sellingPrice*item.quantityInKit)*(item.salesGst/100)
    })
    this.SubTotal = parseFloat(this.SubTotal.toFixed(2));
  }
  getTotalPrice() {
    return this.data.reduce((total: number, item: any) => {
        if (parseInt(item.sellingPrice) === 0) {
          item.sellingPrice = item.mrp;
        }
        total += (item.sellingPrice * item.quantityInKit) + ((item.sellingPrice*item.quantityInKit)*(item.salesGst/100));
        return total;
      }, 0)
      .toFixed(2);
  }

  handleCouponSubmit() {
    // console.log(this.couponCode);
    // Add coupon code handling logic here
    if (this.couponCode) {
      // logic here
      // when submitted the from than empty will be coupon code
      // this.couponCode = '';
    }
  }

  handleShippingCost(value: number | string) {
    if (value === 'free') {
      this.shipCost = 0;
    } else {
      this.shipCost = value as number;
    }
  }

  removeCartProduct(payload: any): void {
      this.SubTotal-=(parseFloat(payload.sellingPrice)*payload.quantityInKit)+((parseFloat(payload.sellingPrice)*payload.quantityInKit)*(payload.salesGst/100))
      this.noremovedPro=false;
    this.cartService.removeCartProduct(payload.cartId).subscribe(
      (res) => {
          this.toastrService.success(res);
          this.getCartProductstwo();
      },
      (error: any) => {
        this.toastrService.success(error.error.text);
        this.getCartProductstwo();
      }
    );
  }

  incrementQuantity(product: any) {
    product.quantityInKit++;
    this.cartService
      .updateQuantity(product.id, product.quantityInKit, product.cartId)
      .subscribe();
    this.getTotalPrice();
    this.getSubTotal();
  }

  clearcart(userId: number): void {
    this.cartService.clear_cart(userId).subscribe({
      next: () => this.getCartProductstwo(), // Only run after cart is cleared
      error: (err) => this.getCartProductstwo(),
    });
  }

  clearcheckout(userId: number): void {
    this.cartService.clear_checkout(userId).subscribe({
      next: () => this.getCartProductstwo(), // Only run after cart is cleared
      error: (err) => this.getCartProductstwo(),
    });
  }
  decrementQuantity(product: any) {
    if (product.quantityInKit > 1) {
      product.quantityInKit--;
      this.cartService
        .updateQuantity(product.id, product.quantityInKit, product.cartId)
        .subscribe();
      this.getTotalPrice();
      this.getSubTotal();
    }
  }

  applicopupn(code: number) {
    let p = this.getTotalPrice();
    let price = (code * p) / 100;
    this.price = p - price;
  }

  redirecttoproduct(product: any) {
    this.router.navigate(['/shop/shop-details/'], {
      queryParams: {
        stockId: product.stockId,
        type: product.productType,
      },
      relativeTo: this.activatedRoute,
    });
  }

  calculateGST(sellingPrice:number,quantityInKit:number,salesGst:number)
  {
    return  (sellingPrice * quantityInKit) + ((sellingPrice * quantityInKit) * (salesGst / 100))
  }


  getonepriceofthree(item:any)
  {
     if(+item.sellingPrice != 0)
    {
       return +item.sellingPrice ;
    }
    else if(+item.mrp != 0)
    {
         return +item.mrp ;
    }
    return 0;
  }



  calculateOffer() {
    this.isOffer=false;
   this.data.map((item: { sellingPrice: number; offerDiscount: number; mrp:number;discount:number}) => {
    
    if(+item.mrp>0)
    {
      if(+item.sellingPrice>0)
      {
        if(+item.discount>0)
        {
          item.sellingPrice = item.sellingPrice -(+item.sellingPrice * item.discount) / 100;
        }
        if(+item.offerDiscount>0)
        {
          item.sellingPrice =item.sellingPrice - (+item.sellingPrice * item.offerDiscount) / 100;
        }
      }
      else{
        item.sellingPrice=item.mrp;
        if(+item.discount>0)
          {
            item.sellingPrice = item.sellingPrice -(+item.sellingPrice * item.discount) / 100;
          }
          if(+item.offerDiscount>0)
          {
            item.sellingPrice = item.sellingPrice -(+item.sellingPrice * item.offerDiscount) / 100;
          }
      }
    }
  
  
  });
  console.log("Updated Cart Data with Offer Price:", this.data);
  this.getSubTotal();
}

}
