import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private cookieService: CookieService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get the JWT token from the cookie
        const jwtToken = this.cookieService.get('jwt');

        // If the token exists, add it to the request headers
        if (jwtToken) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
        }

        return next.handle(req);
    }
}
