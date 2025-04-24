import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '@/shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { OrderRequest } from './checkout.interface';
import { ProfileServiceService } from '../profile/profile-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],

})
export class CheckoutComponent {
  isLoading=true;
  isOpenLogin = false;
  isOpenCoupon = false;
  shipCost: number = 0;
  couponCode: string = '';
  payment_name: string = '';
  billingaddress: any = {};
  userId!:number;
  authentication : boolean = false;
  addresses: any = [];
  userDetails: any = {};
  products:any=[];
  subTotal:number=0;
  gstAmount: number = 0;
  Total:number=0;
  billAddress=false;
  buynow:boolean=false;
  ProPrice:any;
  price:any;
  ProductName:any;
  Quantity:any;
  mrp:number=0;
  stockId:any;
  productId:any;
  Editable:boolean=true
  gstamount: any;
  qty: any;
  sales_gst: any;
  grossAmount: any;
  baseSizeMrpId: any | null;
  SubTotal:number = 0.00;
  totalGST:number=0.00;
  reqBaseSize:any;


  constructor(public cartService: CartService,private toastrService: ToastrService,public router: Router,private user:ProfileServiceService) { 
    if (sessionStorage.getItem('currentUser') != ""){
      var currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      this.userId = currentUser.id;
      if(this.userId == undefined){
        this.authentication = false;
      }else{
        this.authentication = false;
      }      
    }
    this.isBilling();
    this.getuserDetails();
    const productData=sessionStorage.getItem('product');
    if(productData)
    {
      this.buynow=true;
      const productInfo=JSON.parse(productData);
      this.baseSizeMrpId = sessionStorage.getItem("baseSizeMrpId");
      this.reqBaseSize=JSON.parse(sessionStorage.getItem('reqBaseSize')||'null')
      this.ProductName= productInfo.product_name||productInfo.productName;
      this.Quantity=1;
      // this.mrp = this.reqBaseSize[0]?.sellingPrice > 0 ? this.reqBaseSize[0]?.sellingPrice : this.reqBaseSize[0]?.mrp;
      this.mrp =  Number(this.baseSizeMrpId)  
      this.sales_gst = productInfo.sales_gst||productInfo.salesGst;
      this.gstAmount = ((this.mrp)*((this.sales_gst)/100));
      this.Total = this.mrp + this.gstAmount-(this.mrp*(this.reqBaseSize[0].discount)/100); 
      this.subTotal=this.Total;
      this.stockId=productInfo.stock_id;
      this.productId=productInfo.product_id;
    }
    else{
      this.getProducts();
    }
 


  }

  isBilling() {
    this.cartService.isBilling(this.userId).subscribe({
      next: (res: any) => {
        this.billAddress = res;
      },
      error: (err) => {
        if (err.status === 401) {
          // Navigate to another page, e.g., login or unauthorized
          this.router.navigate(['/pages/login']); // adjust route as needed
        } else {
          console.error('An error occurred:', err);
        }
      }
    });
  }
  getProducts()
  {
    this.cartService.getCartProducts().subscribe((res:any[]) => {
      this.products = res;
      this.calculateOffer();
    });
  }

  calculateOffer() {
   this.products.map((item: { sellingPrice: number; offerDiscount: number; mrp:number;discount:number}) => {
    if(+item.mrp>0)
    {
      if(+item.sellingPrice>0)
      {
        if(+item.discount>0)
          {
            item.sellingPrice = item.sellingPrice -(+item.sellingPrice * item.discount) / 100;
          }
          if(+item.offerDiscount>0)
          {
            item.sellingPrice =item.sellingPrice - (+item.sellingPrice * item.offerDiscount) / 100;
          }
      }
      else{
        item.sellingPrice=item.mrp;
        if(+item.discount>0)
          {
            item.sellingPrice = item.sellingPrice -(+item.sellingPrice * item.discount) / 100;
          }
          if(+item.offerDiscount>0)
          {
            item.sellingPrice = item.sellingPrice -(+item.sellingPrice * item.offerDiscount) / 100;
          }
      }
    }
  });
  this.getSubTotal();
  }

