import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        (req.url)
        console.log('request is on its way');
        const modifiedRequest = req.clone({headers:req.headers.append('Auth','xyz')}) // burada headers a ekleme yapabiliyoruz.

        return next.handle(modifiedRequest).pipe(tap(
            event=>{
                if(event.type === HttpEventType.Response) {
                    console.log(event.body);
                    
                }
            }
        ));
        
    }
    
}