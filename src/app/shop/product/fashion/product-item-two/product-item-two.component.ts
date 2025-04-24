import { Component, Input } from '@angular/core';
import { CartService } from '@/shared/services/cart.service';
import { WishlistService } from '@/shared/services/wishlist.service';
import { IProduct } from '@/types/product-type';
import { CompareService } from '@/shared/services/compare.service';
import { UtilsService } from '@/shared/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-item-two',
  templateUrl: './product-item-two.component.html',
  styleUrls: ['./product-item-two.component.scss']
})
export class ProductItemTwoComponent {
  // @Input() product!: IProduct;
  @Input() product!: any;
  @Input() spacing: Boolean = true;
  halfStars:number=0;

  constructor(
    public cartService: CartService,
    public wishlistService: WishlistService,
    public compareService: CompareService,
    public utilsService: UtilsService,
    public router : Router,
    private activatedRoute: ActivatedRoute,
  ) {
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
    return false;
  }
  isItemInWishlist(item: IProduct): boolean {
    return this.wishlistService.getWishlistProducts().some((prd: IProduct) => prd.id === item.id);
  }
  isItemInCompare(item: IProduct): boolean {
    return this.compareService.getCompareProducts().some((prd: IProduct) => prd.id === item.id);
  }
  productStatus(product: IProduct): boolean {
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

  getStars(rating: number): any[] {
    return new Array(Math.floor(rating)); 
  }
  hasHalfStar(rating: number): boolean {
    this.halfStars=this.halfStars+1;
    return rating % 1 !== 0; 
  }

  getEmptyStars(rating: number): any[] {
    let halfStar = this.hasHalfStar(rating) ? 1 : 0;  
    return new Array(5 - Math.floor(rating)-halfStar); 
  }
}
