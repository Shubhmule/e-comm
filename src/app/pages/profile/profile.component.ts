import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ProfileServiceService } from './profile-service.service';
import { AuthenticationService } from 'src/app/auth/auth-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '@/shared/services/order.service';
import { WishlistService } from '@/shared/services/wishlist.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';


function emailWithDotValidator(control: AbstractControl): ValidationErrors | null {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
  if (control.value && !emailRegex.test(control.value)) {
    return { invalidEmail: true }; 
  }
  return null;
}



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent  implements OnInit{


  isLoading=true
  userId: any;
  userDetails: any = {};
  billingaddress:any={};
  shippingaddress:any={};
  addresses: any = [];
  district:any=[];
  taluka:any=[];
  addresskey:any;
  billingbutton:boolean=true;
  shipingbutton:boolean=true;
  public personalForm!: FormGroup;
  public billingForm!:FormGroup;
  public shippingForm!:FormGroup;
  useName: any;
  authentication : boolean = false;
  successResponse: any;
  public formSubmitted = false;
  shippingadressForm : boolean = false;
  billadressForm :boolean = false;
  billAddress :boolean = true; 
  shippingAddress : boolean = true;
  userRewardPoint: any;
  selecteddistrictId: number | null = null;
  data:any=[]
  orderDetails:any={};

  changeHandler(selectedOption: { value: string; text: string }) {
    console.log('Selected option:', selectedOption);
  }

  constructor(private user:ProfileServiceService,private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,private router: Router,private toastrService: ToastrService,public order:OrderService,public wishlistService: WishlistService){
     let id= JSON.parse(sessionStorage['currentUser'] || '[]')
     this.getorder(id.id)
    
      if (sessionStorage.getItem('currentUser') != "") {
      var currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      this.userId = currentUser.id;
      this.useName = currentUser.firstName + ' ' + currentUser.lastName;
      //  console.log("userId" + this.userId);
      if(this.userId == undefined){
        this.authentication = false;
      }else{
        this.authentication = true;
      }      
    }
    this.getuserDetails();
    this.getaddress();
    this.getdistrict();
   

  }
  ngOnInit(){
    this.personalForm = new FormGroup({
          firstName:new FormControl(null,[Validators.required,Validators.minLength(3),Validators.pattern("^[a-zA-Z\\s]*"),Validators.maxLength(30)]),
          middleName:new FormControl(null,[Validators.pattern("^[a-zA-Z\\s]*"),Validators.minLength(3),Validators.maxLength(30)]),
          lastName:new FormControl(null,[Validators.required,Validators.pattern("^[a-zA-Z\\s]*"),Validators.minLength(3),Validators.maxLength(30)]),
          designation:new FormControl(null,[Validators.required]),
          email:new FormControl(null,[Validators.required,Validators.email,emailWithDotValidator]),
          mobNo:new FormControl(null,[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("[0-9]{10}")]),
          pinCode:new FormControl(null)
        })
        this.userDetails= this.personalForm.value;
        
    this.billingForm=new FormGroup({
          address:new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(50)]),
          districtKey:new FormControl(null,[Validators.required]),
          talukaKey:new FormControl(null,[Validators.required]),
          postalCode:new FormControl(null,[Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern("[0-9]{6}")]),
          state:new FormControl(null,[Validators.required,Validators.pattern("^[a-zA-Z\\s]*"),Validators.minLength(3),Validators.maxLength(30)]),
          country:new FormControl(null,[Validators.required,Validators.pattern("^[a-zA-Z\\s]*"),Validators.minLength(3),Validators.maxLength(30)]),
          mobileNo:new FormControl(null,[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("[0-9]{10}")]),
          shipping:new FormControl(null,),
          billing:new FormControl(null,),
          districtName:new FormControl(null),
          talukaName:new FormControl(null),
          addressKey:new FormControl(null,)
    })
    this.billingaddress=this.billingForm.value;
    this.shippingForm=new FormGroup({
      address:new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(50)]),
          districtKey:new FormControl(null,[Validators.required]),
          talukaKey:new FormControl(null,[Validators.required]),
          postalCode:new FormControl(null,[Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern("[0-9]{6}")]),
          state:new FormControl(null,[Validators.required,Validators.pattern("^[a-zA-Z\\s]*"),Validators.minLength(3),Validators.maxLength(30)]),
          country:new FormControl(null,[Validators.required,Validators.pattern("^[a-zA-Z\\s]*"),Validators.minLength(3),Validators.maxLength(30)]),
          mobileNo:new FormControl(null,[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("[0-9]{10}")]),
          shipping:new FormControl(null,),
          billing:new FormControl(null,),
          districtName:new FormControl(null),
          talukaName:new FormControl(null),
          addressKey:new FormControl(null,)
})
  this.shippingAddress=this.shippingForm.value;
  
  }
  
  openInvoiceModal(orderId: string){
    this.user.getorderDetails(orderId).subscribe(res=>
      {
          this.orderDetails=res;
      }
      );
  }

  downloadInvoice() {
    const doc = new jsPDF();

    // Add company logo
    const img = new Image();
    img.src = '/assets/img/logo/logo.png';
  
    img.onload = () => {
      doc.addImage(img, 'PNG', 80, 10, 50, 20); // Centered logo
  
      // Company Info
      doc.setFontSize(18);
      doc.text("GlobTechno Software Services", 105, 40, { align: "center" });
      doc.setFontSize(12);
      doc.line(10, 60, 200, 60); 
      doc.text(
        "Office No. 606, 6th Floor, The Stellar Complex, Laxmi Chowk Rd, Bhumkar Nagar, Wakad, Pimpri-Chinchwad, Maharashtra",
        105, // Approx center of A4 (210 width / 2)
        47,
        {
          align: "center",
          maxWidth: 190 // or any width you prefer
        }
      );      
      // doc.text("Helpline: +1 (800) 123-4567", 105, 58, { align: "center" });

      // Invoice Details
      doc.setFontSize(14);
      // doc.text("Invoice #1234", 10, 70);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 70);
  
      // Billed To
      doc.text("Billed To:", 10, 80);
      doc.setFontSize(12);
      doc.text(`Name: ${this.useName}`, 10, 87);
      doc.text(`Address: ${this.billingaddress.address}`, 10, 94);
      doc.text(`Email: ${this.userDetails.email}`, 10, 101);
  
      // Order Summary Table
      const headers = [["Item", "Quantity", "Unit Price", "Total"]];
      const data = this.orderDetails.orderDetailsResponseList.map((item: { productName: any; quantityInOrder: number; productAmount: number; }) => [
        item.productName,
        item.quantityInOrder.toString(),
        `${item.productAmount}`,
        `${(item.quantityInOrder * item.productAmount).toFixed(2)}`
      ]);
  
      // Capture table height
      const tableYPosition = 110;
      const table = autoTable(doc, {
        startY: tableYPosition,
        head: headers,
        body: data,
        theme: "grid",
        styles: { fontSize: 10, halign: "center" },
        headStyles: { fillColor: [0, 0, 0] } // Black header
      });
  
      // Get the last printed Y position (bottom of the table)
      const finalY = (doc as any).lastAutoTable?.finalY || tableYPosition + 10;
  
      // Total Amount
      doc.setFontSize(14);
      doc.text(`Total Amount: ${this.orderDetails.totalAmount}`, 100, finalY + 10);
  
      // Footer
      doc.line(10, finalY + 20, 200, finalY + 20);
      doc.setFontSize(10);
      doc.text("Thank you for your business!", 105, finalY + 30, { align: "center" });
  
      // Save PDF
      doc.save(`Invoice.pdf`);
    };
  }

  getuserDetails() {
    this.user.getUserDetails(this.userId).subscribe(res => {
      this.userDetails = res;
      this.userRewardPoint=this.userDetails.userRewardPoint;
      this.setvalues();
      
    });
  }

  setvalues(){
    if(this.userDetails){
      this.personalForm.controls["lastName"].setValue(this.userDetails.lastName);
      this.personalForm.controls["designation"].setValue(this.userDetails.designation);
      this.personalForm.controls["email"].setValue(this.userDetails.email);
      this.personalForm.controls["mobNo"].setValue(this.userDetails.mobNo);
      this.personalForm.controls["pinCode"].setValue(this.userDetails.pinCode);
      this.personalForm.controls["firstName"].setValue(this.userDetails.firstName);
      this.personalForm.controls["middleName"].setValue(this.userDetails.middleName);
    }
    // console.log(this.personalForm.controls['pinCode'].value);
    
  }

  showBilladdress(){
    this.shippingadressForm = false;
    this.billadressForm = true
    this.billAddress = false;
    this.shippingAddress = false;
    this.setbillingaddress();
  }

  showshippingaddress(){
    this.shippingadressForm = true;
    this.billadressForm = false;
    this.billAddress = false;
    this.shippingAddress = false;
    this.setshippingaddress();
  }

  cancelAddressForm(){
    this.shippingadressForm = false;
    this.billadressForm = false;
    this.billAddress = true;
    this.shippingAddress = true;
  }


  onSubmit(){
    const payload = {
      'id':this.userId,
      'firstName': this.personalForm.controls['firstName'].value,
      'middleName': this.personalForm.controls['middleName'].value,
      'lastName': this.personalForm.controls['lastName'].value,
      'designation': this.personalForm.controls['designation'].value,
      'email': this.personalForm.controls['email'].value,
      'mobNo': this.personalForm.controls['mobNo'].value,
      'pinCode': this.personalForm.controls['pinCode'].value
      }
    if (this.personalForm.valid) {
      this.user.updateUser(payload).subscribe(
        (response) => {
          this.successResponse = response;
            if(this.successResponse.message == "Error: Phone number is already registered!"){
              this.toastrService.error(`Phone number is already registered!`);
              this.personalForm.reset();
            }else{
              this.toastrService.success(`User Updated successfully`);
              // this.removeUser();
              this.router.navigate(['/pages/profile']);
            }
        },
        (error) => {
          console.log('error', error);
          this.toastrService.error(error);
          this.personalForm.reset();
          this.formSubmitted = false;
        });
    }

    
  }
  
  removeUser() {
    window.sessionStorage.removeItem('currentUser');
    window.localStorage.clear();
     this.router.navigate(['/pages/login']);
     this.authenticationService.logout();
   }

   get firstName() { return this.personalForm.get('firstName') }
   get middleName() { return this.personalForm.get('middleName') }
   get lastName() { return this.personalForm.get('lastName') }
   get designation() { return this.personalForm.get('designation') }
   get email() { return this.personalForm.get('email') }
   get mobNo() { return this.personalForm.get('mobNo') }
   get pinCode() { return this.personalForm.get('pinCode') }


  // --------------------------------------------address-------------------------------------------------------------

  getaddress() {
    this.user.getaddress(this.userId).subscribe(res => {
      this.addresses = res;
      if(this.addresses[0].billing){
        this.billingaddress=this.addresses[0];
        this.getTalukaBillingUpdate(this.billingaddress.districtKey);
        this.billingbutton=false;
      }
      if(this.addresses[1]!= null){
        if(this.addresses[1].billing){
          this.billingaddress=this.addresses[1];
          this.getTalukaBillingUpdate(this.billingaddress.districtKey);
          this.billingbutton=false;
        }
      }
      if(this.addresses[0].shipping){
        this.shippingaddress=this.addresses[0];
        this.getTalukaUpdate(this.shippingaddress.districtKey); 
        this.shipingbutton=false;
      }
      if(this.addresses[1]!= null){
      if(this.addresses[1].shipping){
        this.shippingaddress=this.addresses[1];
        this.getTalukaUpdate(this.shippingaddress.districtKey); 
        this.shipingbutton=false;
      }
      }

    
      
      });  
      
  }
  setbillingaddress(){
    if(this.addresses[0]!= null){
      if(this.addresses[0].billing){
        this.billingForm.controls["address"].setValue(this.billingaddress.address);
        this.billingForm.controls["districtKey"].setValue(this.billingaddress.districtKey);
        this.billingForm.controls["talukaKey"].setValue(this.billingaddress.talukaKey);
        this.billingForm.controls["postalCode"].setValue(this.billingaddress.postalCode);
        this.billingForm.controls["state"].setValue(this.billingaddress.state);
        this.billingForm.controls["country"].setValue(this.billingaddress.country);
        this.billingForm.controls["mobileNo"].setValue(this.billingaddress.mobileNo);
        this.billingForm.controls["districtName"].setValue(this.billingaddress.districtName);
        // this.billingForm.controls["talukaName"].setValue(this.billingaddress.talukaName);
        this.billingForm.controls["addressKey"].setValue(this.billingaddress.addressKey);        
      }
    }
    if(this.addresses[1]!= null){
      if(this.addresses[1].billing){
      this.billingForm.controls["address"].setValue(this.billingaddress.address);
      this.billingForm.controls["districtKey"].setValue(this.billingaddress.districtKey);
      this.billingForm.controls["talukaKey"].setValue(this.billingaddress.talukaKey);
      this.billingForm.controls["postalCode"].setValue(this.billingaddress.postalCode);
      this.billingForm.controls["state"].setValue(this.billingaddress.state);
      this.billingForm.controls["country"].setValue(this.billingaddress.country);
      this.billingForm.controls["mobileNo"].setValue(this.billingaddress.mobileNo);
      this.billingForm.controls["districtName"].setValue(this.billingaddress.districtName);
      // this.billingForm.controls["talukaName"].setValue(this.billingaddress.talukaName);
      this.billingForm.controls["addressKey"].setValue(this.billingaddress.addressKey);
        }
  }
  }
   
  setshippingaddress(){
    if(this.addresses[0]!= null){
      if(this.addresses[0].shipping){
        this.shippingForm.controls["address"].setValue(this.shippingaddress.address);
        this.shippingForm.controls["districtKey"].setValue(this.shippingaddress.districtKey);
        this.shippingForm.controls["talukaKey"].setValue(this.shippingaddress.talukaKey);
        this.shippingForm.controls["postalCode"].setValue(this.shippingaddress.postalCode);
        this.shippingForm.controls["state"].setValue(this.shippingaddress.state);
        this.shippingForm.controls["country"].setValue(this.shippingaddress.country);
        this.shippingForm.controls["mobileNo"].setValue(this.shippingaddress.mobileNo);
        // this.shippingForm.controls["districtName"].setValue(this.shippingaddress.districtName);
        // this.shippingForm.controls["talukaName"].setValue(this.shippingaddress.talukaName);
        this.billingForm.controls["addressKey"].setValue(this.shippingaddress.addressKey);    
      }
    }
    if(this.addresses[1]!= null){
      if(this.addresses[1].shipping){
        this.shippingForm.controls["address"].setValue(this.shippingaddress.address);
        this.shippingForm.controls["districtKey"].setValue(this.shippingaddress.districtKey);
        this.shippingForm.controls["talukaKey"].setValue(this.shippingaddress.talukaKey);
        this.shippingForm.controls["postalCode"].setValue(this.shippingaddress.postalCode);
        this.shippingForm.controls["state"].setValue(this.shippingaddress.state);
        this.shippingForm.controls["country"].setValue(this.shippingaddress.country);
        this.shippingForm.controls["mobileNo"].setValue(this.shippingaddress.mobileNo);
        // this.shippingForm.controls["districtName"].setValue(this.shippingaddress.districtName);
        // this.shippingForm.controls["talukaName"].setValue(this.shippingaddress.talukaName);    
    }
     
    }
    
  }

  submitBillingaddress(){
     console.log(this.billingaddress.addressKey);
     
    
       const payload = {
      'address': this.billingForm.controls['address'].value,
      'districtKey': this.billingForm.controls['districtKey'].value,
      'talukaKey': this.billingForm.controls['talukaKey'].value,
      'postalCode': this.billingForm.controls['postalCode'].value,
      'state': this.billingForm.controls['state'].value,
      'country': this.billingForm.controls['country'].value,
      'mobileNo': this.billingForm.controls['mobileNo'].value,
      'shipping': 0,
      'billing': 1
      }
      console.log("not valid yet "+this.billingForm.controls["addressKey"].value);
      if(this.billingbutton){
        this.user.addBillingAddress(payload).subscribe(
          (response) => {
            this.successResponse = response;
              console.log('response', response);
              if(this.successResponse.message == "Address already present"){
                this.toastrService.error(`Error: Address already present`);
                this.personalForm.reset();
              }else{
                this.toastrService.success(`Address Added successfully`);
                // this.removeUser();
                this.cancelAddressForm();
                this.router.navigate(['/pages/profile']);
                this.getaddress();
              }
          },
          (error) => {
            console.log('error', error);
            this.toastrService.error(error);
            this.personalForm.reset();
            this.formSubmitted = false;
          });
      }
      else{
     if (this.billingForm.valid) {
        this.user.updateBillingAddress(payload,this.billingaddress.addressKey).subscribe(
          (response) => {
            this.successResponse = response;
              console.log('response', response);
              if(this.successResponse.message == "Error: Address not found with id "+this.billingForm.controls["addressKey"].value){
                this.toastrService.error(`Error: Address not found with id `+this.billingForm.controls["addressKey"].value);
                this.personalForm.reset();
              }else{
                this.toastrService.success(`Address Updated successfully`);
                // this.removeUser();
                this.cancelAddressForm();
                this.router.navigate(['/pages/profile']);
                this.getaddress();
              }
          },
          (error) => {
            console.log('error', error);
            this.toastrService.error(error);
            this.personalForm.reset();
            this.formSubmitted = false;
          });
     
     }
    }

  }

  submitShippingaddress(){
  
    const payload = {
   'address': this.shippingForm.controls['address'].value,
   'districtKey': this.shippingForm.controls['districtKey'].value,
   'talukaKey': this.shippingForm.controls['talukaKey'].value,
   'postalCode': this.shippingForm.controls['postalCode'].value,
   'state': this.shippingForm.controls['state'].value,
   'country': this.shippingForm.controls['country'].value,
   'mobileNo': this.shippingForm.controls['mobileNo'].value,
   'shipping': true,
   'billing': false
   }

   if(this.shipingbutton){
    this.user.addBillingAddress(payload).subscribe(
      (response) => {
        this.successResponse = response;
          console.log('response', response);
          if(this.successResponse.message == "Address already present"){
            this.toastrService.error(`Error: Address already present`);
            this.personalForm.reset();
          }else{
            this.toastrService.success(`Address Added successfully`);
            // this.removeUser();
            this.cancelAddressForm();
            this.router.navigate(['/pages/profile']);
            this.getaddress();
          }
      },
      (error) => {
        console.log('error', error);
        this.toastrService.error(error);
        this.personalForm.reset();
        this.formSubmitted = false;
      });
  }
else{
   if (this.shippingForm.valid) {
    this.user.updateBillingAddress(payload,this.shippingaddress.addressKey).subscribe(
      (response) => {
        this.successResponse = response;
          console.log('response', response);
          if(this.successResponse.message == "Error: Address not found with id "+this.shippingForm.controls["addressKey"].value){
            this.toastrService.error(`Error: Address not found with id `+this.shippingForm.controls["addressKey"].value);
            this.personalForm.reset();
          }else{
            this.toastrService.success(`Address Updated successfully`);
            // this.removeUser();
            this.cancelAddressForm();
            this.router.navigate(['/pages/profile']);
            this.getaddress();
          }
      },
      (error) => {
        console.log('error', error);
        this.toastrService.error(error);
        this.personalForm.reset();
        this.formSubmitted = false;
      });
  }
}

}

  // ----------------------------------------------get taluka and district--------------------------------------------------------

  getdistrict() {
    this.user.getDistrict().subscribe(res => {
      this.district = res;
      });
  }

  getdistrictid(event :any)
  {
    if(this.billingForm.controls["districtKey"].value != null){
      const selectElement = event.target as HTMLSelectElement;
      const districtID = selectElement.value;
    // alert(selectedOption);
      this.user.getTaluka(districtID).subscribe(res => {
        this.taluka = res;
        });
    }
  }

  getTalukaUpdate(event:any){
    const districtID = event;
      this.user.getTaluka(districtID).subscribe(res => {
        this.taluka = res;
      });
  }

  getTalukaBillingUpdate(event:any){
    const districtID = event;
      this.user.getTaluka(districtID).subscribe(res => {
        this.taluka = res;
      });
  }
  
  getdistrictidforshippling(event:any)
  {
    if(this.shippingForm.controls["districtKey"].value != null){
      const selectElement = event.target as HTMLSelectElement;
      const districtID = selectElement.value;
      this.user.getTaluka(districtID).subscribe(res => {
        this.taluka = res;
      });
    }
    
  }
