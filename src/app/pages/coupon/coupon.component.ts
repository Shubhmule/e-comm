import { Component } from '@angular/core';
import coupon_data from '@/data/coupon-data';
import { ICoupon } from '@/types/coupon-type';
import { ProfileServiceService } from '../profile/profile-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent {
  public coupons = coupon_data;
  userDetails: any;
  referralCode: any;
  copiedBtn :boolean = false;
  codeeBtn :boolean = true;
  userId: any;

  constructor(private ProfileServiceService:ProfileServiceService,
    private router : Router,
  ){
    if (sessionStorage.getItem('currentUser') != "") {
      var currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      this.userId = currentUser && currentUser.id;
      // console.log("userId " + this.userId);
      if(this.userId == undefined){
        this.router.navigate(['/pages/login']);
      }else{
        this.router.navigate(['/pages/coupons']);
      } 
    }
    this.getUserDetailsForCoupon();
  }

  isCouponActive(coupon: ICoupon): boolean {
    const currentTime = new Date().getTime();
    const couponEndTime = new Date(coupon.endTime).getTime();

    return currentTime > couponEndTime;
  }

  index: number | null = null;

  async copyCouponCode(couponCode: string, i: number) {

    try {
      await navigator.clipboard.writeText(couponCode);
      // Set the "Copied" message to true
      this.index = i;

      // Reset the "Copied" message after 3000 ms (3 seconds)
      setTimeout(() => {
        this.index = null;
      }, 3000);
    } catch (error) {
      console.error('Failed to copy: ', error);
    }
  }

  async copyrefferanceCode(couponCode: string) {

    try {
      await navigator.clipboard.writeText(couponCode);
      // Set the "Copied" message to true
      // this.index = i;
      this.copiedBtn = true;
      this.codeeBtn = false;
      // Reset the "Copied" message after 3000 ms (3 seconds)
      setTimeout(() => {
        this.index = null;
      }, 3000);
    } catch (error) {
      console.error('Failed to copy: ', error);
    }
  }

  getUserDetailsForCoupon(){
    this.ProfileServiceService.getUserDetailsForCoupon().subscribe(res => {
      this.userDetails = res;
      this.referralCode = this.userDetails.referralCode;
    });
  }
}
