import { IMenuItem, IMobileType } from "@/types/menu-d-type";

export const menu_data:IMenuItem[] = [
  {
    id:1,
    link:'/home/electronic',
    title:'Home',
    mega_menu:true,
    home_pages:[
      {
        id:1,
        title:'Electronics',
        img:'/assets/img/menu/menu-home-1.jpg',
        link:'/home/electronic'
      },
      // {
      //   id:2,
      //   title:'Fashion',
      //   img:'/assets/img/menu/menu-home-2.jpg',
      //   link:'/home/fashion'
      // },
      // {
      //   id:3,
      //   title:'Beauty',
      //   img:'/assets/img/menu/menu-home-3.jpg',
      //   link:'/home/beauty'
      // },
      // {
      //   id:4,
      //   title:'Jewelry',
      //   img:'/assets/img/menu/menu-home-4.jpg',
      //   link:'/home/jewelry'
      // },
    ]
  },
  // {
  //   id:2,
  //   link:'/shop',
  //   title:'Shop',
  //   mega_menu:true,
  //   shop_mega_menus:[
  //     {
  //       link:'/shop',
  //       title:'Shop Pages',
  //       list_menus:[
  //         {title:'Grid Layout',link:'/shop'},
  //         {title:'Shop Categories',link:'/shop/shop-category'},
  //         {title:'List Layout',link:'/shop/shop-list'},
  //         {title:'Full width Layout',link:'/shop/shop-full-width'},
  //         {title:'1600px Layout',link:'/shop/shop-1600'},
  //         {title:'Left Sidebar',link:'/shop'},
  //         {title:'Right Sidebar',link:'/shop/shop-right-sidebar'},
  //         {title:'Hidden Sidebar',link:'/shop/shop-no-sidebar'},
  //       ]
  //     },
  //     {
  //       link:'/shop',
  //       title:'Features',
  //       list_menus:[
  //         {title:'Filter Dropdown',link:'/shop/shop-filter-dropdown'},
  //         {title:'Filters Offcanvas',link:'/shop/shop-filter-offcanvas'},
  //         {title:'Filters Sidebar',link:'/shop'},
  //         {title:'Load More button',link:'/shop/shop-load-more'},
  //         {title:'1600px Layout',link:'/shop/shop-1600'},
  //         {title:'Collections list',link:'/shop/shop-list'},
  //         {title:'Hidden search',link:'/shop'},
  //         {title:'Search Full screen',link:'/shop'},
  //       ]
  //     },
  //     {
  //       link:'/shop',
  //       title:'Hover Style',
  //       list_menus:[
  //         {title:'Hover Style 1',link:'/shop'},
  //         {title:'Hover Style 2',link:'/shop'},
  //         {title:'Hover Style 3',link:'/shop'},
  //         {title:'Hover Style 4',link:'/shop'}
  //       ]
  //     },
  //   ]
  // },
  {
    id:3,
    link:'/shop',
    title:'Products',
    mega_menu:true,
    product_menus:[
      {
        id:1,
        title:'Shop Page',
        link:'/shop',
        dropdown_menus:[
          {title:'Only Categories',link:'/shop/shop-category'},
          // {title:'Shop Grid with Sidebar',link:'/shop/shop-filter-offcanvas'},
          {title:'Shop Grid',link:'/shop'},
          // {title:'Categories',link:'/shop/shop-category'},
          // {title:'Shop List',link:'/shop/shop-list'},
          // {title:'Product Details',link:'/shop/shop-details'},
        ]
      },
      // {
      //   id:2,
      //   title:'Products',
      //   link:'/shop',
      //   dropdown_menus:[
      //     {title:'Product Simple',link:'/shop/shop-details'},
      //     {title:'With Video',link:'/shop/shop-details-with-video'},
      //     {title:'With Countdown Timer',link:'/shop/shop-details-with-countdown'},
      //     {title:'Variations Swatches',link:'/shop/shop-details'},
      //     {title:'List View',link:'/shop/shop-details-list'},
      //     {title:'Details Gallery',link:'/shop/shop-details-gallery'}
      //   ]
      // },
      // {
      //   id:3,
      //   title:'eCommerce',
      //   link:'/shop',
      //   dropdown_menus:[
      //     {title:'Shopping Cart',link:'/shop/cart'},
      //     {title:'Track Your Order',link:'/shop/order'},
      //     {title:'Compare',link:'/shop/compare'},
      //     {title:'Wishlist',link:'/shop/wishlist'},
      //     {title:'Checkout',link:'/pages/checkout'},
      //     {title:'My account',link:'/pages/profile'}
      //   ]
      // },
      // {
      //   id:4,
      //   title:'More Pages',
      //   link:'/shop',
      //   dropdown_menus:[
      //     {title:'About',link:'/pages/about'},
      //     {title:'Login',link:'/pages/login'},
      //     {title:'Register',link:'/pages/register'},
      //     {title:'Forgot Password',link:'/pages/forgot'},
      //     {title:'404 Error',link:'/pages/404'}
      //   ]
      // },
    ]
  },
  {
    id:4,
    link:'/pages/coupons',
    title:'Coupons & Referal Code',
  },
  // {
  //   id:5,
  //   link:'/pages/blog',
  //   title:'Blog',
  //   drop_down:true,
  //   dropdown_menus:[
  //     {title:'Blog Standard',link:'/pages/blog'},
  //     {title:'Blog Grid',link:'/pages/blog-grid'},
  //     {title:'Blog List',link:'/pages/blog-list'},
  //     {title:'Blog Details',link:'/pages/blog-details'},
  //   ]
  // },
  {
    id:5,
    link:'/pages/contact',
    title:'Contact Us',
  },
]

