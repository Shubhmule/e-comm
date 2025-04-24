import { menu_data } from '@/data/menu-data';
import { IMenuItem } from '@/types/menu-d-type';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
})
export class MenuBarComponent {
  public menu_data: IMenuItem[] = menu_data;
  userId: any;
  useName: any;
  authentication: boolean = false;

  constructor(private router: Router) {
    if (sessionStorage.getItem('currentUser') != '') {
      var currentUser = JSON.parse(
        sessionStorage.getItem('currentUser') || '{}'
      );
      this.userId = currentUser && currentUser.id;
      this.useName = currentUser.firstName + ' ' + currentUser.lastName;
      if (this.userId == undefined) {
        this.authentication = false;
      } else {
        this.authentication = true;
      }
    }
  }

  OnMouseclick(prd_sm: any) {
    if (prd_sm.title == 'Wishlist') {
      if (this.userId == undefined) {
        this.router.navigate(['/pages/login']);
      } else {
        this.router.navigate(['/shop/wishlist']);
      }
    } else {
      this.router.navigate([prd_sm.link]);
    }
  }
}
