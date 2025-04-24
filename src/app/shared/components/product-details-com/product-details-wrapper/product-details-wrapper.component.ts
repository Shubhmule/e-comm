import { Component, Input } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { CartService } from '@/shared/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '@/shared/services/utils.service';

@Component({
  selector: 'app-product-details-wrapper',
  templateUrl: './product-details-wrapper.component.html',
  styleUrls: ['./product-details-wrapper.component.scss'],
})
export class ProductDetailsWrapperComponent {
  @Input() product!: any;
  @Input() isShowBottom: boolean = true;
  @Input() productD: any = {};

  baseSizeMrp: any[] = [];
  requiredBaseSize: any[] = [];

  stockId!: string;
  textMore = true;

  mrp!: number;
  baseSizeMrpId!: number;
  sellingPrice!: number;
  originalPrice!: number;
  selectedSize: string = 'S';

  userId: any;
  userName: any;
  isLoggedIn: boolean = false;

  discount: number = 0;
  discountAmount: number = 0;
  dis: number = 0;
  finaldiscount: number | null = null;

  offerName: string | null = null;
  offer: any[] = [];
  offerId: number = 0;

  halfStars: number = 0;

  constructor(
    public productService: ProductService,
    public util: UtilsService,
    public cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.initUser();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.stockId = params['stockId'];
      if (this.stockId) this.fetchBaseSizes(this.stockId);
    });
  }

  ngOnInit() {}

  initUser() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      this.userId = user?.id;
      this.userName = `${user.firstName} ${user.lastName}`;
      this.isLoggedIn = !!this.userId;
    }
  }

  fetchBaseSizes(stockId: string) {
    this.productService.getAllBaseSize(stockId).subscribe((res: any) => {
      this.baseSizeMrp = res || [];

      const firstItem = this.baseSizeMrp[0];
      if (firstItem) {
        this.selectedSize = firstItem.size;
        this.mrp = firstItem.mrp;
        this.baseSizeMrpId = firstItem.baseSizeMrpId;
        this.sellingPrice = firstItem.sellingPrice;
        this.originalPrice = firstItem.sellingPrice;
        this.dis = firstItem.discount;
        this.getOffer(firstItem.productId);
      }
    });
  }

  getOffer(productId: any) {
    this.productService.getoffer(productId).subscribe((res: any) => {
      this.offer = res || [];
    });
  }

  discountCalculation(item: any) {
    this.offerId = item.offerId;
    this.offerName = item.offerName;

    if (item.offerCategoryId?.isActive) {
      this.discount = item?.discount;
      this.discountAmount = (this.originalPrice * this.discount) / 100;
      this.finaldiscount = this.originalPrice - this.discountAmount;
    }
  }

  removeOffer(name: any) {
    if (this.offerName === name) {
      this.offerName = null;
      this.finaldiscount = null;
      this.sellingPrice = this.originalPrice;
    }
  }

  onProductSelected(item: any) {
    this.baseSizeMrpId = item.baseSizeMrpId;
    this.selectedSize = item.size;
    this.sellingPrice = item.sellingPrice;
    this.mrp = item.mrp;
  
    // Recalculate discount if an offer is already selected
    if (this.offerName) {
      const selectedOffer = this.offer.find((o) => o.offerName === this.offerName);
      if (selectedOffer && selectedOffer.offerCategoryId?.isActive) {
        const discountAmount = (item.sellingPrice * selectedOffer.discount) / 100;
        this.finaldiscount = item.sellingPrice - discountAmount;
      } else {
        this.finaldiscount = 0;
      }
    } else {
      this.finaldiscount = 0;
    }
  }
  

  handleTextToggle() {
    this.textMore = !this.textMore;
  }

  handleIsColorVariant(product: any) {
    return !!product.colour;
  }

  redirecttoWishlistPage() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/pages/login']);
    }
  }

  buynow(productD: any, sellingPrice: any) {
    sessionStorage.setItem('product', JSON.stringify(productD));
    sessionStorage.setItem('size', JSON.stringify(this.selectedSize));
    sessionStorage.setItem(
      'baseSizeMrpId',
      JSON.stringify(this.finaldiscount || this.sellingPrice || this.util.data.minmrp)
    );
    this.requiredBaseSize = this.baseSizeMrp.filter(
      (item) => item.size === this.selectedSize
    );
    sessionStorage.setItem('reqBaseSize', JSON.stringify(this.requiredBaseSize));
    this.router.navigate(['/pages/checkout']);
  }

  getStars(rating: number): any[] {
    return new Array(Math.floor(rating));
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0;
  }

  getEmptyStars(rating: number): any[] {
    const halfStar = this.hasHalfStar(rating) ? 1 : 0;
    return new Array(5 - Math.floor(rating) - halfStar);
  }
}
