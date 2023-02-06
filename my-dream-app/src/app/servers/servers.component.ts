import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent {

  allowNewServer = false;
  serverCreationStatus="No server was created!";
  usernameStatus="No user name"
  serverName="";
  username="";
  serverCreated=false;
  servers = ['Testserver', "Testserver 2"]

  constructor() {
    setTimeout(() =>  {
      this.allowNewServer = true
    },2000);
  }
  ngOnInit() {}

  onCreateServer() {
    this.serverCreated = true;
    this.servers.push(this.serverName)
    this.serverCreationStatus = 'Server was created!' + this.serverName
  }

  onUpdateServerName(event:any){
    this.serverName = (<HTMLInputElement>event.target).value
  }

  onCreateUserName(){
this.usernameStatus= 'User name was created! : ' + this.username
  } 
  onUpdateUserName(event:any) {
    this.username = (<HTMLInputElement>event.target).value;
  }

  showSecret = false;
  logs = []; 
  onToggleDetails() {
    this.showSecret = !this.showSecret;
    this.logs.push(new Date())
  }

}
