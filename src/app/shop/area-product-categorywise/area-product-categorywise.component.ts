import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from 'src/app/shared/services/product.service';
import { IProduct } from '@/types/product-type';
import { BaseProductService } from '../product/electronics/base-product.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-area-product-categorywise',
  templateUrl: './area-product-categorywise.component.html',
  styleUrl: './area-product-categorywise.component.scss'
})
export class AreaProductCategorywiseComponent {
@Input() listStyle: boolean = false;
  @Input() full_width: boolean = false;
  @Input() shop_1600: boolean = false;
  @Input() shop_right_side: boolean = false;
  @Input() shop_no_side: boolean = false;
   isLoading=true
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
  public pageNo: number = 1;
  public pageSize: number = 9;
  public paginate: any = {}; // Pagination use only
  public sortBy: string = 'asc'; // Sorting Order
  public mobileSidebar: boolean = false;
  categoryID :any;
  searchControl = new FormControl('');
  
  activeTab: string = this.listStyle ? 'list' : 'grid';
  productsList: any;
  lenthofProductList: any;
  totalData: any;
  subscription: any;
  brandId: any =0;
  productType: any = '';
  handleActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // shop changeFilterSelect
  changeFilterSelect(selectedOption: { value: string, text: string }) {
    this.sortByFilter(selectedOption.value)
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    private viewScroller: ViewportScroller,
    public baseProductSer:BaseProductService,
    private activatedRoute: ActivatedRoute,
  ) {

     this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params && params.type) {
        this.categoryID = params.type;
        this.brandId=params.brand||0;
      }
      this.getProductsByCategory();
    });

    
    // Get Query params..
    this.route.queryParams.subscribe((params) => {
      this.minPrice = params['minPrice'] ? params['minPrice'] : this.minPrice;
      this.maxPrice = params['maxPrice'] ? params['maxPrice'] : this.maxPrice;
      this.brand = params['brand']
        ? params['brand'].toLowerCase().split(' ').join('-') : null;

      this.category = params['category']
        ? params['category'].toLowerCase().split(' ').join('-') : null;
      this.subcategory = params['subcategory']
        ? params['subcategory'].toLowerCase().split(' ').join('-') : null;
      this.status = params['status']
        ? params['status'].toLowerCase().split(' ').join('-') : null;
      this.pageNo = params['page'] ? params['page'] : this.pageNo;
      this.sortBy = params['sortBy'] ? params['sortBy'] : 'asc';

      // Get Filtered Products..
      this.productService.filterProducts().subscribe((response) => {
        // Sorting Filter
        this.products = this.productService.sortProducts(response, this.sortBy);
        // Category Filter
        if (this.category){
          this.products = this.products.filter(
            (p) => p.parent.toLowerCase().split(' ').join('-') === this.category
          );
        }
        if (this.subcategory){
          this.products = this.products.filter(
            (p) => p.children.toLowerCase().replace("&", "").split(" ").join("-") ===
              this.subcategory
          );
        }
        // status Filter
        if (this.status) {
          if (this.status === 'on-sale') {
            this.products = this.products.filter((p) => p.discount > 0);
          } else if (this.status === 'in-stock') {
            this.products = this.products.filter((p) => p.status === 'in-stock');
          }
          else if (this.status === 'out-of-stock') {
            this.products = this.products.filter((p) => p.status === 'out-of-stock' || p.quantity === 0);
          }
        }
        // brand filtering
        if (this.brand) {
          this.products = this.products.filter((p) => p.brand.name.toLowerCase() === this.brand);
        }

        // Price Filter
        this.products = this.products.filter(
          (p) => p.price >= Number(this.minPrice) && p.price <= Number(this.maxPrice)
        );
        // Paginate Products
        // this.products = this.products.slice(this.paginate.startIndex,this.paginate.endIndex + 1);
      });
    });
  }
  ngOnInit() {
    this.activeTab = this.listStyle ? 'list' : 'grid';
  }

  // Append filter value to Url
  updateFilter(tags: any) {
    // tags.page = null; // Reset Pagination
  }

  // SortBy Filter
  sortByFilter(value:string) {
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
    this.getProductsByCategory()
    }
    else if(value=="low"){
      this.productsList.sort((a:any,b:any)=>a.minmrp-b.minmrp)
     }else if (value=="high"){
      this.productsList.sort((a:any,b:any)=>b.minmrp-a.minmrp)
     }
  }

  // product Pagination
  setPage(page: number) {
      this.baseProductSer.getProductByFilters({ brandId:this.brandId, categoryId:this.categoryID,limit:9,
      pageNo: page-1,productType:this.productType,searchText: this.searchControl.value}).subscribe(res => {
      this.productsList = res;
      this.lenthofProductList = this.productsList.length;
    })


    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: { page: page },
    //   queryParamsHandling: 'merge', // preserve the existing query params in the route
    //   skipLocationChange: false  // do trigger navigation
    // }).finally(() => {
    //   this.viewScroller.setOffset([120, 120]);
    //   this.viewScroller.scrollToAnchor('products'); // Anchore Link
    // });

  }

  handleResetFilter () {
    // this.minPrice = 0;
    // this.maxPrice = this.productService.maxPrice;
    // this.pageNo = 1;
    // this.router.navigate(['/productByProductCategory'], {
    //   queryParams: { type: this.categoryID},
    //   relativeTo: this.activatedRoute,
    // });

    this.router.navigate(['/shop'])

  }

  // getProductsByCategory(){
  //   this.baseProductSer.getProductsByCategory(this.categoryID).subscribe(res => {
  //     this.productsList = res;
  //     this.lenthofProductList = this.productsList.length;
  //   })
  // }

  getProductsByCategory(){
    if(this.minPrice || this.maxPrice){
      this.baseProductSer.getProductByFilters({ brandId:this.brandId, categoryId:this.categoryID,limit:9,
        pageNo: 0,productType:this.productType,searchText: this.searchControl.value,minMrp:this.minPrice,maxMrp:this.maxPrice}).subscribe(res => {
        this.productsList = res;
        this.paginate = this.productService.getPager(this.productsList[0]?.totalCount,Number(+this.pageNo),this.pageSize);

        this.isLoading=false
      // if (this.minPrice || this.maxPrice) {
      //   this.productsList = this.productsList.filter((product:any) => {
      //     const price = product.minmrp; 
      //     return (!this.minPrice || price >= this.minPrice) &&
      //            (!this.maxPrice || price <= this.maxPrice);
      //   });
      // }
        this.lenthofProductList = this.productsList.totalCount;
      })
    }


    
    }

   


    // getProductsByCategory(){
    //   this.baseProductSer.getProductByFilters().subscribe(res => {
    //     this.productsList = res;
    //     // console.log();
        
    //      this.paginate = this.productService.getPager(this.productsList[0]?.totalCount,Number(+this.pageNo),this.pageSize);

    //     this.isLoading=false
    //   if (this.minPrice || this.maxPrice) {
    //     this.productsList = this.productsList.filter((product:any) => {
    //       const price = product.minmrp; 
    //       return (!this.minPrice || price >= this.minPrice) &&
    //              (!this.maxPrice || price <= this.maxPrice);
    //     });
    //   }
    //     this.lenthofProductList = this.productsList.totalCount;
    //   })
    // }

  /*ngAfterViewInit() {
    
    // this.dataSource.paginator = this.paginator;

    this.paginate.page
      .pipe(
        startWith({}),
        switchMap(() => {
          if(this.searchControl.value !== ''){ 
            return this.baseProductSer.getProductByFilters({ brandId:this.brandId, categoryId:this.categoryID,limit:9,
              pageNo: 0,productType:this.productType,searchText: this.searchControl.value});  
          }
          return this.baseProductSer.getProductByFilters({ page: this.paginate.pageIndex });
        }),
        map((res:any) => {
          this.totalData = res.totalData;
          return res.data;
        })
      )
      .subscribe((data:any) => {
        // this.dataSource = new MatTableDataSource(data);
      });

      this.subscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(1000), // Waiting for 1 sec while you are typing
        distinctUntilChanged() // Prevents the emitting if the 'start' value and the 'end' value are the same
      )
      .subscribe((value :any) => {
        console.log(value);
        // TODO: call BE here with this.httpClient...
        this.searchUser(0, value);
      });
  }

  searchUser(pageNumber: Number, search: string) {
    this.baseProductSer.getProductByFilters({ page: pageNumber, searchText: search }).subscribe({
      next: (res) => {
        // this.dataSource.data = res?.data;
        this.totalData = res?.totalData;
      },
      error: (error) => { }
    });
  } */
  
}
