import { Router ,ActivatedRoute } from '@angular/router';
import { Component,Input,Renderer2  } from '@angular/core';
import category_data from '@/data/category-data';
import { ComponentService } from '@/shared/components/component.service';

@Component({
  selector: 'app-header-category',
  templateUrl: './header-category.component.html',
  styleUrls: ['./header-category.component.scss']
})
export class HeaderCategoryComponent {
  @Input() categoryList!: any[];

 public categoryItems = category_data.filter(c => c.productType === "electronics");
 public isActive:boolean = false;
//  categoryList:any[]=[]

 constructor(private router: Router, private renderer: Renderer2,public componentService:ComponentService,public activatedRoute:ActivatedRoute) {
  // this.getAllCategoryCST()
 }

public handleActive(): void {
  this.isActive = !this.isActive;
}

  public handleParentCategory(value: string): void {
    const newCategory = value.toLowerCase().replace("&", "").split(" ").join("-");
    this.router.navigate(['/shop'], { queryParams: { category: newCategory } });
  }

  public handleSubCategory(value: string): void {
    const newCategory = value.toLowerCase().replace("&", "").split(" ").join("-");
    this.router.navigate(['/shop'], { queryParams: { subcategory: newCategory } });
  }

  redirectToProdCategory(productCategoryId:any){
    this.router.navigate(['/productByProductCategory'], {
        queryParams: { type: productCategoryId,},
        relativeTo: this.activatedRoute,
      });
  }

  getAllCategoryCST() {
    this.componentService.getCategoriesForCSTPanel().subscribe(res => {
      this.categoryList = res;
      
    })
  }
}
