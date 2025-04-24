export  interface OrderDetails {
    productId: number;
    stockId: number;
    quantityInOrder: number;
    productAmount: number;
  }
  
  export  interface OrderRequest {
    orderDetailsRequestList: OrderDetails[];
    totalAmount: number;
    // totalGST: number;
  }
  
  export  interface Product {
    productId: number;
    stockId: number;
    quantityInOrder: number;  
    productAmount: number;    
  }
