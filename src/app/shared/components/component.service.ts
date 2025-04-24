import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private http: HttpClient) { }

  getBrandsForCSTPanel() {
    return this.http.get<any[]>(`${environment.apiBase}/brand/customerpanel`);
  }

  getPopularBrands() {
    return this.http.get<any[]>(`${environment.apiBase}/brand/popular`);
  }

  getCategoriesForCSTPanel() {
    return this.http.get<any[]>(`${environment.apiBase}/category/get/subcategory/for/cstpanel`);
  }
}
