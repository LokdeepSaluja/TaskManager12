import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  responseData: any;
  task: any;
  taskid: any;
  constructor(private authService: AuthService, private _route: Router, private _http: HttpClient, private toast: ToastrService, private cookieService: CookieService) { }

  ngOnInit(): void {
    const jwt = this.cookieService.get('jwt');
    console.log(jwt)
    if (!jwt) {
      this.authService.setLoggedInStatus(false);
      this._route.navigate(['login']);
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwt}`
    });
    // Get the value of the 'myCookie' cookie
    //this.responseData = this.cookieService.get('jwt');
    // const jwt = this.cookieService.get('jwt');
    // You can now use this.responseData as needed
    this._http.get<any>("http://127.0.0.1:8000/", { headers: headers })
      .subscribe(res => {
        this.responseData = res;
        this.authService.setLoggedInStatus(true);
        console.log(res)
      }, err => {
        if (err.error && err.error.message) {
          this.toast.error(err.error.message);
        } else {
          this.toast.error("Something went wrong");
        }
      })

    this.task = new FormGroup({
      'title': new FormControl('', Validators.required), // Example of using required validator
      'description': new FormControl('', [Validators.required]), // Example of using required and minLength validators
      'token': new FormControl('', Validators.required),
    })


  }
  addTask(task: FormGroup) {
    // this.signuser = this.signup.value.name
    const jwt = this.cookieService.get('jwt');
    console.log(jwt)
    if (!jwt) {
      this.authService.setLoggedInStatus(false);
      this._route.navigate(['login']);
      return;
    }
    this.task.patchValue({ token: jwt });
    this._http.post<any>("http://127.0.0.1:8000/add-task/", this.task.value)
      .subscribe(res => {
        console.log(res)
        if (res.status === 400) {
          this.toast.error(res.message);
        } else {
          this.toast.success(res.message);
          this.task.reset();
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${jwt}`
          });
          // Get the value of the 'myCookie' cookie
          //this.responseData = this.cookieService.get('jwt');
          // const jwt = this.cookieService.get('jwt');
          // You can now use this.responseData as needed
          this._http.get<any>("http://127.0.0.1:8000/", { headers: headers })
            .subscribe(res => {
              this.responseData = res;
              this.authService.setLoggedInStatus(true);
              console.log(res)
            }, err => {
              if (err.error && err.error.message) {
                this.toast.error(err.error.message);
              } else {
                this.toast.error("Something went wrong");
              }
            })
          const modalElement = document.getElementById('exampleModal');
          if (modalElement) {
            // Use Angular's ElementRef and ViewChild to access the modal
            modalElement.classList.remove('show');
            document.querySelector('.modal-backdrop')?.remove(); // Remove the backdrop element if it exists
          }

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

  taskget(taskid: any) {
    console.log(taskid);
    const navigationExtras: NavigationExtras = {
      state: {
        taskid: taskid
      }
    };
    this._route.navigate(['task', taskid]);

  }

  deleteUser() {
    const jwt = this.cookieService.get('jwt');
    console.log(jwt)
    if (!jwt) {
      this.authService.setLoggedInStatus(false);
      this._route.navigate(['login']);
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwt}`
    });
    this._http.delete<any>("http://127.0.0.1:8000/delete-user", { headers: headers })
      .subscribe(res => {
        this.responseData = res;
        this.authService.setLoggedInStatus(false);
        console.log(res)
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