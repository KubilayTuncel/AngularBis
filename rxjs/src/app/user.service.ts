import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable({providedIn:'root'}) //burada injectable icerisine yazdigimiz provider ile app.modelu daki provider e bu service eklememize gerek kalmiyor.
export class UserService {
//activatedEmitter = new EventEmitter<boolean>() eski method yenisinde subject kullaniyoruz.

activatedEmitter = new Subject<boolean>()
}