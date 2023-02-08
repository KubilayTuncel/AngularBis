import { Component } from '@angular/core';
import { AccountsService } from '../accounts.service';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  
})
export class NewAccountComponent {
 
  constructor (private loggingService: LoggingService, private accountsService:AccountsService) {
    this.accountsService.statusUpdated.subscribe((status:string) => alert ('New Status' + status))
  }

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountsService.addAccount(accountName,accountStatus)
    // const service = new LoggingService(); bu iki satiri da yukarida const. icerisinde injection yaptigimiz icin gerek kalmadi.
    // service.logStatusChange(accountStatus)
    //console.log('A server status changed, new status: ' + accountStatus); //bu kodu yukaridi sekilde yazdik
    // this.loggingService.logStatusChange(accountStatus) //bu kodu da yoruma aldik cünkü accounts.service üzerinde ulasacagiz.

  }
}
