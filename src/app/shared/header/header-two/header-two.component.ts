import { ActivatedRoute, Router } from '@angular/router';
import { Component, HostListener,Input } from '@angular/core';
import { CartService } from '@/shared/services/cart.service';
import { WishlistService } from '@/shared/services/wishlist.service';
import { UtilsService } from '@/shared/services/utils.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header-two',
  templateUrl: './header-two.component.html',
  styleUrls: ['./header-two.component.scss'],
})
export class HeaderTwoComponent {
  @Input () style_2 : boolean = false;

  public searchText: string = '';
  userId: any;
  useName: any;
  authentication: boolean = false;
  data:any[]=[]
  cart:any=[]


 

  constructor(
    public cartService: CartService,
    public wishlistService: WishlistService,
    public utilsService: UtilsService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
   // this.getWishlistProducts2()
    // this.getCartProductstwo()
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

  ngOnInit() {
    // Retrieve searchText from query params when component initializes
    this.route.queryParams.subscribe(params => {
      if (params['searchText']) {
        this.searchText = params['searchText'];
      }
    });
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

  handleSearchSubmit() {
    const queryParams: { [key: string]: string | null } = {};
    if(!this.searchText){
      return
    }
    else {
      if (this.searchText) {
        
        queryParams['searchText'] = this.searchText;
      }
      this.router.navigate(['/pages/search'], { queryParams });
    }
  }

  redirecttoWishlistPage(){
    if(this.userId == undefined){
      this.router.navigate(['/pages/login']);
    }else{
      this.router.navigate(['/shop/wishlist']);
    } 
  }
  getCartProductstwo(): void {
    this.cartService.getCartProductstwo().subscribe((res) => {
      this.cart = res;
    });
  }
  
  getWishlistProducts2() {
    this.wishlistService.getWishlistProducts2().subscribe((res) => {
      this.data = res;
    })
  }

  redirecttologin(){
    if(this.userId == undefined){
      this.router.navigate(['/pages/login']);
    }else{
      this.router.navigate(['/cart']);
    } 
  }

  goBack(): void {
    this.location.back();
  }
}
