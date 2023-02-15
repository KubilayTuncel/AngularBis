import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStrogeService } from '../shared/data-storege-Service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  private userSub : Subscription
  isAuthenticated = false

  constructor(private dataStorageSer : DataStrogeService,
              private authService:AuthService) {

  }
  ngOnDestroy(): void {
    this.authService.user.unsubscribe()
  }
    
  ngOnInit(): void {
    this.authService.user.subscribe(user=>{
      this.isAuthenticated = !!user //!user ? false : true yandaki aynisi

    })
  }

  onSaveData() {
    this.dataStorageSer.storeRecipes()
  }
  onFetchData() {
    this.dataStorageSer.fetchRecipes().subscribe()
    console.log('onFetch data calisti');
    
  }

  onLogout() {
    this.authService.logout()
  }

  // bu kisimlari router olusturdugumuz icin yoruma aldik
//  @Output() featureSelected = new EventEmitter<string>();

//   onSelect(feature:string){
//     this.featureSelected.emit(feature)
//   }
}
