import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router, private authService:AuthService) { }

  ngOnInit() {
  }

  onLoadServer(id:number) {
    //complex calculation
    this.router.navigate(['/servers',id,'edit'], {queryParams:{allowEdit:'1'}, fragment:'loading'}) //burada home de olusturmus oldugumuz load server butonunda calistirdigimiz method 
                                        //router in navigate methodu sayesinde yönlendirme yapmamiza izin veriyor.
  }

  onLogin() {
    this.authService.login()
  }

  onLogout() {
    this.authService.logout()
  }
}
