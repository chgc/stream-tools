import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('https://www.googleapis.com/youtube')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.accessToken$.value}`
        }
      });
    } else {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.idToken}`
        }
      });
    }
    return next.handle(request);
  }
}
