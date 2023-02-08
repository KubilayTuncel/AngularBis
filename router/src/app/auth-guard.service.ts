import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth-service";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild{

    constructor(private authService:AuthService,
                private router:Router) {}


    canActivate (route:ActivatedRouteSnapshot,
                 state:RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
           return this.authService.isAuthenticated().then(
                (authenticated: any) => {
                    console.log('auth-guard authentucated? ' + authenticated);
                    if (authenticated) {
                        return true;
                    } else {
                        this.router.navigate(['/']);
                        return false;
                    }
                }
            );
        }

        canActivateChild(childRoute: ActivatedRouteSnapshot, // bu child ile sayfanin kendisi degil alt parametreleri icin gecerli hale getirdik.
            state: RouterStateSnapshot):  Observable<boolean> | Promise<boolean> | boolean {
            return this.canActivate(childRoute,state)
        }
    
}