import { Component, Input } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';
import { ComponentService } from '@/shared/components/component.service';

@Component({
  selector: 'app-status-filter',
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.scss'],
})
export class StatusFilterComponent {
  @Input() brandID!: any;
  status: any[] = [];
  activeQuery: string = '';
  category: any = 0;
  brand:any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewScroller: ViewportScroller,
    public productService: ProductService,
    public componentService: ComponentService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.category = params['type'];
      this.brand =Number(params['brand'])

      this.getAllBrandsCST();
    });
    console.log(this.brandID);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.activeQuery = queryParams['status'];
     
      
    });
    
  }

  getAllBrandsCST() {
    this.componentService.getBrandsForCSTPanel().subscribe((res) => {
      this.status = res.filter((a) => a.categoryKey == this.category);
    });
  }

  handleStatusRoute(status: string, no: number): void {
    const newStatus = status.toLowerCase().split(' ').join('-');
    const brand = no;
    // const newStatus = status
    // Define the query parameters as an object
    const queryParams: Params = {
      status: newStatus,
      brand: brand,
    };

    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams, // Pass the queryParams object here
        queryParamsHandling: 'merge',
        skipLocationChange: false,
      })
      .finally(() => {
        this.viewScroller.setOffset([120, 120]);
        this.viewScroller.scrollToAnchor('products'); // Anchore Link
      });
  }
}