  getSubTotal()
  {
    
    this.SubTotal=0;
    this.products.map((item: { sellingPrice: number; mrp:number;offerPrice:number;quantityInKit:number;salesGst:number}) => {
      
      this.SubTotal+=(item.sellingPrice*item.quantityInKit)+(item.sellingPrice*item.quantityInKit)*(item.salesGst/100)
    })
    this.SubTotal = parseFloat(this.SubTotal.toFixed(2));
  }

  calculateGST(sellingPrice:number,quantityInKit:number,salesGst:number)
  {
    return  parseFloat(((sellingPrice * quantityInKit) + ((sellingPrice * quantityInKit) * (salesGst / 100))).toFixed(2))
  }
  calculateTotalGst():number{
    this.totalGST=0;
    this.products.map((item: { sellingPrice: number;quantityInKit:number;salesGst:number}) => {
      this.totalGST+=((item.sellingPrice * item.quantityInKit) * (item.salesGst / 100));
    })
    return parseFloat(this.totalGST.toFixed(2));
  }


  getonepriceofthree(item:any)
  {
     if(+item.sellingPrice != 0)
    {
       return +item.sellingPrice ;
    }
    else if(+item.mrp != 0)
    {
         item.sellingPrice=item.mrp;
         return +item.mrp ;
    }
    return 0;
  }





  getuserDetails() {
    this.cartService.getUserDetails(this.userId).subscribe(res => {
      this.userDetails = res;
      this.isLoading=false
      this.getaddress();
    });
  }

  getaddress() {
    this.cartService.getaddress(this.userId).subscribe(res => {
      this.billingaddress = res;
      this.setbillingaddress();
    });
  }
  setbillingaddress(){
    if(this.billingaddress[0]!= null){
      if(this.billingaddress[0].billing){
        this.checkoutForm.controls["lastName"].setValue(this.userDetails.lastName);
        this.checkoutForm.controls["designation"].setValue(this.userDetails.designation);
        this.checkoutForm.controls["email"].setValue(this.userDetails.email);
        this.checkoutForm.controls["mobNo"].setValue(this.userDetails.mobNo);
        this.checkoutForm.controls["pinCode"].setValue(this.userDetails.pinCode);
        this.checkoutForm.controls["firstName"].setValue(this.userDetails.firstName);
        this.checkoutForm.controls["middleName"].setValue(this.userDetails.middleName);

        this.checkoutForm.controls["address"].setValue(this.billingaddress[0].address);
        this.checkoutForm.controls["districtKey"].setValue(this.billingaddress[0].districtKey);
        this.checkoutForm.controls["talukaKey"].setValue(this.billingaddress[0].talukaKey);
        this.checkoutForm.controls["postalCode"].setValue(this.billingaddress[0].postalCode);
        this.checkoutForm.controls["state"].setValue(this.billingaddress[0].state);
        this.checkoutForm.controls["country"].setValue(this.billingaddress[0].country);
        this.checkoutForm.controls["mobileNo"].setValue(this.billingaddress[0].mobileNo);
        this.checkoutForm.controls["districtName"].setValue(this.billingaddress[0].districtName);
        this.checkoutForm.controls["talukaName"].setValue(this.billingaddress[0].talukaName);
        this.checkoutForm.controls["addressKey"].setValue(this.billingaddress[0].addressKey);   
        
        
      }
    }
    if(this.billingaddress[1]!= null){
      if(this.billingaddress[1].billing){
        this.checkoutForm.controls["lastName"].setValue(this.userDetails.lastName);
        this.checkoutForm.controls["designation"].setValue(this.userDetails.designation);
        this.checkoutForm.controls["email"].setValue(this.userDetails.email);
        this.checkoutForm.controls["mobNo"].setValue(this.userDetails.mobNo);
        this.checkoutForm.controls["pinCode"].setValue(this.userDetails.pinCode);
        this.checkoutForm.controls["firstName"].setValue(this.userDetails.firstName);
        this.checkoutForm.controls["middleName"].setValue(this.userDetails.middleName);

      this.checkoutForm.controls["address"].setValue(this.billingaddress[1].address);
      this.checkoutForm.controls["districtKey"].setValue(this.billingaddress[1].districtKey);
      this.checkoutForm.controls["talukaKey"].setValue(this.billingaddress[1].talukaKey);
      this.checkoutForm.controls["postalCode"].setValue(this.billingaddress[1].postalCode);
      this.checkoutForm.controls["state"].setValue(this.billingaddress[1].state);
      this.checkoutForm.controls["country"].setValue(this.billingaddress[1].country);
      this.checkoutForm.controls["mobileNo"].setValue(this.billingaddress[1].mobileNo);
      this.checkoutForm.controls["districtName"].setValue(this.billingaddress[1].districtName);
      this.checkoutForm.controls["talukaName"].setValue(this.billingaddress[1].talukaName);
      this.checkoutForm.controls["addressKey"].setValue(this.billingaddress[1].addressKey);

     
        }
  }
  }

