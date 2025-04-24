import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { IBrand } from '@/types/brand-type';
import brands_data from '@/data/brand-data';
import { ProductService } from 'src/app/shared/services/product.service';
import { ComponentService } from '@/shared/components/component.service';

@Component({
  selector: 'app-brand-filter',
  templateUrl: './brand-filter.component.html',
  styleUrls: ['./brand-filter.component.scss'],
})
export class BrandFilterComponent {
  brandsData: any = [];
  showMore=true;
  // public brandsData: IBrand[] = brands_data;
   public imgsrc='https://globtechnoitsolution.com:8443/uploads/BRAND_149_dima-solomin-zHlG3mqavyE-unsplash.jpg'

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewScroller: ViewportScroller,
    public productService: ProductService,
    public componentService: ComponentService,
  ) {
    this.getPopularBrands();
  }

  handleBrandRoute(value: string) {
    const newBrand = value.toLowerCase().replace('&', '').split(' ').join('-');
    // Define the query parameters as an object
    const queryParams: Params = {
      brand: newBrand,
    };
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams, // Pass the queryParams object here
        queryParamsHandling: 'merge',
        skipLocationChange: false,
      })
      .finally(() => {
        this.viewScroller.setOffset([120, 120]);
        this.viewScroller.scrollToAnchor('products'); // Anchore Link
      });
  }

  // getAllCategoryCST() {
  //   this.componentService.getBrandsForCSTPanel().subscribe(res => {
  //     this.brandsData = res.slice(0,4);  
  //     this.showMore=true;
  //   })
  // }

  getPopularBrands() {
    this.componentService.getPopularBrands().subscribe(res => {
      this.brandsData = res.slice(0,4);  
      this.showMore=true;
    })
  }

  redirectToProdBrand(id:any,catid:any){
    this.router.navigate(['/productByProductBrand'], {
        queryParams: {type:catid,brand:id},
        relativeTo: this.route,
      });
  }

  getmore(){
    this.componentService.getBrandsForCSTPanel().subscribe(res => {
      this.brandsData = res;
      console.log(this.brandsData);
      this.showMore=false;
      
    })
  }

  getLess(){
    this.getPopularBrands();
  }
}
