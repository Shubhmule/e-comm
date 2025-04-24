import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from 'src/app/shared/services/product.service';
import { IProduct } from '@/types/product-type';
import { BaseProductService } from '../product/electronics/base-product.service';

@Component({
  selector: 'app-area-product-type',
  templateUrl: './area-product-type.component.html',
  styleUrl: './area-product-type.component.scss',
})
export class AreaProductTypeComponent {
  @Input() listStyle: boolean = false;
  @Input() full_width: boolean = false;
  @Input() shop_1600: boolean = false;
  @Input() shop_right_side: boolean = false;
  @Input() shop_no_side: boolean = false;
  isLoading = true;

  public products: IProduct[] = [];
  public minPrice: number = 1;
  public maxPrice: number = this.productService.maxPrice;
  public niceSelectOptions = this.productService.filterSelect;
  public brands: string[] = [];
  public tags: string[] = [];
  public category: string | null = null;
  public subcategory: string | null = null;
  public status: string | null = null;
  public brand: string | null = null;
  public brandId: number|null = null;
  public pageNo: number = 1;
  public pageSize: number = 9;
  public paginate: any = {}; // Pagination use only
  public sortBy: string = 'asc'; // Sorting Order
  public mobileSidebar: boolean = false;
  productType: any;
  public brnadid:any;

  activeTab: string = this.listStyle ? 'list' : 'grid';
  productsList: any;
  lenthofProductList: any;
  handleActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // shop changeFilterSelect
  changeFilterSelect(selectedOption: { value: string; text: string }) {
    this.sortByFilter(selectedOption.value);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    private viewScroller: ViewportScroller,
    public baseProductSer: BaseProductService,
    private activatedRoute: ActivatedRoute
  ) {
    //  this.activatedRoute.queryParams.subscribe((params: any) => {
    //   if (params && params.type) {
    //     this.productType = params.type;
    //   }
    //   this.getProductsByProductType();
    // });

    // Get Query params..
    this.route.queryParams.subscribe((params) => {
      // console.log('params', params);
      this.minPrice = params['minPrice'] ? params['minPrice'] : this.minPrice;
      this.maxPrice = params['maxPrice'] ? params['maxPrice'] : this.maxPrice;
      this.brandId = params['brand'] ? params['brand'] : this.brandId;
      this.brand = params['brand']
        ? params['brand'].toLowerCase().split(' ').join('-')
        : null;

      this.category = params['category']
        ? params['category'].toLowerCase().split(' ').join('-')
        : null;
      this.subcategory = params['subcategory']
        ? params['subcategory'].toLowerCase().split(' ').join('-')
        : null;
      this.status = params['status']
        ? params['status'].toLowerCase().split(' ').join('-')
        : null;
      this.pageNo = params['page'] ? params['page'] : this.pageNo;
      this.sortBy = params['sortBy'] ? params['sortBy'] : 'asc';

      // Get Filtered Products..
      this.productService.filterProducts().subscribe((response) => {
        // Sorting Filter
        this.products = this.productService.sortProducts(response, this.sortBy);
        // Category Filter
        if (this.category) {
          this.products = this.products.filter(
            (p: any) =>
              p.parent.toLowerCase().split(' ').join('-') === this.category
          );
        }
        if (this.subcategory) {
          this.products = this.products.filter(
            (p: any) =>
              p.children.toLowerCase().replace('&', '').split(' ').join('-') ===
              this.subcategory
          );
        }
        // status Filter
        if (this.status) {
          if (this.status === 'on-sale') {
            this.products = this.products.filter((p: any) => p.discount > 0);
          } else if (this.status === 'in-stock') {
            this.products = this.products.filter(
              (p: any) => p.status === 'in-stock'
            );
          } else if (this.status === 'out-of-stock') {
            this.products = this.products.filter(
              (p: any) => p.status === 'out-of-stock' || p.quantity === 0
            );
          }
        }
        // brand filtering
        if (this.brand) {
          this.products = this.products.filter(
            (p: any) => p.brand.name.toLowerCase() === this.brand
          );
        }

        // Price Filter
        this.products = this.products.filter(
          (p: any) =>
            p.price >= Number(this.minPrice) && p.price <= Number(this.maxPrice)
        );
        // Paginate Products

        this.paginate = this.productService.getPager(
          this.products.length,
          Number(+this.pageNo),
          this.pageSize
        );
        this.products = this.products.slice(
          this.paginate.startIndex,
          this.paginate.endIndex + 1
        );
      });
    });
  }
  ngOnInit() {
    this.activeTab = this.listStyle ? 'list' : 'grid';
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params?.['type']) {
        this.productType = params?.['type'];
        this.brandId= Number(params['brand'])
        
        // Should log correct value now
        this.getProductsByProductType();
      } else {
        console.warn('Product Type is missing from query params');
      }
    });
  }

  // Append filter value to Url
  updateFilter(tags: any) {
    tags.page = null; // Reset Pagination
  }

  // SortBy Filter
  sortByFilter(value: string) {
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: { sortBy: value ? value : null},
    //   queryParamsHandling: 'merge', // preserve the existing query params in the route
    //   skipLocationChange: false  // do trigger navigation
    // }).finally(() => {
    //   this.viewScroller.setOffset([120, 120]);
    //   this.viewScroller.scrollToAnchor('products'); // Anchore Link
    // });
    if (value === 'asc') {
      this.getProductsByProductType();
    } else if (value == 'low') {
      this.productsList.sort((a: any, b: any) => a.minmrp - b.minmrp);
    } else if (value == 'high') {
      this.productsList.sort((a: any, b: any) => b.minmrp - a.minmrp);
    } else {
    }
  }

  // product Pagination
  setPage(page: number) {
    this.pageNo = page;
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: { page: page },
    //   queryParamsHandling: 'merge', // preserve the existing query params in the route
    //   skipLocationChange: false  // do trigger navigation
    // }).finally(() => {
    //   this.viewScroller.setOffset([120, 120]);
    //   this.viewScroller.scrollToAnchor('products'); // Anchore Link
    // });

    this.baseProductSer
      .getProductsByProductType(this.productType,this.brand, this.pageNo - 1,this.minPrice,this.maxPrice)
      .subscribe((res) => {
        this.productsList = res;
        this.isLoading = false;
        this.lenthofProductList = this.productsList.length;
      });
  }

  handleResetFilter() {
    // this.minPrice = 0;
    // this.maxPrice = this.productService.maxPrice;
    // this.pageNo = 1;
    // this.router.navigate(['/productByProductType'], {
    //   queryParams: { type: this.productType },
    //   relativeTo: this.activatedRoute,
    // });

    this.router.navigate(['/shop'])

  }

  getProductsByProductType() {
    if (this.minPrice || this.maxPrice) {
    this.baseProductSer
      .getProductsByProductType(this.productType,this.brand, this.pageNo - 1,this.minPrice,this.maxPrice)
      .subscribe((res) => {
        this.productsList = res;
        this.isLoading = false;

        this.paginate = this.productService.getPager(
          this.productsList[0].totalCount,
          Number(+this.pageNo),
          this.pageSize
        );

        // if (this.minPrice || this.maxPrice) {
        //   this.productsList = this.productsList.filter((product: any) => {
        //     const price = product.minmrp;
        //     return (
        //       (!this.minPrice || price >= this.minPrice) &&
        //       (!this.maxPrice || price <= this.maxPrice)
        //     );
        //   });
        // }
        this.lenthofProductList = this.productsList.length;
      });
  }
  }
}
