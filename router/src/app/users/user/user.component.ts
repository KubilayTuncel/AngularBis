import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  user: {id: number, name: string};
  paramsSubscription : Subscription

  constructor(private route:ActivatedRoute) { }
  ngOnDestroy(): void {
   this.paramsSubscription.unsubscribe()
  }

  ngOnInit() {
    this.user = {
      id:this.route.snapshot.params['id'],
      name: this.route.snapshot.params['name']
    }
    // alt taraftaki kod Observable class i sayesinde page uzantisini dinamik olarak degistirirken
    // aalt taraafta yüklenmesi gerek bilgilerinde dinamik bir sekilde güncellenmesini sagliyor.
    this.paramsSubscription = this.route.params.subscribe(
      (params:Params)=> {
        this.user.id = params['id']
        this.user.name = params['name']
      }
    )
  }

}
