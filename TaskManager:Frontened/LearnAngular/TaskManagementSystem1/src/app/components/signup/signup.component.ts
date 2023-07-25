import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export function noNumberssplCharValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {

    const nameRegex1 = /^[a-zA-Z0-9]*$/;

    if (!nameRegex1.test(control.value)) {
      return { specialCharacters: true, message: 'Name cannot contain special characters' };
    }
    else {
      const nameRegex = /^[a-zA-Z]*$/;

      if (!nameRegex.test(control.value)) {
        console.log("how come")
        return { containsNumbers: true, message: 'Name should not contain numbers' };
      }

      return null;
    }

  };
}

// export function noSpecialCharactersValidator(): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     const nameRegex = /^[a-zA-Z0-9]*$/;

//     if (!nameRegex.test(control.value)) {
//       return { specialCharacters: true, message: 'Name cannot contain special characters' };
//     }

//     return null;
//   };
// }




export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;

    if (!passwordRegex.test(control.value)) {
      return { invalidPassword: true, message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' };
    }

    return null;
  };
}


export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const email = control.value;
    if (email && !isNaN(+email[0])) {
      console.log(email[0], !isNaN(+email[0]), typeof (email[0]))
      return { startsWithNumber: true, message: 'Email should not start with a number' };
    }
    return null;
  };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signup!: FormGroup;
  signuser: any;
  constructor(private _route: Router, private _http: HttpClient, private _toast: ToastrService) { }

  ngOnInit(): void {
    this.signup = new FormGroup({
      // 'fname': new FormControl(),
      'name': new FormControl('', [Validators.required,]),
      'email': new FormControl('', [Validators.required, Validators.email, emailValidator()]), // Example of using multiple validators
      'password': new FormControl('', [Validators.required, Validators.minLength(8), passwordValidator()]),
    })
  }
  signupdata(signup: FormGroup) {
    // console.log(this.signup.value)
    if (this.signup.valid) {
      this.signuser = this.signup.value.name
      this._http.post<any>("http://127.0.0.1:8000/signup/", this.signup.value)
        .subscribe(res => {

          this._toast.success(res.name, "You have successfully signup");
          this.signup.reset();
          this._route.navigate(['login']);
        }, err => {
          alert("Something went wrong")

        })
    } else {
      Object.keys(this.signup.controls).forEach(field => {
        const control = this.signup.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }


}
