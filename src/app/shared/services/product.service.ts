import { IProduct } from '@/types/product-type';
import { Injectable } from '@angular/core';
import { of,Observable } from 'rxjs';
import  product_data from '@/data/product-data';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environment/environment';
import { HttpClient } from '@angular/common/http';

const all_products = product_data

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  [x: string]: any;
  public filter_offcanvas: boolean = false;


  // Get Products
  public get products(): Observable<any[]> {
    return of(product_data);
  }
  setReview(productId:any,ratings:any)
  {
      const url = `${environment.apiBase}/order/add-ratings?productId=${productId}&ratings=${ratings}`
      return this.http.put(url,{});
  }

  constructor(private http: HttpClient) { }

  activeImg: string | undefined;

  handleImageActive(img: string) {
    this.activeImg = img;    
  }

  // Get Products By id
  public getProductById(id: string): Observable<IProduct | undefined> {
    return this.products.pipe(map(items => {
      const product = items.find(p => p.id === id);
      if(product){
        this.handleImageActive(product.stockImage)
      }
      return product;
    }));
  }
   // Get related Products
   public getRelatedProducts(productId: string,category:string): Observable<IProduct[]> {
    return this.products.pipe(map(items => {
      return items.filter(
        (p) =>
          p.category.name.toLowerCase() === category.toLowerCase() &&
          p.id !== productId
      )
    }));
  }
  // Get max price
  public get maxPrice(): number {
    // const max_price = all_products.reduce((max, product) => {
    //   return product.price > max ? product.price : max;
    // }, 0);
    const max_price=500000
    return max_price
  }
// shop filterSelect
  public filterSelect = [
     { value: 'asc', text: 'Default Sorting' },
    { value: 'low', text: 'Low to Hight' },
    { value: 'high', text: 'High to Low' },
    // { value: 'on-sale', text: 'On Sale' },
  ];

    // Get Product Filter
    public filterProducts(filter: any= []): Observable<IProduct[]> {
      return this.products.pipe(map(product =>
        product.filter((item: IProduct) => {
          if (!filter.length) return true
          const Tags = filter.some((prev: any) => {
            if (item.tags) {
              if (item.tags.includes(prev)) {
                return prev;
              }
            }
          });
          return Tags
        })
      ));
    }


      // Sorting Filter
  public sortProducts(products: IProduct[], payload: string): any {

    if(payload === 'asc') {
      return products.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'on-sale') {
      return products.filter((p) => p.discount > 0)
    } else if (payload === 'low') {
      return products.sort((a, b) => {
        if (a.price < b.price) {
          return -1;
        } else if (a.price > b.price) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'high') {
      return products.sort((a, b) => {
        if (a.price > b.price) {
          return -1;
        } else if (a.price < b.price) {
          return 1;
        }
        return 0;
      })
    }
  }

  /*
    ---------------------------------------------
    ------------- Product Pagination  -----------
    ---------------------------------------------
  */
  public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 9) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // Paginate Range
     let paginateRange = 3;

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else if(currentPage < paginateRange - 1){
      startPage = 1;
      endPage = startPage + paginateRange - 1;
    } else {
      startPage = currentPage - 1;
      endPage =  currentPage + 1;
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  getProductDetails(id:String,type:string)
  {
    // return this.http.get(`${environment.apiBase}/stock/get-product-details/`+id+`/`+type);
    // return this.http.get(`${environment.apiBase}/stock/products?stockId=`+id+`&productType=`+type);
    return this.http.get(`${environment.apiBase}/stock/product-details?stockId=`+id+`&productType=`+type);

  }

  getAllBaseSize(id:string)
  {
    return this.http.get(`${environment.apiBase}/base-size/${id}`);
  }

  
  getsearchproduct(search:string)
  {
    console.log("search----------->",search);   
    return this.http.get(`${environment.apiBase}/stock/products?searchText=${search}`);
  }

  getLatestProducts()
  {
    //  return this.http.get(`${environment.apiBase}/stock/get-newest-product`);
      return this.http.get(`${environment.apiBase}/stock/products?newProducts=true&export=true`);
  }


  // ----------------------offer-----------------------------

  getoffer(id:any){
    return this.http.get(`${environment.apiBase}/offer/get/offers/of/product/${id}`)
  }
}
