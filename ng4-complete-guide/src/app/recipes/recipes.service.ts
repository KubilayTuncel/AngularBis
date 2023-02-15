import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  //recipeSelected = new EventEmitter<Recipe>()
  recipeSelected = new Subject<Recipe>()
  recipesChanged = new Subject<Recipe[]>()

  // private recipes:Recipe[] = [
  //   new Recipe('Rice top on the Beef Recipe','This is simply a test',
  //   'https://i20.haber7.net/resize/1300x731/haber/haber7/photos/2019/16/sunumu_sik_olan_pratik_ana_yemek_tarifleri_1555673831_6061.jpg',
  //   [
  //     new Ingredient('Meat',1),
  //     new Ingredient('Rice',1)
  //   ]),
  //   new Recipe('Kebap Recipe','This is simply a test',
  //   'https://cdn.yemek.com/mncrop/940/625/uploads/2019/07/tire-kofte-tarifi.jpg',
  //   [
  //     new Ingredient('Meat',1),
  //     new Ingredient('Tomato',1),
  //     new Ingredient('Parsley',1),
  //     new Ingredient('salt und pepper',0.5)
  //   ])
  // ];

  private recipes:Recipe[] = []

  constructor(private sLService: ShoppingListService) { }



getRecipes() {
  return this.recipes.slice(); //kopyasini göndermek icin slice methodunu kullandik
}

getRecipe(index:number) {
return this.recipes[index]
}

addIngredientsToShoppingList(ingredients:Ingredient[]){
  this.sLService.addIngredients(ingredients)
}

addRecipe(recipe:Recipe) {
  	this.recipes.push(recipe)
    this.recipesChanged.next(this.recipes.slice())
}

updateRecipe(index:number, newRecipe: Recipe) {
  this.recipes[index]= newRecipe
  this.recipesChanged.next(this.recipes.slice())
}

deleteRecipe(index:number) {
  this.recipes.splice(index,1)
  this.recipesChanged.next(this.recipes.slice())
}

setRecipes(recipes:Recipe[]) {
  this.recipes = recipes;
  this.recipesChanged.next(this.recipes.slice())
  console.log('setRecipe calisti.');
  
}
}