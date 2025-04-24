import { UtilsService } from '@/shared/services/utils.service';
import { Component, Input } from '@angular/core';
import { IProduct } from '@/types/product-type';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details-thumb',
  templateUrl: './product-details-thumb.component.html',
  styleUrls: ['./product-details-thumb.component.scss'],
})
export class ProductDetailsThumbComponent {
  @Input() product!: any;
  @Input() productD:any={}
  StockID: any;
  productImages:any = [];

  constructor(
    public productService: ProductService,
    public utilsService: UtilsService,
    public activatedRoute : ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.StockID = params['stockId'];
      // alert(this.StockID)
    });
  }

  ngOnInit() {
    if (this.productD) {
      this.productService.activeImg = this.productD.immage_url;
    }
      // this.productService.activeImg = this.product.stockImage;
      // this.productImages.push(this.product.stockImage)
      
  }
  
}
