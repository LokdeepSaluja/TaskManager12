import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TaskManagementSystem';
  jwt: string = '';
  isLoggedIn = false;
  constructor(private authService: AuthService, private _route: Router, private _http: HttpClient, private cookieService: CookieService, private toast: ToastrService) { }
  ngOnInit(): void {
    this.jwt = this.cookieService.get('jwt');
    if (!this.jwt) {
      this._route.navigate(['login']);
      return;
    }
    console.log("Printing Token ", this.jwt)
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });


  }
  CallSomeLogic() {
    alert("Hello >  ")
  }
  logout() {
    this._http.post<any>("http://127.0.0.1:8000/logout/", {})
      .subscribe(res => {
        console.log(res)
        this.cookieService.delete('jwt');
        this.authService.setLoggedInStatus(false);
        this._route.navigate(['']);
      }, err => {
        if (err.error && err.error.message) {
          this.toast.error(err.error.message);
        } else {
          this.toast.error("Something went wrong");
        }
      })
  }
}
