import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/auth/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {

  isShowPass = false;
  successResponse: any;

  handleShowPass () {
    this.isShowPass = !this.isShowPass;
  }

  public registerForm!: FormGroup;
  public formSubmitted = false;

  constructor(private toastrService: ToastrService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit () {
    this.registerForm = new FormGroup({
      firstName:new FormControl(null,[Validators.required,Validators.minLength(3),Validators.maxLength(12),Validators.pattern("^[a-zA-Z\\s]*")]),
      middleName:new FormControl(null,[Validators.pattern("^[a-zA-Z\\s]*"),Validators.maxLength(12),]),
      lastName:new FormControl(null,[Validators.required,Validators.pattern("^[a-zA-Z\\s]*"),Validators.maxLength(12)]),
      email:new FormControl(null,[Validators.required,Validators.email,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$")]),
      mobNo:new FormControl(null,[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("[0-9]{10}")]),
      referralCode:new FormControl(null,[Validators.minLength(6),Validators.maxLength(6),]),
    })
  }

  onSubmit() {
    // this.formSubmitted = true;
    const payload = {
      'firstName': this.registerForm.controls['firstName'].value,
      'middleName': this.registerForm.controls['middleName'].value,
      'lastName': this.registerForm.controls['lastName'].value,
      'email': this.registerForm.controls['email'].value,
      'mobNo': this.registerForm.controls['mobNo'].value,
      'referralCode': this.registerForm.controls['referralCode'].value
     }

    if (this.registerForm.valid) {
      this.authenticationService.createUser(payload).subscribe(
        (response) => {
          this.successResponse = response;
            console.log('response', response);
            if(this.successResponse.message=="User registered successfully!")
            {
              this.toastrService.success(`User registered successfully`);
              this.router.navigate(['/pages/login']);
            }
            else{
              this.toastrService.error(`Phone number / Email is already registered!`);
              this.registerForm.reset();
            }
        },
        (error) => {
          console.log('error', error);
          this.toastrService.error(error);
          this.registerForm.reset();
          this.formSubmitted = false;
    });
       
    }
  }

  get firstName() { return this.registerForm.get('firstName') }
  get middleName() { return this.registerForm.get('middleName') }
  get lastName() { return this.registerForm.get('lastName') }
  get email() { return this.registerForm.get('email') }
  get mobNo() { return this.registerForm.get('mobNo') }
  get referralCode() { return this.registerForm.get('referralCode') }
}
