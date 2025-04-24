import { CartService } from '@/shared/services/cart.service';
import { ProductService } from '@/shared/services/product.service';
import { WishlistService } from '@/shared/services/wishlist.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent {
  data: any = [];
  isLoading=true
  baseSizeMrp: any;
  size: any;
  
  constructor(
    public wishlistService: WishlistService,
    public cartService: CartService,
    public router:Router,
    public productService: ProductService,
    public activatedRoute:ActivatedRoute,
  ) {
    // wishlistService.initializeCounter()
    this.getWishlistProducts2();
    sessionStorage.removeItem('product');
    sessionStorage.removeItem('baseSizeMrpId');
    sessionStorage.removeItem('SellingPrice');
    sessionStorage.removeItem('size');
  }

  // ngOnInit(): void {
  // }

  getWishlistProducts2() {
    this.wishlistService.getWishlistProducts2().subscribe((res) => {
      this.data = res;
      this.isLoading=false;
      if(this.data[0].stockId){
        this.productService.getAllBaseSize(this.data[0].stockId).subscribe((res: any) => {
          this.baseSizeMrp = res;
          for(let i=0;i<this.baseSizeMrp.length; i++){
            this.baseSizeMrp=this.baseSizeMrp[0].baseSizeMrpId;
          }
        });
      } 
    })
  }
 

  deletewishlist(id: number,del:boolean) {
    this.wishlistService.deletewishlist(id,del).subscribe(
      (res) => {
        if (res) {
          this.getWishlistProducts2();
        }
      },
      (error: string) => {
        console.log(error);
      }
    );
  }

  redirecttoproduct(product: any) {
    this.router.navigate(['/shop/shop-details/'], {
      queryParams: {
        stockId: product.stockId,
        type: product.type,
      },
      relativeTo: this.activatedRoute,
    });
  }

}
