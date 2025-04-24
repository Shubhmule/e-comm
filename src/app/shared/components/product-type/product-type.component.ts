import { Component } from '@angular/core';
import category_data from '@/data/category-data';
import { ComponentService } from '../component.service';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrl: './product-type.component.scss'
})
export class ProductTypeComponent {

  public category_items = category_data.filter(
    (c) => c.productType === "electronics"
  );

  brandsList:any =[];

  constructor(public componentService: ComponentService,
    public router : Router,
    private activatedRoute: ActivatedRoute,
  ) {
    // this.getAllBrandsCST();
  }

  ngOnInit(): void {
    new Swiper('.tp-product-arrival-active', {
      slidesPerView: 4,
      spaceBetween: 30,
      loop: false,
      modules: [Navigation, Pagination],
      pagination: {
        el: ".tp-arrival-slider-dot",
        clickable: true
      },
      navigation: {
        nextEl: ".tp-arrival-slider-button-next",
        prevEl: ".tp-arrival-slider-button-prev",
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

  // getAllBrandsCST() {
  //   this.componentService.getBrandsForCSTPanel().subscribe(res => {
  //     this.brandsList = res;
      
  //   })
  // }

  redirectToProductType(title:any){
    this.router.navigate(['/productByProductType'], {
        queryParams: { type: title,},
        relativeTo: this.activatedRoute,
      });
  }

  public ProductType_data = [
    {
      id: 1,
      title: "Fashion",
      img: "/assets/img/productType/fashion.jpg",
    },
    {
      id: 2,
      title: "Electronics",
      img: "/assets/img/productType/electonics.jpg",
    },
    {
      id: 3,
      title: "Home",
      img: "/assets/img/productType/home.jpg",
    },
    {
      id: 4,
      title: "Grocery",
      img: "/assets/img/productType/grocerry.png",
    },
    {
      id: 5,
      title: "The Clothing Collection",
      img: "/assets/img/productType/cloth.jpg",
    },
  ];

  gotoTypeProductPage(){
    
  }


}
