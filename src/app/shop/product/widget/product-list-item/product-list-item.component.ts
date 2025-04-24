import { Component,Input } from '@angular/core';
import { IProduct } from '@/types/product-type';
import { CartService } from '@/shared/services/cart.service';
import { CompareService } from '@/shared/services/compare.service';
import { WishlistService } from '@/shared/services/wishlist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '@/shared/services/utils.service';

@Component({
  selector: 'app-product-list-item',
  templateUrl: './product-list-item.component.html',
  styleUrls: ['./product-list-item.component.scss']
})
export class ProductListItemComponent {
  @Input() product!: any;

  constructor(
    public cartService: CartService,
    public wishlistService: WishlistService,
    public compareService: CompareService,
    public router : Router,
    private activatedRoute: ActivatedRoute,
    public utilsService:UtilsService,

  ) {
    console.log(this.product);
    
  }
  // add to cart
  addToCart(product: IProduct) {
    this.cartService.addCartProduct(product);
  }
  // add to cart
  addToWishlist(product: IProduct) {
    this.wishlistService.add_wishlist_product(product);
  }
  // add to cart
  addToCompare(product: IProduct) {
    this.compareService.add_compare_product(product);
  }

  // Function to check if an item is in the cart
  isItemInCart(item: IProduct): boolean {
    // return this.cartService.getCartProducts().some((prd: IProduct) => prd.id === item.id);
    return true
  }

  redirectToProductDetailsPage(product:any){
    this.router.navigate(['/shop/shop-details/'], {
        // queryParams: { type: product.stockId},
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
