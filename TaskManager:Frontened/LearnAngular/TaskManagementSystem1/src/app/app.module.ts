import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './components/home/home.component';
import { AuthInterceptor } from './auth.interceptor';

import { CookieService } from 'ngx-cookie-service';
import { TaskComponent } from './components/task/task.component';
import { AboutComponent } from './components/about/about.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    HomeComponent,
    TaskComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FlexLayoutModule,
  ],
  providers: [
    CookieService,
    // Add the AuthInterceptor to the providers
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
