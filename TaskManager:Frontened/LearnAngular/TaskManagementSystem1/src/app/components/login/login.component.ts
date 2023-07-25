import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: FormGroup | any;
  constructor(private authService: AuthService, private _route: Router, private _http: HttpClient, private toast: ToastrService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.login = new FormGroup({
      'email': new FormControl('', [Validators.required]), // Email validation without starting '@'
      'password': new FormControl('', [Validators.required, Validators.minLength(8)]), // Password validation with minimum 8 characters
    });
    // fname': new FormControl('', Validators.required), // Example of using required validator
    //   'password': new FormControl('', [Validators.required, Validators.minLength(6)]), // Example of using required and minLength validators

  }

  async logindata(login: FormGroup) {
    // this.signuser = this.signup.value.name
    await this._http.post<any>("http://127.0.0.1:8000/login/", this.login.value)
      .subscribe(res => {
        console.log(res)
        if (res.status === 400) {
          this.toast.error(res.message);
        } else {
          this.toast.success(res.message);
          this.login.reset();
          const expires = new Date();
          expires.setMinutes(expires.getMinutes() + 60);
          this.cookieService.set('jwt', res.jwt, expires);
          this.authService.setLoggedInStatus(true);

          this._route.navigate(['home']);
          // const expires = new Date();
          // expires.setHours(expires.getHours() + 1); // 1 hour expiration
          // document.cookie = `jwt=${res.jwt};expires=${expires.toUTCString()};path=/;`;
          // console.log(document.cookie)

        }

      }, err => {
        if (err.error && err.error.message) {
          this.toast.error(err.error.message);
        } else {
          this.toast.error("Something went wrong");
        }
      })
  }
}
