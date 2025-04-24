import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShopComponent } from './shop/pages/shop/shop.component';
import { ShopModule } from './shop/shop.module';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtInterceptor } from './auth/jwt-interceptor';
import { ProductByProductTypeComponent } from './shop/pages/product-by-product-type/product-by-product-type.component';
import { ProductByCategoryComponent } from './shop/pages/product-by-category/product-by-category.component';
import { ProductByBrandComponent } from './shop/pages/product-by-brand/product-by-brand.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    ShopComponent,
    ProductByProductTypeComponent,
    ProductByCategoryComponent,
    ProductByBrandComponent,
  ],
  imports: [
    SharedModule,
    ShopModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: false,
      enableHtml: true,
      positionClass:'toast-top-center'
    }),
    FormsModule  
  ],
  exports:[
    ShopComponent,
    ProductByProductTypeComponent,
    ProductByCategoryComponent,
    ProductByBrandComponent,
  ],
  providers: [provideHttpClient(withInterceptors([JwtInterceptor])),],
  bootstrap: [AppComponent]
})
export class AppModule {}
