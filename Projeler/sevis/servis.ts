import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {getAccessToken, windowEnabled} from "../../utils/helper";
import {KeycloakService} from "keycloak-angular";
import {Observable} from "rxjs";
import {simInfoModel} from "../../modules/landing/sms/simInfoModel";
import {smsModel} from "../../modules/landing/sms/sms.model";
import { ConfigurationService } from 'app/core/configuration/configuration.service';



@Injectable({
    providedIn: 'root'
})
export class SmsService{


    private base_url:string;
    private sms_url: string;

    headers = new HttpHeaders({'Access-Control-Allow-Origin' : '*'});
    constructor(private httpClient: HttpClient,
                private readonly keycloak:KeycloakService,
                private appConfig: ConfigurationService ) {

        this.base_url = windowEnabled(this.appConfig) + "/sim";
        this.sms_url =  windowEnabled(this.appConfig) + "/sms";
    }

    authHeader  = this.headers.append('Authorization',"Bearer "+ getAccessToken(this.keycloak));



    getSimInfo() {
        return this.httpClient.get<simInfoModel>(`${this.base_url}`+ "/info",{headers:this.authHeader});
    }

    getPin():Observable<string> {
        return this.httpClient.get<string>(`${this.base_url}`+ "/pin",{headers:this.authHeader});
    }

    activatePin(pin: string) {
        return this.httpClient.post(`${this.base_url}`+ "/pin-activate",pin,{headers:this.authHeader});
    }

    activatePuk(puk: string) {
        return this.httpClient.post(`${this.base_url}`+ "/puk-activate",puk,{headers:this.authHeader});
    }

    disableSim() {
        return this.httpClient.post(`${this.base_url}`+ "/disable",{headers:this.authHeader});
    }

    getReceivedSms(): Observable<smsModel[]> {
        return this.httpClient.get<smsModel[]>(`${this.sms_url}`+ "/received",{headers:this.authHeader});
    }
    getSentSms():Observable<smsModel[]> {
        return this.httpClient.get<smsModel[]>(`${this.sms_url}`+ "/sent",{headers:this.authHeader});
    }

    sendSms(sms:smsModel) {
        return this.httpClient.post(`${this.sms_url}`,sms,{responseType: 'text',headers:this.authHeader});
    }

    getPuk(): Observable<string> {
        return this.httpClient.get<string>(`${this.base_url}`+ "/puk",{headers:this.authHeader});
    }
    deleteUsv(id: string): Observable<any> {
        return this.httpClient.delete(`${this.base_url}` + "/"+ id,{headers:this.authHeader});
    }

    putUsv(usvData:usvModel):Observable<usvModel> {

        return this.httpClient.put<usvModel>(`${this.base_url}`,usvData,{headers:this.authHeader});
    }
}
