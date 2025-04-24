type IReview = {
  user?:string;
  name:string;
  email:string;
  rating:number;
  review:string;
  date:string;
}

export interface IProduct {
  productId?:any,
  stockId?:any,
  id: string;
  sku: string;
  img: string;
  title: string;
  slug: string;
  unit: string;
  imageURLs: {
    color?: {
      name: string;
      clrCode: string;
    };
    img: string;
  }[];
  parent: string;
  children: string;
  price: number;
  discount: number;
  quantity: number;
  brand: {
    name: string;
  };
  category: {
    name: string;
  };
  status: string;
  reviews?: IReview[];
  productType: string;
  description: string;
  orderQuantity?: number;
  additionalInformation: {
    key: string;
    value: string;
  }[];
  featured?: boolean;
  sellCount: number;
  offerDate?:{
    startDate:string;
    endDate:string;
  }
  tags?: string[];
  videoId?:string;
  sizes?:string[];
}

export interface productD{
    is_branch: boolean,
    category_name: string,
    product_image: string,
    product_code: string,
    ssn_code: number,
    is_brand: boolean,
    product_category_id: number,
    product_desc: string,
    prod_sub_cat_id: number,
    purchase_gst: number,
    product_id: number,
    product_star: number,
    sales_gst: number,
    unit_of_measurement_id: number,
    quantity: number,
    category_code: string,
    is_colour: boolean,
    is_warehouse: boolean,
    is_size: boolean,
    hsn_code: number,
    is_rating: boolean,
    stock_id: number,
    product_name: string,
    brand_id: number,
    colour: string,
    product_type: string,
    user_id: number,
    status: boolean
}



export interface custProduc{
  productId: number,
    baseProductId: number,
    wishListKey: number,
    userId: number

}

export interface IContact{
  fullName:string,
  email:string,
  mobileNo?:string,
  subject:string
  message:string,
  saveForLater: boolean
}