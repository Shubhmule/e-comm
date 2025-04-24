import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  Output,
  Input,
  EventEmitter,
  Inject,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { Options } from '@angular-slider/ngx-slider';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss'],
})
export class PriceFilterComponent implements OnInit {
  @Output() priceFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() buttonClicked = new EventEmitter<void>();

  @Input() min!: number;
  @Input() max!: number;

  tempMin!: number;
  tempMax!: number;

  public collapse = true;
  public isBrowser = false;

  public price: { minPrice: number; maxPrice: number } = {
    minPrice: 0,
    maxPrice: this.productService.maxPrice,
  };

  options: Options = {
    floor: 1,
    ceil: this.productService.maxPrice,
    hidePointerLabels: true,
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private viewScroller: ViewportScroller
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true; // For SSR
    }
  }

  ngOnInit(): void {
    const defaultMin = 0;
    const defaultMax = this.productService.maxPrice || 1000;

    this.min = this.min ?? defaultMin;
    this.max = this.max ?? defaultMax;

    this.tempMin = this.min;
    this.tempMax = this.max;

    this.price = {
      minPrice: this.min,
      maxPrice: this.max,
    };

    this.options = {
      floor: this.min,
      ceil: this.max,
      hidePointerLabels: true,
    };
  }

  appliedFilter(event: any): void {
    this.price = { minPrice: event.value, maxPrice: event.highValue };
    this.min = event.value;
    this.max = event.highValue;
    this.tempMin = this.min;
    this.tempMax = this.max;
    this.priceFilter.emit(this.price);
  }

  handlePriceRoute(): void {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: this.price,
        queryParamsHandling: 'merge',
        skipLocationChange: false,
      })
      .finally(() => {
        this.viewScroller.setOffset([120, 120]);
        this.viewScroller.scrollToAnchor('products');
        this.buttonClicked.emit();
      });
  }

  onMinChange(newMin: number): void {
    // Validation: min must not be negative or greater than max
    if (newMin < 0) {
      newMin = 0;
    }

    if (newMin > this.max) {
      newMin = this.max;
    }

    this.min = newMin;
    this.tempMin = newMin;
    this.price.minPrice = newMin;

    this.priceFilter.emit(this.price);
  }

  onMaxChange(newMax: number): void {
    // Validation: max must not be negative or less than min
    if (newMax < 0) {
      newMax = 0;
    }

    if (newMax < this.min) {
      newMax = this.min;
    }

    this.max = newMax;
    this.tempMax = newMax;
    this.price.maxPrice = newMax;

    this.priceFilter.emit(this.price);
  }

  preventNegativeInput(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'Minus') {
      event.preventDefault();
    }
  }
  
}
