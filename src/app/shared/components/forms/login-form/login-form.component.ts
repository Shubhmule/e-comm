import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/auth/auth-service';
import { first } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  isShowPass = false;
  signinButton: boolean = true;
  showOtp: boolean = false;
  isReadOnly: Boolean = false;
  showTimer: boolean = false;
  successResponse: any;
  showOtpSection: boolean = false;
  otpValues: string[] = ['', '', '', '', '', ''];
  data: any;

  handleShowPass() {
    this.isShowPass = !this.isShowPass;
  }

  @ViewChild('otpInput1') otpInput1: ElementRef | undefined;
  @ViewChild('otpInput2') otpInput2: ElementRef | undefined;
  @ViewChild('otpInput3') otpInput3: ElementRef | undefined;
  @ViewChild('otpInput4') otpInput4: ElementRef | undefined;
  @ViewChild('otpInput5') otpInput5: ElementRef | undefined;
  @ViewChild('otpInput6') otpInput6: ElementRef | undefined;

  public loginForm!: FormGroup;
  public formSubmitted = false;

  constructor(
    private toastrService: ToastrService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  focusOnInput(index: number) {
    switch (index) {
      case 0:
        this.otpInput1?.nativeElement.focus();
        break;
      case 1:
        this.otpInput2?.nativeElement.focus();
        break;
      case 2:
        this.otpInput3?.nativeElement.focus();
        break;
      case 3:
        this.otpInput4?.nativeElement.focus();
        break;
    }
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      userName: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
      ]),
      // password:new FormControl(null,[Validators.required,Validators.minLength(6)]),
      otp: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern('[0-9]{6}'),
      ]),
      rememberMe: new FormControl(false),
    });
  }

  onOtpSent() {
    debugger;
    if (this.loginForm.controls['userName'].valid) {
      this.authenticationService
        .sentOtp(this.loginForm.controls['userName'].value)
        .subscribe(
          (data) => {
            this.successResponse = data;
            if (this.successResponse.message) {
              this.showOtpSection = true;
              this.timer();
              this.toastrService.success(this.successResponse.message);
            }
          },
          (error) => {
            // console.log('error', error);
            this.toastrService.error(error.error.message);
            // this.formSubmitted = false;
          }
        );
    }
  }

  onBackspace(event: KeyboardEvent, index: number) {
    // If Backspace is pressed
    if (event.key === 'Backspace') {
      if (this.otpValues[index] === '') {
        // If the current input is empty, move focus to the previous input
        if (index > 0) {
          this.focusOnInput(index - 1); // Move focus to the previous input
        }
      } else {
        // If the current input has a value, do nothing, just allow Backspace
        // The user can delete the value in the current field.
        this.otpValues[index] = ''; // Clear the OTP value
      }
    }
  }

  myInterval: any;
  myTime = 0;
  sendotpbutton: boolean = false;
  // showtimer:boolean = false;

  timer() {
    this.sendotpbutton = true;
    this.showTimer = true;
    this.isReadOnly = true;
    this.myTime = 60;
    this.myInterval = setInterval(() => {
      if (this.myTime > 0) {
        this.myTime = this.myTime - 1;
        if (this.myTime == 0) {
          this.showTimer = false;
          this.sendotpbutton = false;
          this.isReadOnly = false;
        }
      } else {
        clearInterval(this.myInterval);
      }
    }, 1000);
  }

  onOtpInput(event: any, index: number) {
    const inputValue = event.data;
    if (inputValue && inputValue.length === 1) {
      this.otpValues[index] = inputValue; // Update the corresponding otp value

      // Move to the next input if it's not the last one
      if (index < this.otpValues.length - 1) {
        this.focusOnInput(index + 1); // Focus the next input field
      }
    }
  }

  onSubmit() {
    const otp = this.otpValues.join('');

    this.authenticationService
      .login(this.loginForm.controls['userName'].value, parseInt(otp))
      .pipe(first())
      .subscribe(
        (response) => {
          this.data = response;

          if (this.data.roleId && this.data.message == 'Login Successful') {
            this.toastrService.success(this.data.message);
             this.loginForm.reset();
            this.router.navigate(['/home/electronic']);
          } else if (this.data.message == 'Invalid Otp') {
            this.toastrService.error('Enter valid Otp');
          }else{
          
            this.toastrService.error(this.data.message)
          }
        },
        (error) => {
          this.toastrService.error(error);
        }
      );
  }

  get userName() {
    return this.loginForm.get('userName');
  }
  get otp() {
    return this.loginForm.get('otp');
  }
}
