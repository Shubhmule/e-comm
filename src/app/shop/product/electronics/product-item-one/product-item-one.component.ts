import { Component, Input } from '@angular/core';
import { custProduc, IProduct } from '@/types/product-type';
import { CartService } from '@/shared/services/cart.service';
import { WishlistService } from '@/shared/services/wishlist.service';
import { UtilsService } from '@/shared/services/utils.service';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-item-one',
  templateUrl: './product-item-one.component.html',
  styleUrls: ['./product-item-one.component.scss']
})
export class ProductItemOneComponent {
  @Input() product!: any;
  @Input() offer_style: Boolean | undefined;

  constructor(
    public cartService: CartService,
    public wishlistService: WishlistService,
    public utilsService: UtilsService,
    public router:Router,
    public activatedRoute:ActivatedRoute
  ) { }
  // add to cart
  addToCart(product: any) {
    this.cartService.addCartProduct(product);
  }
  // add to wiahliat
  addToWishlist(product: any) {
    this.wishlistService.add_wishlist_product(product);
  }

  // Function to check if an item is in the cart
  isItemInCart(item: any): boolean {
    // return this.cartService.getCartProducts().some((prd: IProduct) => prd.id === item.id);
     return false
  }
  isItemInWishlist(item: any): boolean {
    // console.log(this.wishlistService.getWishlistProducts2())
    return this.wishlistService.getWishlistProducts().some((prd: IProduct) => prd.id === item.id);
  }
  productStatus(product: any): boolean {
    return product.status === 'out-of-stock' || product.quantity === 0;
  }

  redirectToProductDetailsPage(product:any){
    this.router.navigate(['/shop/shop-details/'], {
        // queryParams: { type: stockId,},
        queryParams: { 'stockId': product.stockId,'type':product.type},
        relativeTo: this.activatedRoute,
      });
  }


  setQueryParam(product:any) {
    this.router.navigate([], {
      queryParams: { key: product },  // Setting the query param
      queryParamsHandling: 'merge',   // Keeps existing query params
    });
  }
}
