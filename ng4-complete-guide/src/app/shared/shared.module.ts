import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinner } from "./loading-spinner/loading-spinner.component";
import { PlaceHolderDirective } from "./placeholder/placeholder";

@NgModule({
    declarations:[
        AlertComponent,
        LoadingSpinner,
        PlaceHolderDirective,
        DropdownDirective
    ],
    imports:[
        CommonModule
    ],
    exports:[
        AlertComponent,
        LoadingSpinner,
        PlaceHolderDirective,
        DropdownDirective,
        CommonModule
    ],
    entryComponents: [
        AlertComponent
      ]
})
export class SharedModule {}