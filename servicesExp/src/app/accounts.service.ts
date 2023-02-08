import { EventEmitter, Injectable } from "@angular/core";
import { LoggingService } from "./logging.service";

@Injectable() //biz iki farkli service birbiri icerisinde cagirdigimiz icin injactable anatation ekledik.
export class AccountsService {
    accounts = [
        {
          name: 'Master Account',
          status: 'active'
        },
        {
          name: 'Testaccount',
          status: 'inactive'
        },
        {
          name: 'Hidden Account',
          status: 'unknown'
        }
      ];
      
      statusUpdated = new EventEmitter<string>()

      constructor(private loggingSevice: LoggingService) {}

      addAccount(name:string,status:string) {
        this.accounts.push({name:name, status:status})
        this.loggingSevice.logStatusChange(status)
      }

      updateStatus(id:number, status:string) {
        this.accounts[id].status = status
        this.loggingSevice.logStatusChange(status)
        }
}