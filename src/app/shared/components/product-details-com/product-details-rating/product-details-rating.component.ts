import { ProductService } from '@/shared/services/product.service';
import { NgFor } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details-rating',
  standalone: true,
  imports: [FormsModule,NgFor],
  templateUrl: './product-details-rating.component.html',
  styleUrl: './product-details-rating.component.scss'
})
export class ProductDetailsRatingComponent {

  rating: number = 0;
  reviewText: any = "";
  stars: number[] = [1, 2, 3, 4, 5];
  @Input() productD:any={}
  message:any;
  @ViewChild('reviewModalClose') reviewModalClose!: ElementRef;

  constructor(private productService: ProductService,private toastrService: ToastrService)
  {
  }

  // Set rating when user clicks a star
  setRating(value: number) {
    this.rating = value;
  }

  // Submit the review
  submitReview() {
    if (this.rating === 0 || !this.reviewText.trim()) {
      alert("Please give a rating and write a review.");
      return;
    }
    this.productService.setReview(this.productD.product_id,this.rating).subscribe((res: any) => {
      
    });
    this.toastrService.success("Rating submitted successfully");
   
    // Reset form
    this.rating = 0;
    this.reviewText = "";

    // Close modal
    this.reviewModalClose.nativeElement.click();
    
  }

}
