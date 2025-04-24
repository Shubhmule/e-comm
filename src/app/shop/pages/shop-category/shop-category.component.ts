import { ActivatedRoute, Router } from '@angular/router';
import { ICategory } from '@/types/category-type';
import { Component, Input } from '@angular/core';
import category_data from '@/data/category-data';
import { ComponentService } from '@/shared/components/component.service';

@Component({
  selector: 'app-shop-category',
  templateUrl: './shop-category.component.html',
  styleUrls: ['./shop-category.component.scss'],
})
export class ShopCategoryComponent {
  categoryList:any[]=[]
  // public category_data: ICategory[] = category_data;
  //  @Input() categoryList!: any[];
  constructor(private router: Router,
    public componentService: ComponentService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.getAllCategoryCST()
  }
  handleCategory(parent: string) {
    // const category = parent.toLowerCase().split(' ').join('-');
    // this.router.navigate(['/shop'], {
    //   queryParams: { category: category },
    // });
  }

  getAllCategoryCST() {
    this.componentService.getCategoriesForCSTPanel().subscribe(res => {
      this.categoryList = res;
      
    })
  }

  redirectToProdCategory(productCategoryId:any){
    this.router.navigate(['/productByProductCategory'], {
        queryParams: { type: productCategoryId,},
        relativeTo: this.activatedRoute,
      });
  }
}
