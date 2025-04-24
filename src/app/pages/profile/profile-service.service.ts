import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {
  

  constructor(private http:HttpClient) { }

  getorderDetails(orderId:any)
  {
    return this.http.get(`${environment.apiBase}/order/get/order/`+orderId);
  }

  getUserDetails(id:number)
  {
    return this.http.get(`${environment.apiBase}/api/user/getById/`+id);
  }

      updateUser(payload:any): Observable<any> {
          return this.http.put<any>(environment.apiBase + '/api/user/edituser', payload)
  }


  getUserDetailsForCoupon(){
    return this.http.get(`${environment.apiBase}/api/user/getuserinfo`);
  }


      getaddress(userId: any) {
        return this.http.get(`${environment.apiBase}/address/type/`+userId);
      }
      updateBillingAddress(payload:any,userId: any):Observable<any>{
        return this.http.put(`${environment.apiBase}/address/`+userId,payload);
      }
      getDistrict(){
        return this.http.get(`${environment.apiBase}/signup/district/all`);
      }
      getTaluka(district:any){
        return this.http.get(`${environment.apiBase}/signup/taluka/all?district=`+district);
      }
      addBillingAddress(payload:any):Observable<any>{
        return this.http.post(`${environment.apiBase}/address`,payload);
      }
      
}
