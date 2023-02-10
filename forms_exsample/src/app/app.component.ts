import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  [x: string]: any;

  @ViewChild('f') singupForm:NgForm
  email=''
  password=''
  subscriptions=['Basic','Advanced','Pro']
  genders=['male','female']
  singupForm2:FormGroup
  forbidenUsernames = ['Chris','Anna']

  defaultSelect='Advanced'

  onSubmit() {
    console.log(this.singupForm.value)
  }

  ngOnInit() {
    this.singupForm2 = new FormGroup({
      'userData' : new FormGroup({
        'username' : new FormControl(null,[Validators.required, this.forbiddenNames.bind(this)]),
        'email' : new FormControl(null,[Validators.required, Validators.email, this.forbiddenEmails]),
        'age' : new FormControl(null,[Validators.required, Validators.min(1), Validators.max(100)])
      }),
      'gender' : new FormControl('male'),
      'hobbies': new FormArray([])
    });
    this.singupForm2.valueChanges.subscribe(
      (value) =>{
        console.log(value)
      }
    );
    this.singupForm2.statusChanges.subscribe(
      (value) =>{
        console.log(value)
      }
    );

    this.singupForm2.setValue({
      'userData':{
        'username':'dad',
        'email':'dasd@dsada.com',
        'age':50
      },
      'gender':'male'
    });

    this.singupForm2.patchValue({
      'userData':{
        'username':'dasdad'
      }
    })
  }

  onSubmit2() {
    console.log(this.singupForm2.value)
  }

  onAddHobby() {

    const control = new FormControl(null, Validators.required);

    (<FormArray> this.singupForm2.get('hobbies')).push(control);
  }

  getControls() {
    return (<FormArray>this.singupForm2.get('hobbies')).controls;
  }

  forbiddenNames(control:FormControl): {[s:string]:boolean} { // Buradaki method 29 satirda cagriliyor.
    if(this.forbidenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden':true}
    }
    return null;
  }

  forbiddenEmails(control:FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject)=>{
      setTimeout(()=>{
        if(control.value === 'test@test.com') {
          resolve({'emailIsForbidden':true})
        }else {
          resolve(null)
        }
      },1500)
    })
    return promise
  }

}
