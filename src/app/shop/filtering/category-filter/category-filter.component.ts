import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import category_data from '@/data/category-data';
import { ICategory } from '@/types/category-type';
import { ProductService } from 'src/app/shared/services/product.service';
import { ComponentService } from '@/shared/components/component.service';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
})
export class CategoryFilterComponent {
  // public categoryData: ICategory[] = category_data;
   @Input() categoryID!: any;
  activeQuery: string = '';
  categoryData: any = [];
  selectedCategoryId :any;
  //  categoryId:any;
  categoryName: string | null|undefined='';
  type:any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewScroller: ViewportScroller,
    public productService: ProductService,
    public componentService: ComponentService,
  ) {
    this.getAllCategoryCST()
    
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.activeQuery = queryParams['category'];
       this.type = Number(queryParams['type'])
      
     
      
    });
    
  }

  handleCategoryRoute(value: string): void {
    const newCategory = value.toLowerCase().replace('&', '').split(' ').join('-');

    // Define the query parameters as an object
    const queryParams: Params = {
      category: newCategory,
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

  getAllCategoryCST() {
    this.componentService.getCategoriesForCSTPanel().subscribe(res => {
      this.categoryData = res;
      
    })
  }

  redirectToProdCategory(productCategoryId:any){
    this.selectedCategoryId = productCategoryId;
    this.router.navigate(['/productByProductCategory'], {
        queryParams: { type: productCategoryId,},
        relativeTo: this.route,
      });
  }
}
