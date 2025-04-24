import { ProductService } from '@/shared/services/product.service';
import { IProduct } from '@/types/product-type';
import { Component } from '@angular/core';

@Component({
  selector: 'app-electronic-sm-products',
  templateUrl: './electronic-sm-products.component.html',
  styleUrls: ['./electronic-sm-products.component.scss']
})
export class ElectronicSmProductsComponent {
  // electronic prd
  public electronic_prd:IProduct[] = [];

  // discount_products
  public discount_products:IProduct[] = [];
  // featured_products
  public featured_products:IProduct[] = [];
  // featured_products
  public selling_products:IProduct[] = [];

    constructor(public productService: ProductService) {
      this.productService.products.subscribe((products) => {
        const electronic_products = products.filter((p) => p.productType === 'electronics')
        this.electronic_prd = electronic_products;
        this.discount_products = electronic_products.filter((p) => p.discount > 0).slice(0, 3);
        this.featured_products = electronic_products.filter((p) => p.featured).slice(0, 3);
        this.selling_products = electronic_products.slice().sort((a, b) => b.sellCount - a.sellCount).slice(0, 3);
      });
    }
}