  handleOpenLogin() {
    this.isOpenLogin = !this.isOpenLogin;
  }
  handleOpenCoupon() {
    this.isOpenCoupon = !this.isOpenCoupon;
  }

  handleShippingCost(value: number | string) {
    if (value === 'free') {
      this.shipCost = 0;
    } else {
      this.shipCost = value as number;
    }
  }

  public countrySelectOptions = [
    { value: 'select-country', text: 'Select Country' },
    { value: 'berlin-India', text: 'India' },
    // { value: 'paris-france', text: 'Paris France' },
    // { value: 'tokiyo-japan', text: 'Tokiyo Japan' },
    // { value: 'new-york-us', text: 'New York US' },
  ];

  changeHandler(selectedOption: { value: string; text: string }) {

    // Update the 'country' form control with the selected option's value
    this.checkoutForm.patchValue({
      state: selectedOption.value
    });
  }


  handleCouponSubmit() {
    // Add coupon code handling logic here
    if (this.couponCode) {
      // logic here

      // when submitted the from than empty will be coupon code
      this.couponCode = ''
    }
  }

  // handle payment item
  handlePayment(value: string) {
    this.payment_name = value
  }

  public checkoutForm!: FormGroup;
  public formSubmitted = false;
  

Edit() {
  this.Editable = !this.Editable;

  if (!this.Editable) {
    this.toastrService.info("Form is now editable");
  }
}


  ngOnInit () {
    this.checkoutForm = new FormGroup({
      firstName:new FormControl(null,[Validators.required,Validators.pattern("^[a-zA-Z\\s]*"),Validators.maxLength(30)]),
          middleName:new FormControl(null,[Validators.pattern("^[a-zA-Z\\s]*"),Validators.maxLength(30)]),
          lastName:new FormControl(null,[Validators.required,Validators.pattern("^[a-zA-Z\\s]*"),Validators.maxLength(30)]),
          designation:new FormControl(null,[Validators.required]),
          email:new FormControl(null,[Validators.required,Validators.email]),
          mobNo:new FormControl(null,[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("[0-9]{10}")]),
          pinCode:new FormControl(null,[Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern("[0-9]{5}")]),

          address:new FormControl(null,[Validators.required,Validators.maxLength(30)],),
          districtKey:new FormControl(null,[Validators.required]),
          talukaKey:new FormControl(null,[Validators.required]),
          postalCode:new FormControl(null,[Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern("[0-9]{6}")]),
          state:new FormControl(null,[Validators.required,Validators.pattern("^[a-zA-Z\\s]*"),Validators.maxLength(30)]),
          country:new FormControl(null,[Validators.required,Validators.pattern("^[a-zA-Z\\s]*"),Validators.maxLength(30)]),
          mobileNo:new FormControl(null,[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("[0-9]{10}")]),
          shipping:new FormControl(null,),
          billing:new FormControl(null,),
          districtName:new FormControl(null,[Validators.required,Validators.pattern("^[a-zA-Z\\s]*")]),
          talukaName:new FormControl(null,[Validators.required,Validators.pattern("^[a-zA-Z\\s]*"),Validators.maxLength(30)]),
          addressKey:new FormControl(null,)
    })
  }

