import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {path:'', redirectTo:'/recipes', pathMatch:'full'},
  //asagidaki path lazy loading : istedigimiz sayfanin sadece yüklenip calismasini sagliyor.
  // Bunun  icin ayrica app module kisminda RecipeModule 'u sildik ve recipeModelRouting'de
  // ilk path tanimlamasindaki recipes kismini sildik ve burada path tanimlamasi olarak yazdik.
  {path:'recipes', loadChildren:()=> import('./recipes/recipes.module').then(m=>m.RecipesModule)},
  {path:'shopping-list', loadChildren:()=> import('./shopping-list/shopling-list-module').then(m=>m.ShoppingListModule)},
  {path:'auth', loadChildren:()=> import('./auth/auth.module').then(m=>m.AuthModule)}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy:PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
