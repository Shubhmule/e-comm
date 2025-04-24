import { Component } from '@angular/core';
import category_data from '@/data/category-data';

@Component({
  selector: 'app-fashion-brands',
  templateUrl: './fashion-brands.component.html',
  styleUrl: './fashion-brands.component.scss'
})
export class FashionBrandsComponent {
  public category_items = category_data.filter(
    (c) => c.productType === "electronics"
  );
}