  onSubmit() {
    this.formSubmitted = true;
    // const payload = {
    //   'id':this.userId,
    //   'mobNo':this.checkoutForm.controls['mobileNo'].value,
    //   ...this.checkoutForm.value
    //   }  
    

   const payload=  {
        "id": this.userId,
        "firstName":this.checkoutForm.controls['firstName'].value,
        "middleName": this.checkoutForm.controls['middleName'].value,
        "lastName": this.checkoutForm.controls['lastName'].value,
        "designation": this.checkoutForm.controls['designation'].value,
        "email": this.checkoutForm.controls['email'].value,
        "mobNo": this.checkoutForm.controls['mobileNo'].value,
        "pinCode": null
      }

      const addresspayload={
        "address": this.checkoutForm.controls['address'].value,
        "billing": 1,
        "shipping": 0,
        "country":this.checkoutForm.controls["country"].value,
        "state": this.checkoutForm.controls['state'].value,
        "districtKey":this.checkoutForm.controls['districtKey'].value,
        "talukaKey": this.checkoutForm.controls['talukaKey'].value,
        "postalCode":this.checkoutForm.controls['postalCode'].value,
        "mobileNo": this.checkoutForm.controls['mobileNo'].value,
      }
      

  
    if (!this.checkoutForm.valid) {
      let addressKey= this.checkoutForm.controls["addressKey"].value   
            this.user.updateUser(payload).subscribe(
        (res:any) => {
          console.log("res",res)
        },
        (error:any) => {
          console.log('error', error); 
        });
      
      
        this.user.updateBillingAddress(addresspayload,addressKey).subscribe(
          (res:any) => {
            console.log("res",res)
          },
          (error:any) => {
            console.log('error', error); 
          });
          
      const orderRequest = this.prepareOrderRequest();

      
      this.cartService.placeOrder(orderRequest).subscribe((res: any) => {
        this.toastrService.success("Order placed successfully");
      });

      // Reset the form
      this.toastrService.success("Order placed successfully");
      this.checkoutForm.reset();
      this.formSubmitted = false; // Reset formSubmitted to false
      this.clearcart(this.userId);
      this.router.navigate(['/home/electronic']);
      
    }
  }
  clearcart(userId: number): void {
    this.cartService.clear_cart(userId).subscribe({
      
    });
  }

  prepareOrderRequest(): OrderRequest {
    let orderDetailsRequestList:any= [];
      if(this.buynow){
        orderDetailsRequestList.push({
          productId:this.productId,
          stockId:this.stockId,
          quantityInOrder: this.Quantity,
          productAmount:this.Total.toFixed(2),
          offerId:0,
          baseSizeMrpId : this.baseSizeMrpId,
        });
      }else{
        
        for(let i=1;i<=this.products.length;i++){
          orderDetailsRequestList = this.products.map((product: { productId: any; stockId: any; quantityInKit: any; productAmount: any; sellingPrice:any;salesGst:any;offerId:any }) => ({
            productId: product.productId,
            stockId: product.stockId,
            quantityInOrder: product.quantityInKit,
            productAmount:   this.calculateGST(product.sellingPrice,product.quantityInKit,product.salesGst),            
            offerId:product.offerId
          }));
        }
      }
    // Calculate GST (assuming 18% - adjust as needed)
    // const gstPercentage = 18;
    // const totalGST = (this.subTotal * gstPercentage) / 100;
  
    return {
      orderDetailsRequestList,
      totalAmount:this.SubTotal,
      // totalGST : this.gstamount,
    };
  }

   get firstName() { return this.checkoutForm.get('firstName') }
   get middleName() { return this.checkoutForm.get('middleName') }
   get lastName() { return this.checkoutForm.get('lastName') }
   get designation() { return this.checkoutForm.get('designation') }
   get email() { return this.checkoutForm.get('email') }
   get mobNo() { return this.checkoutForm.get('mobileNo') }
   get pinCode() { return this.checkoutForm.get('pinCode') }

   get address() { return this.checkoutForm.get('address') }
   get districtKey() { return this.checkoutForm.get('districtKey') }
   get talukaKey() { return this.checkoutForm.get('talukaKey') }
   get postalCode() { return this.checkoutForm.get('postalCode') }
   get state() { return this.checkoutForm.get('state') }
   get country() { return this.checkoutForm.get('country') }
   get mobileNo() { return this.checkoutForm.get('mobileNo') }
   get districtName() { return this.checkoutForm.get('districtName') }
   get talukaName() { return this.checkoutForm.get('talukaName') }
   get addressKey() { return this.checkoutForm.get('addressKey') }

}
