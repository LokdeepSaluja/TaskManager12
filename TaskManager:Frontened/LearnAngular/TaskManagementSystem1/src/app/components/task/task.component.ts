import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  taskid: any;
  responseData: any;
  comment: any;
  user_name: any;
  taskassign: any;
  delete_comment_id: any;
  user_id: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private _route: Router,
    private _http: HttpClient,
    private toast: ToastrService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.taskid = this.route.snapshot.params['taskid'];
    this.delete_comment_id = '';
    console.log("taskid : ", this.taskid);
    this.fetchTaskData();
    this.comment = new FormGroup({
      'description': new FormControl('', [Validators.required]),
      'token': new FormControl('', Validators.required),
    });
    this.taskassign = new FormGroup({
      'email': new FormControl('', [Validators.required]),
      'token': new FormControl('', Validators.required),
    });
  }

  async fetchTaskData() {
    try {
      const jwt = this.cookieService.get('jwt');
      console.log(jwt);
      if (!jwt) {
        this.authService.setLoggedInStatus(false);
        this._route.navigate(['login']);
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${jwt}`
      });

      const res = await this._http.get<any>(`http://127.0.0.1:8000/task${this.taskid}`, { headers }).toPromise();
      console.log("Before Printing", res);
      this.responseData = res;


      console.log(this.responseData);

      this.authService.setLoggedInStatus(true);
      this.user_id = this.responseData.user_id;
      console.log(res);
      if (this.responseData.status == 400) {
        this.authService.setLoggedInStatus(false);
        this._route.navigate(['login']);
      }

    } catch (err: any) {
      if (err.error && err.error.message) {
        this.toast.error(err.error.message);
        this.authService.setLoggedInStatus(false);
      } else {
        this.toast.error("Something went wrong");
        this.authService.setLoggedInStatus(false);
      }
    }
  }

  async addComment(comment: FormGroup) {
    try {
      const jwt = this.cookieService.get('jwt');
      console.log(jwt);
      if (!jwt) {
        this.authService.setLoggedInStatus(false);
        this._route.navigate(['login']);
        return;
      }

      this.comment.patchValue({ token: jwt });

      const res = await this._http.post<any>(`http://127.0.0.1:8000/task${this.taskid}/add-comment`, this.comment.value).toPromise();
      console.log(res);

      if (res.status === 400) {
        this.toast.error(res.message);
      } else {
        this.toast.success(res.message);
        this.comment.reset();
      }

      await this.fetchTaskData();

      const modalElement = document.getElementById('exampleModal');
      if (modalElement) {
        // Use Angular's ElementRef and ViewChild to access the modal
        modalElement.classList.remove('show');
        document.querySelector('.modal-backdrop')?.remove(); // Remove the backdrop element if it exists
      }

      this._route.navigate(['task', this.taskid]);
    } catch (err: any) {
      if (err.error && err.error.message) {
        this.toast.error(err.error.message);
        this.authService.setLoggedInStatus(false);
      } else {
        this.toast.error("Something went wrong");
        this.authService.setLoggedInStatus(false);
      }
    }
  }

  async assignTask(taskassign: FormGroup) {
    try {
      const jwt = this.cookieService.get('jwt');
      console.log(jwt);
      if (!jwt) {
        this.authService.setLoggedInStatus(false);
        this._route.navigate(['login']);
        return;
      }

      this.taskassign.patchValue({ token: jwt });

      const res = await this._http.put<any>(`http://127.0.0.1:8000/assign-user/${this.taskid}`, this.taskassign.value).toPromise();
      console.log(res);

      if (res.status === 400) {
        this.toast.error(res.message);
      } else {
        this.toast.success(res.message);
      }

      await this.fetchTaskData();

      const modalElement = document.getElementById('exampleModal1');
      if (modalElement) {
        // Use Angular's ElementRef and ViewChild to access the modal
        modalElement.classList.remove('show');
        document.querySelector('.modal-backdrop')?.remove(); // Remove the backdrop element if it exists
      }

      this._route.navigate(['task', this.taskid]);
    } catch (err: any) {
      if (err.error && err.error.message) {
        this.toast.error(err.error.message);
        this.authService.setLoggedInStatus(false);
      } else {
        this.toast.error("Something went wrong");
        this.authService.setLoggedInStatus(false);
      }
    }
  }

  async deleteComment(delete_comment_id: any) {
    // try {
    const jwt = this.cookieService.get('jwt');

    console.log(jwt);
    if (!jwt) {
      this.authService.setLoggedInStatus(false);
      this._route.navigate(['login']);
      return;
    }
    console.log("Printing Token from Delete Comment", jwt)
    console.log(delete_comment_id)
    // this.delete_comment_id.append({ token: jwt });

    console.log(delete_comment_id);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwt}`
    });

    const res = await this._http.delete<any>(`http://127.0.0.1:8000/delete-comment/${delete_comment_id}`, { headers }).toPromise();


    console.log(res);



    if (res.status === 400) {
      this.toast.error(res.message);
    } else {
      this.toast.success(res.message);
      this.comment.reset();
    }

    await this.fetchTaskData();

    //   const modalElement = document.getElementById('exampleModal');
    //   if (modalElement) {
    //     // Use Angular's ElementRef and ViewChild to access the modal
    //     modalElement.classList.remove('show');
    //     document.querySelector('.modal-backdrop')?.remove(); // Remove the backdrop element if it exists
    //   }

    this._route.navigate(['task', this.taskid]);
  } catch(err: any) {
    if (err.error && err.error.message) {
      this.toast.error(err.error.message);
      this.authService.setLoggedInStatus(false);
    } else {
      this.toast.error("Something went wrong");
      this.authService.setLoggedInStatus(false);
    }
  }

  async changeStatus(tasksid: any) {
    try {
      const jwt = this.cookieService.get('jwt');
      console.log(jwt);
      if (!jwt) {
        this.authService.setLoggedInStatus(false);
        this._route.navigate(['login']);
        return;
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${jwt}`);
      // Set other headers if needed, e.g., Content-Type

      const res = await this._http.put<any>(`http://127.0.0.1:8000/change-status/${this.taskid}`, { headers }).toPromise();
      console.log(res);



      if (res.status === 400) {
        this.toast.error(res.message);
      } else {
        this.toast.success(res.message);
        this.comment.reset();
      }

      await this.fetchTaskData();

      // const modalElement = document.getElementById('exampleModal1');
      // if (modalElement) {
      //   // Use Angular's ElementRef and ViewChild to access the modal
      //   modalElement.classList.remove('show');
      //   document.querySelector('.modal-backdrop')?.remove(); // Remove the backdrop element if it exists
      // }

      this._route.navigate(['task', this.taskid]);
    } catch (err: any) {
      if (err.error && err.error.message) {
        this.toast.error(err.error.message);
        this.authService.setLoggedInStatus(false);
      } else {
        this.toast.error("Something went wrong");
        this.authService.setLoggedInStatus(false);
      }
    }
  }

  async deleteTask(tasksid: any) {
    try {
      const jwt = this.cookieService.get('jwt');
      console.log(jwt);
      if (!jwt) {
        this.authService.setLoggedInStatus(false);
        this._route.navigate(['login']);
        return;
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${jwt}`);
      // Set other headers if needed, e.g., Content-Type

      const res = await this._http.delete<any>(`http://127.0.0.1:8000/delete-task/${this.taskid}`, { headers }).toPromise();
      console.log(res);



      if (res.status === 400) {
        this.toast.error(res.message);
      } else {
        this.toast.success(res.message);
        this.comment.reset();
      }

      // await this.fetchTaskData();

      // const modalElement = document.getElementById('exampleModal1');
      // if (modalElement) {
      //   // Use Angular's ElementRef and ViewChild to access the modal
      //   modalElement.classList.remove('show');
      //   document.querySelector('.modal-backdrop')?.remove(); // Remove the backdrop element if it exists
      // }

      this._route.navigate(['home']);
    } catch (err: any) {
      if (err.error && err.error.message) {
        this.toast.error(err.error.message);
        this.authService.setLoggedInStatus(false);
      } else {
        this.toast.error("Something went wrong");
        this.authService.setLoggedInStatus(false);
      }
    }
  }
}

