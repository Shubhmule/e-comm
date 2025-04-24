import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '@/shared/services/cart.service';
import { ProductService } from '@/shared/services/product.service';
import { UtilsService } from '@/shared/services/utils.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
})
export class ProductModalComponent implements OnInit {
  @Input() product!: any;
  @Input() isShowBottom: boolean = true;
  @Input() productD: any = {};

  baseSizeMrp: any[] = [];
  requiredBaseSize: any[] = [];

  stockId!: string;
  baseSizeMrpId!: number;
  selectedSize: string = '';
  sellingPrice: number = 0;
  originalPrice: number = 0;
  mrp: number = 0;

  offer: any[] = [];
  offerName: string = '';
  offerId: any;
  discount: number = 0;
  finaldiscount: number = 0;

  textMore = true;
  authentication: boolean = true;
  userId: any;
  useName: string = '';
  halfStars: number = 0;

  constructor(
    public productService: ProductService,
    public utilsService: UtilsService,
    public cartService: CartService,
    private activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.initializeUser();
    this.getdata();
  }

  ngOnInit() {
    console.log("this.utilsService.data", this.utilsService.data);
  }
  getStars(rating: number): any[] {
    const safeRating = Math.max(0, Math.floor(Number(rating) || 0));
    return new Array(safeRating);
  }
  hasHalfStar(rating: number): boolean {
    this.halfStars=this.halfStars+1;
    return rating % 1 !== 0; 
  }

  getEmptyStars(rating: number): any[] {
    const numericRating = Number(rating);
    if (isNaN(numericRating)) return new Array(5); 
    const fullStars = Math.floor(numericRating);
    const halfStar = this.hasHalfStar(numericRating) ? 1 : 0;
    const emptyStars = Math.max(0, 5 - fullStars - halfStar);
  
    return new Array(emptyStars);
  }

  initializeUser() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser || '{}');
      this.userId = parsedUser?.id;
      this.useName = `${parsedUser?.firstName || ''} ${parsedUser?.lastName || ''}`;
      this.authentication = !this.userId;
    }
  }

  getdata() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.stockId = params['key'];
      if (this.stockId) {
        this.productService.getAllBaseSize(this.stockId).subscribe((res: any) => {
          this.baseSizeMrp = res;
          const defaultSize = this.baseSizeMrp[0];
          if (defaultSize) {
            this.getoffer(defaultSize.productId);
            this.baseSizeMrpId = defaultSize.baseSizeMrpId;
            this.selectedSize = defaultSize.size;
            this.mrp = defaultSize.mrp;
            this.sellingPrice = defaultSize.sellingPrice;
            this.originalPrice = defaultSize.sellingPrice;
          }
        });
      }
    });
  }

  handleTextToggle() {
    this.textMore = !this.textMore;
  }

  getoffer(productId: any) {
    this.productService.getoffer(productId).subscribe((res: any) => {
      this.offer = res;
    });
  }

  discountCalculation(item: any) {
    this.offerId = item.offerId;
    this.offerName = item.offerName;

    if (item.offerCategoryId?.isActive) {
      this.discount = item?.discount;
      const discountAmount = (this.sellingPrice * this.discount) / 100;
      this.finaldiscount = this.sellingPrice - discountAmount;
    }
  }

  removeOffer(name: string) {
    if (this.offerName === name) {
      this.offerName = '';
      this.finaldiscount = 0;
      this.offerId = null;
      this.discount = 0;
    }
  }

  reset() {
    this.offerName = '';
    this.offerId = '';
    this.discount = 0;
    this.finaldiscount = 0;
  }

  handleIsColorVariant(product: any): boolean {
    return !!product.colour;
  }

  buynow(productD: any, sellingPrice: number) {
    sessionStorage.setItem('product', JSON.stringify(productD));
    sessionStorage.setItem('size', JSON.stringify(this.selectedSize));
    sessionStorage.setItem('baseSizeMrpId', JSON.stringify(sellingPrice));

    this.requiredBaseSize = this.baseSizeMrp.filter(
      (item: { size: string }) => item.size === this.selectedSize
    );
    sessionStorage.setItem('reqBaseSize', JSON.stringify(this.requiredBaseSize));

    this.reset();
    this.router.navigate(['/pages/checkout']);
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


  // For better ngFor performance
  trackBySize(index: number, item: any): any {
    return item.baseSizeMrpId;
  }

  // For cleaner price access in template
  // get displayPrice(): number {
  //   return this.finaldiscount || this.sellingPrice || this.utilsService.data?.minmrp || 0;
  // }
}
