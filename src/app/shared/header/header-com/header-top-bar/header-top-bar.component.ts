import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/auth-service';

@Component({
  selector: 'app-header-top-bar',
  templateUrl: './header-top-bar.component.html',
  styleUrls: ['./header-top-bar.component.scss'],
})
export class HeaderTopBarComponent {
  public isActive: string = '';
  userId: any;
  useName: any;
  authentication: boolean = false; 

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    if (sessionStorage.getItem('currentUser') != "") {
      var currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      this.userId = currentUser && currentUser.id;
      this.useName = currentUser.firstName + ' ' + currentUser.lastName;
      // console.log("userId " + this.userId);
      if(this.userId == undefined){
        this.authentication = false;
      }else{
        this.authentication = true;
      } 
    }
   }
   

  handleActive = (type: string) => {
    if (type === this.isActive) {
      this.isActive = '';
    } else {
      this.isActive = type;
    }
  };

  removeUser() {
    window.sessionStorage.removeItem('currentUser');
    window.localStorage.clear();
     this.router.navigate(['/pages/login']);
     this.authenticationService.logout();
   }

redirecttoProfilePage(){
  if(this.userId == undefined){
    this.router.navigate(['/pages/login']);
  }else{
    this.router.navigate(['/pages/profile']);
  } 
}

redirecttoWishListPage(){
  if(this.userId == undefined){
    this.router.navigate(['/pages/login']);
  }else{
    this.router.navigate(['/shop/wishlist']);
  } 
}

redirecttologin(){
  if(this.userId == undefined){
    this.router.navigate(['/pages/login']);
  }else{
    this.router.navigate(['/cart']);
  } 
}

}
