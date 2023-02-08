import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'directives';
  numbers = [1, 2, 3, 4, 5]
  //oddNumbers: number[] = [];
 //clickStatus =true
 onlyOdd=false
 oddNumbers=[2,4]
 evenNumbers=[1,3,5]
 value=10

 
  

  
  // showOdd() {
  //     this.oddNumbers = new Array
  //    if(this.clickStatus==true) {
  //     this.numbers.filter(n=>n%2==0).map(n=>this.oddNumbers.push(n))
  //     this.clickStatus=false

  //    }else{
  //     this.numbers.filter(n=>n%2!=0).map(n=>this.oddNumbers.push(n))
  //    }
    
  //   }



 
}
