import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'type';

}
let name2: string= 'kubilay tuncel   ';
console.log("before funciton : " + name2.length);
let nameReverse;
nameReverse= Reverse(name2);
console.log(nameReverse)
name2=againOriginal(nameReverse);
console.log(name2)
console.log(name2.length)
// @ts-ignore
function Reverse(name: String) {
  let nameReverse: string = '';
  if (name.endsWith(' ')) {
    let i
    let c
    let count = 0;
    for (i = name.length - 1; i >= 0; i--) {
      c = name.charAt(i);
      nameReverse += c;
      if (c == ' ') {
        count++;
      }
    }
    nameReverse = nameReverse.substring(count-1);
    return nameReverse;
  }

}
// @ts-ignore
function againOriginal(name: String) {
  let nameReverse: string = '';
    let i
    let c
    for (i = name.length - 1; i >= 0; i--) {
      c = name.charAt(i);
      nameReverse += c;
    }
    return nameReverse;

}
