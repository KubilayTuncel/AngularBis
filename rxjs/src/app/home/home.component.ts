import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import {map, filter} from 'rxjs/operators'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private firstObsSubscription: Subscription

  constructor() { }
  ngOnDestroy(): void {
    this.firstObsSubscription.unsubscribe()
  }

  ngOnInit() {

    // this.firstObsSubscription = interval(1000).subscribe(count=>{
    //   console.log(count)
    // })

    const customIntervalObservable = Observable.create((observer:any)=>{
      let count = 0
      setInterval(()=>{
        observer.next(count)
        if(count===5) {
          observer.complete()
        }
        if(count>3) {
          observer.error(new Error('Counter greater then 3!'));
          
        }
        count++;
      },1000)
    })

    
   this.firstObsSubscription = customIntervalObservable.pipe(filter(data=>{
    return data>0
   }),map((data:number)=>{
    return 'Round : ' +(data+1)
  })).subscribe((data: any)=>{
      console.log(data)
    }, (error: { message: any; })=>{ console.log(error); alert(error.message)}, 
    ()=>{
      console.log('Completed!')
    }
    )
  }

}
