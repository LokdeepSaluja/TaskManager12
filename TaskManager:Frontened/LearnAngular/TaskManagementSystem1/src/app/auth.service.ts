import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

    setLoggedInStatus(isLoggedIn: boolean) {
        this.isLoggedInSubject.next(isLoggedIn);
    }
}