// ----------------------------------------------validation for billing and shiiping form-----------


get baddress() { return this.billingForm.get('address') }
get bdistrictKey() { return this.billingForm.get('districtKey') }
get btalukaKey() { return this.billingForm.get('talukaKey') }
get bpostalCode() { return this.billingForm.get('postalCode') }
get bstate() { return this.billingForm.get('state') }
get bcountry() { return this.billingForm.get('country') }
get bmobileNo() { return this.billingForm.get('mobileNo') }
get bdistrictName() { return this.billingForm.get('districtName') }
// get btalukaName() { return this.billingForm.get('talukaName') }
get baddressKey() { return this.billingForm.get('addressKey') }

get saddress() { return this.shippingForm.get('address') }
get sdistrictKey() { return this.shippingForm.get('districtKey') }
get stalukaKey() { return this.shippingForm.get('talukaKey') }
get spostalCode() { return this.shippingForm.get('postalCode') }
get sstate() { return this.shippingForm.get('state') }
get scountry() { return this.shippingForm.get('country') }
get smobileNo() { return this.shippingForm.get('mobileNo') }
get sdistrictName() { return this.shippingForm.get('districtName') }
// get stalukaName() { return this.shippingForm.get('talukaName') }
get saddressKey() { return this.shippingForm.get('addressKey') }

// ----------------------------------------------fetch orders-----------
getorder(id:number) {
  this.order.getorders(id).subscribe(
    (res) => {
      this.data = res;
     this.isLoading=false
    },
    (error) => {
      console.error('Error fetching orders:', error);
    }
  );
}

 
}

