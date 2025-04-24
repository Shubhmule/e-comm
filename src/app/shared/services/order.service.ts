import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment/environment';






const userId = {
  currentUser: JSON.parse(sessionStorage['currentUser'] || '[]'),
};

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  public data=[
    {
    OrderId:1,
    ProductTitle:"abc",	
    Status:"pending"
  },
  {
    OrderId:2,
    ProductTitle:"xyz",	
    Status:"pending"
  },
]



  constructor( private http:HttpClient) {

    console.log("id----------------->",userId.currentUser)
   }

   private getHeaders() {
       return new HttpHeaders({
         Authorization: `Bearer ${userId.currentUser.accessToken}`,
         'Content-Type': 'application/json',
       });
     }

 
   

     public getorders(id:number) {
      return this.http.get<any[]>(`${environment.apiBase}/order/getallorders/${id}`, {
        headers: this.getHeaders(),
      });
    }


}
