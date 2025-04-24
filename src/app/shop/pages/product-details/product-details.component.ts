import { Component, OnInit } from '@angular/core';
import { ProductService } from '@/shared/services/product.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit{
  public product:any= {};
  stockId!: string;
  type!:string;
  route: any;
  isLoading=true

  constructor(public productService: ProductService,private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.stockId = params['stockId'];
      this.type=params['type'];
    });
    this.productService.getProductDetails(this.stockId,this.type).subscribe((res: any) => {
      this.product = res[0];
      this.isLoading=false
      console.log(this.product,22);
    });
  }
  ngOnInit(): void {
    // this.stockId = this.route.snapshot.queryParamMap.get('id');
    // console.log("Stock id is "+this.stockId);
    
  }
}
