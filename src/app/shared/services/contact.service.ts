import { IContact } from '@/types/product-type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';

const token = {
  accessToken: JSON.parse(sessionStorage['accessToken'] || '[]'),
};

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${token.accessToken}`,
      'Content-Type': 'application/json',
    });
  }

  addContactMessage(contact: IContact): Observable<any> {
    return this.http.post<any>(`${environment.apiBase}/contact-us`, contact);
  }

}
