import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  constructor(private http: HttpClient) { }

  getAllAdvertisement() {
    return this.http.get<any[]>(`${environment.apiBase}/advertise/active`);
}


}
