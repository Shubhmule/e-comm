import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environment/environment';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser') || '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser') || '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
        return this.currentUserSubject.value;
    }

    login(username: any, otp: any) {
        return this.http.post<any>(environment.apiBase + `/api/auth/signin`, { username, otp })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                return user;
            }));
    }

    sentOtp(mobNo:any): Observable<any> {
        return this.http.post<any>(environment.apiBase + '/api/auth/customer/send-otp/'+mobNo, "")
      }

    createUser(payload:any): Observable<any> {
        return this.http.post<any>(environment.apiBase + '/api/auth/customer/signup', payload)
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('sellingPrice');
        sessionStorage.removeItem('product');
        this.currentUserSubject.next(null);
        // localStorage.clear();
        sessionStorage.clear();
        
    }
}