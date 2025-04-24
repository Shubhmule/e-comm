import { Component, Input } from '@angular/core';
import category_data from '@/data/category-data';
import { ComponentService } from '../../component.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Navigation, Pagination } from 'swiper/modules';
import Swiper from 'swiper';

@Component({
  selector: 'app-electronics-brands',
  templateUrl: './electronics-brands.component.html',
  styleUrl: './electronics-brands.component.scss'
})
export class ElectronicsBrandsComponent {

  @Input() brandsList!: any[];

  constructor(public componentService: ComponentService,
    public router : Router,
    private activatedRoute: ActivatedRoute,
  ) {
    
  }

  ngOnInit(): void {
    new Swiper('.tp-brand-arrival-active', {
      slidesPerView: 4,
      spaceBetween: 30,
      loop: false,
      modules: [Navigation, Pagination],
      pagination: {
        el: ".tp-arrival-slider-dot",
        clickable: true
      },
      navigation: {
        nextEl: ".tp-brand-slider-button-next",
        prevEl: ".tp-brand-slider-prev-prev",
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

  redirectToProdBrand(id:any){
    this.router.navigate(['/productByProductBrand'], {
        queryParams: { type: id,brand:id},
        relativeTo: this.activatedRoute,
      });
  }

}
