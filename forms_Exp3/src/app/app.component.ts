import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ProjectStatus = ['Stable','Critical','Finished']
  ForbiddenProjectnames = ['Test','test']

  projectStatus:FormGroup

  ngOnInit(): void {
    this.projectStatus = new FormGroup ({
      'projectname': new FormControl(null,[Validators.required, Validators.pattern('[a-zA-Z]'),
        this.forbiddenProjectName.bind(this)
    ,this.asyncInvalidProjectName]),
      // projectname kissminda Validators.required yazmadigim icin this.forbiddenProjectName kisminda hata aliyordum. Bunu yazinca gitti.
      // Önemli bir nokta
      'email' : new FormControl(null, [Validators.required, Validators.email]),
      'status': new FormControl('Critical')
    })

  }

  forbiddenProjectName(control:FormControl): {[s:string]:boolean} {
    if(this.ForbiddenProjectnames.indexOf(control.value) !== -1){
      return {'projectNameForbidden':true};
    }else {
      return null;
    }
  }

  asyncInvalidProjectName(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise ((resolve, reject)=>{
        setTimeout((()=>{
            if(control.value === 'Test') {
                resolve({'projectNameForbidden':true})
            }else{
                resolve(null)
            }
        }),2000)
    })
    return promise;
}

  onSaveProject() {
    console.log(this.projectStatus.value);

  }
}
