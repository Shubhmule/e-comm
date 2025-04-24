import { Component, HostListener } from '@angular/core';
import { CartService } from '@/shared/services/cart.service';
import { WishlistService } from '@/shared/services/wishlist.service';
import { UtilsService } from '@/shared/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-four',
  templateUrl: './header-four.component.html',
  styleUrls: ['./header-four.component.scss']
})
export class HeaderFourComponent {
  userId: any;
  useName: any;
  authentication: boolean = false; 

  constructor(
    private router: Router,
    public cartService: CartService,
    public wishlistService: WishlistService,
    public utilsService: UtilsService

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

  sticky : boolean = false;
  @HostListener('window:scroll',['$event']) onscroll () {
    if(window.scrollY > 80){
      this.sticky = true
    }
    else{
      this.sticky = false
    }
  }

  redirecttoWishlistPage(){
    if(this.userId == undefined){
      this.router.navigate(['/pages/login']);
    }else{
      this.router.navigate(['/shop/wishlist']);
    } 
  }
}
