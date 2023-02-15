import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGruad } from "../auth/auth.guard";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesResolverService } from "./recipes-resolver-service";
import { RecipesComponent } from "./recipes.component";


const routes:Routes = [
    {path:'', component:RecipesComponent, canActivate: [AuthGruad] ,children: [
        {path:'', component:RecipeStartComponent},
        {path:'new', component:RecipeEditComponent}, //burada new endpoint ini yukari aldikk cünkü id ile baslayan endpoint
                                                     //dinamik parametre oldugu icin angular bunu bilemez ve new ile karistirabilir.
                                                     // buradan anlayacagimiz hard kod ile baslayan endpointler dinamik parametreli endpointlerden
                                                     // önce gelmeli.
        {path:':id',component:RecipeDetailComponent, resolve:[RecipesResolverService]},
        {path:':id/edit', component:RecipeEditComponent, resolve:[RecipesResolverService]}
    
      ]},
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class RecipesRoutingModule {

}