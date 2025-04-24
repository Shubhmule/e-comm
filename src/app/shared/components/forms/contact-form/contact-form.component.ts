import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '@/shared/services/contact.service';
import { IContact } from '@/types/product-type';
import { ToastrService } from 'ngx-toastr';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noMultipleSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.trim();
    if (!value || value.length === 0) {
      return { noSpaces: true };
    }
    if (/\s{2,}/.test(control.value)) {
      return { noMultipleSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent {
  public contactForm!: FormGroup;
  public formSubmitted = false;

  contact!: IContact;

  constructor(private toastrService: ToastrService, private contactService: ContactService) {}

  ngOnInit() {
    this.contactForm = new FormGroup({
      name: new FormControl(null, [Validators.required, noMultipleSpacesValidator()]),
      email: new FormControl(null, [Validators.required, Validators.email, noMultipleSpacesValidator()]),
      subject: new FormControl(null, [Validators.required, noMultipleSpacesValidator()]),
      message: new FormControl(null, [Validators.required, noMultipleSpacesValidator()]),
      saveForLater: new FormControl(0),
    });
  }

  get name() {
    return this.contactForm.get('name');
  }
  get email() {
    return this.contactForm.get('email');
  }
  get subject() {
    return this.contactForm.get('subject');
  }
  get message() {
    return this.contactForm.get('message');
  }

  addContactMessage() {
    this.formSubmitted = true;
    if (this.contactForm.valid) {

      this.contact = {
        fullName: this.contactForm.value.name,
        email: this.contactForm.value.email,
        mobileNo: '',
        subject: this.contactForm.value.subject,
        message: this.contactForm.value.message,
        saveForLater: this.contactForm.value.saveForLater,
      };

      this.contactService.addContactMessage(this.contact).subscribe({
        next: (response) => {
          console.log(response);
          this.toastrService.success(`Message sent successfully!`);
        },
        error: (error) => {
          return this.toastrService.error(error.error.errorMessage);
        },
      });
      this.contactForm.reset();
      this.formSubmitted = false;
    }
  }
}
