import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment/environment';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BaseProductService {

  constructor(public http:HttpClient) { }

  getBaseProductForCst(){
    // return this.http.get(`${environment.apiBase}/stock/base-product/cstpanel`);
    return this.http.get(`${environment.apiBase}/stock/products`);
  }

  getProductsByProductType(productType:any,brandid:any,pageNo:any,minPrice:any,maxPrice:any){
    // return this.http.get(`${environment.apiBase}/stock/base-product/byproduct-type/${productType}`);
    return this.http.get(`${environment.apiBase}/stock/products?productType=${productType}&brandId=${brandid||0}&limit=9&pageNo=${pageNo}&minMrp=${minPrice}&maxMrp=${maxPrice}`);
  }

  getProductsByCategory(categoryId :any){
    // return this.http.get(`${environment.apiBase}/stock/base-product/bycategory-id/${categoryId}`);
    return this.http.get(`${environment.apiBase}/stock/products?categoryId=`+categoryId);
  }

  getProductsByBrand(brandId :any,pageNo:any,minPrice:any,maxPrice:any){
    // return this.http.get(`${environment.apiBase}/stock/base-product/bybrand-id/${brandId}?pageNo=${pageNo||0}`);
    return this.http.get(`${environment.apiBase}/stock/products?brandId=${brandId}&pageNo=${pageNo||0}&minMrp=${minPrice}&maxMrp=${maxPrice}`);
  }
  // getProductsByBrand(brandId :any){
  //   return this.http.get(`${environment.apiBase}/stock/base-product/bybrand-id/${brandId}`);
  // }

  getProductByFilters(params = {}): Observable<any> {
    // return this.http.get<any>(`${environment.apiBase}/stock/get_base_products_by_pagination`,{ params });
    return this.http.get(`${environment.apiBase}/stock/products`,{params});
  }
}
