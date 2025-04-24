import { ProductService } from '@/shared/services/product.service';
import { IBlogType } from '@/types/blog-type';
import { IProduct } from '@/types/product-type';
import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() products: IProduct[] | IBlogType[] = [];
  @Input() paginate: any = {
    currentPage: 1,     
    pages: [],   
  };

  @Output() setPage: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    this.paginate.pages = this.calculatePages();
  }
  calculatePages(): number[] {
    const totalPages = Math.ceil(this.products?.length / 9); // Example: 10 items per page
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pageSet(page: number) {
    this.paginate.currentPage = page;
    this.setPage.emit(page); // Set Page Number
  }
}