// mobile menu data
export const mobile_menu:IMobileType[] = [
  {
    id: 1,
    homes: true,
    title: 'Home',
    link: '/home/electronic',
    home_pages: [
      {
        id:1,
        title:'Electronics',
        img:'/assets/img/menu/menu-home-1.jpg',
        link:'/home/electronic'
      },
      {
        id:2,
        title:'Fashion',
        img:'/assets/img/menu/menu-home-2.jpg',
        link:'/home/fashion'
      },
      {
        id:3,
        title:'Beauty',
        img:'/assets/img/menu/menu-home-3.jpg',
        link:'/home/beauty'
      },
      {
        id:4,
        title:'Jewelry',
        img:'/assets/img/menu/menu-home-4.jpg',
        link:'/home/jewelry'
      }
    ]
  },
  {
    id: 2,
    sub_menu: true,
    title: 'Products',
    link: '/shop',
    sub_menus: [
      {title:'Grid Layout',link:'/shop'},
      {title:'Shop Categories',link:'/shop/shop-category'},
      {title:'List Layout',link:'/shop/shop-list'},
      {title:'Full width Layout',link:'/shop/shop-full-width'},
      {title:'1600px Layout',link:'/shop/shop-1600'},
      {title:'Left Sidebar',link:'/shop'},
      {title:'Right Sidebar',link:'/shop/shop-right-sidebar'},
      {title:'Hidden Sidebar',link:'/shop/shop-no-sidebar'},
      {title:'Filter Dropdown',link:'/shop/shop-filter-dropdown'},
      {title:'Filters Offcanvas',link:'/shop/shop-filter-offcanvas'},
      {title:'Load More button',link:'/shop/shop-load-more'},
      {title:'1600px Layout',link:'/shop/shop-1600'},
    ],
  },
  {
    id: 3,
    sub_menu: true,
    title: 'Products Details',
    link: '/shop/shop-details',
    sub_menus: [
      {title:'Product Simple',link:'/shop/shop-details'},
      {title:'With Video',link:'/shop/shop-details-with-video'},
      {title:'With Countdown Timer',link:'/shop/shop-details-with-countdown'},
      {title:'Variations Swatches',link:'/shop/shop-details'},
      {title:'List View',link:'/shop/shop-details-list'},
      {title:'Details Gallery',link:'/shop/shop-details-gallery'}
    ],
  },
  {
    id: 4,
    sub_menu: true,
    title: 'eCommerce',
    link: '/shop/cart',
    sub_menus: [
      {title:'Shopping Cart',link:'/shop/cart'},
      {title:'Track Your Order',link:'/shop/order'},
      {title:'Compare',link:'/shop/compare'},
      {title:'Wishlist',link:'/shop/wishlist'},
      {title:'Checkout',link:'/pages/checkout'},
      {title:'My account',link:'/pages/profile'}
    ],
  },
  {
    id: 5,
    sub_menu: true,
    title: 'More Pages',
    link: '/login',
    sub_menus: [
      {title:'About',link:'/pages/about'},
      {title:'Login',link:'/pages/login'},
      {title:'Register',link:'/pages/register'},
      {title:'Forgot Password',link:'/pages/forgot'},
      {title:'404 Error',link:'/pages/404'}
    ],
  },
  {
    id: 6,
    single_link: true,
    title: 'Coupons & Referral Code',
    link: '/pages/coupons',
  },
  // {
  //   id: 7,
  //   sub_menu: true,
  //   title: 'Blog',
  //   link: '/pages/blog',
  //   sub_menus: [
  //     {title:'Blog Standard',link:'/pages/blog'},
  //     {title:'Blog Grid',link:'/pages/blog-grid'},
  //     {title:'Blog List',link:'/pages/blog-list'},
  //     {title:'Blog Details',link:'/pages/blog-details'}
  //   ]
  // },
  {
    id: 8,
    single_link: true,
    title: 'Contact',
    link: '/pages/contact',
  },
]
