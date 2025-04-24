import { ComponentService } from '@/shared/components/component.service';
import { CartService } from '@/shared/services/cart.service';
import { WishlistService } from '@/shared/services/wishlist.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-electronics',
  templateUrl: './electronics.component.html',
  styleUrls: ['./electronics.component.scss'],
})
export class ElectronicsComponent {
  categoryList: any[] = [];
  brandsList: any[] = [];
  auth: any = '';

  constructor(
    wishlist: WishlistService,
    cart: CartService,
    public componentService: ComponentService
  ) {
    this.auth = sessionStorage.getItem('currentUser') || null;

    if (this.auth !== null) {
      wishlist.initializeCounter();
      cart.initializeCounter();
    }

    this.getAllCategoryCST();
    this.getAllBrandsCST();
  }

  getAllCategoryCST() {
    this.componentService.getCategoriesForCSTPanel().subscribe((res) => {
      this.categoryList = res;
    });
  }

  getAllBrandsCST() {
    this.componentService.getBrandsForCSTPanel().subscribe((res) => {
      this.brandsList = res;
    });
  }
}
