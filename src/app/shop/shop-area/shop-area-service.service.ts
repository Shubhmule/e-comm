import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopAreaServiceService {

  constructor(private http:HttpClient) { 
  }

  getLatestProducts(){
      // return this.http.get(`${environment.apiBase}/stock/get-newest-product`);
      return this.http.get(`${environment.apiBase}/stock/products?newProducts=true&export=true`);
  }
  
  getshop(id: number,no: number = 0,minPrice:any,maxPrice:any){    
    return this.http.get(`${environment.apiBase}/stock/products?brandId=${id||0}&pageNo=${no}&minMrp=${minPrice}&maxMrp=${maxPrice}`);
}

}
