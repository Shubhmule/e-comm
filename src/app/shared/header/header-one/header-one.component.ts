import { Component, HostListener, Input } from '@angular/core';
import { CartService } from '@/shared/services/cart.service';
import { IProduct } from '@/types/product-type';
import { WishlistService } from '@/shared/services/wishlist.service';
import { Router } from '@angular/router';
import { UtilsService } from '@/shared/services/utils.service';
import { AuthenticationService } from 'src/app/auth/auth-service';

@Component({
  selector: 'app-header-one',
  templateUrl:'./header-one.component.html',
  styleUrls: ['./header-one.component.scss'],
})
export class HeaderOneComponent {
   @Input() categoryList!: any[];

  public products: IProduct[] = [];
  public searchText: string = '';
  public productType: string = '';
  showlogin : boolean = false;
  notLogin : boolean = true
  userId: any;
  useName: any;
  authentication: boolean = false; 
  data:any[]=[]
  cart:any=[]

  constructor(
    public cartService: CartService,
    public wishlistService: WishlistService,
    public utilsService: UtilsService,
    private router: Router
  ) { 
  //  this.getWishlistProducts2()
  //  this.getCartProductstwo()
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
    if(this.userId){
      this.showlogin = true;
      this.notLogin = false;
    }else{
      this.showlogin = false;
      this.notLogin = true;
    }  
  }

  // select options for header category
  public niceSelectOptions = [
    { value: 'select-category', text: 'Select Category' },
    { value: 'electronics', text: 'Electronics' },
    { value: 'fashion', text: 'Fashion' },
    { value: 'beauty', text: 'Beauty' },
    { value: 'jewelry', text: 'Jewelry' },
  ];

  changeHandler(selectedOption: { value: string; text: string }) {
    console.log('Selected option:', selectedOption);
    this.productType = selectedOption.value;
  }

  headerSticky: boolean = false;

  // sticky nav
  @HostListener('window:scroll', ['$event']) onscroll() {
    if (window.scrollY > 80) {
      this.headerSticky = true;
    } else {
      this.headerSticky = false;
    }
  }

  handleSearchSubmit() {
    const queryParams: { [key: string]: string | null } = {};
    if(!this.searchText && !this.productType){
      return
    }
    else {
      if (this.searchText) {
        queryParams['searchText'] = this.searchText;
      }
      if (this.productType) {
        queryParams['productType'] = this.productType;
      }
      this.router.navigate(['/pages/search'], { queryParams });
    }
  }

  redirecttoLoginPage(){
      this.router.navigate(['/pages/login']);
  }

  redirecttoProfilePage(){
    this.router.navigate(['/pages/profile']);
  }

  getWishlistProducts2() {
    this.wishlistService.getWishlistProducts2().subscribe((res) => {
      this.data = res;
    })
  }
   
   
  // getCartProductstwo(): void {
  //   this.cartService.getCartProductstwo().subscribe((res) => {
  //     this.cart = res;
  //   });
  // }
  


  redirecttoWishlistPage(){
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
