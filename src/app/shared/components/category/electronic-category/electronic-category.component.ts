import category_data from '@/data/category-data';
import { Component, Input } from '@angular/core';
import { ComponentService } from '../../component.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Navigation, Pagination } from 'swiper/modules';
import Swiper from 'swiper';

@Component({
  selector: 'app-electronic-category',
  templateUrl: './electronic-category.component.html',
  styleUrls: ['./electronic-category.component.scss']
})
export class ElectronicCategoryComponent {
  @Input() categoryList!: any[];

    constructor(
      public componentService: ComponentService,
      public router : Router,
      private activatedRoute: ActivatedRoute,
    ) {
      
    }
  
    ngOnInit(): void {
      new Swiper('.tp-category-arrival-active', {
        slidesPerView: 4,
        spaceBetween: 30,
        loop: false,
        modules: [Navigation, Pagination],
        pagination: {
          el: ".tp-arrival-slider-dot",
          clickable: true
        },
        navigation: {
          nextEl: ".tp-category-slider-button-next",
          prevEl: ".tp-category-slider-prev-prev",
        },
        breakpoints: {
          '1200': {
            slidesPerView: 4,
          },
          '992': {
            slidesPerView: 3,
          },
          '768': {
            slidesPerView: 2,
          },
          '576': {
            slidesPerView: 2,
          },
          '0': {
            slidesPerView: 1,
          }
        }
      });
    }
  
  
    redirectToProdCategory(productCategoryId:any){
      this.router.navigate(['/productByProductCategory'], {
          queryParams: { type: productCategoryId,},
          relativeTo: this.activatedRoute,
        });
    }
}
