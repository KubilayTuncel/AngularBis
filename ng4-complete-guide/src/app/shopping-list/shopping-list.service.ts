import { EventEmitter } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";


export class ShoppingListService {

    ingredientsChanged = new EventEmitter<Ingredient[]>() // mevcut listeye ekleme yapildigi zaman bu degeri sayfada görmek icin
    // Emit operatörünü kullandik. Daha sonra onIngAdd methodun da bu eklemeyi kayit altina aldik
    // sevisin bagli oldugu ShoppingList.ts de bu kayidi ön tarafa gönderebilmek icin subsicrebi methodu ile eklemeyi gerceklestirdik.
    private ingredients: Ingredient[] = [
        new Ingredient('Apples',5),
        new Ingredient('Tomates',10),
      ];


      getIngredients() {
        return this.ingredients.slice()
      }
      onIngredientAdded(ingredient: Ingredient) {
        this.ingredients.push(ingredient)
        this.ingredientsChanged.emit(this.ingredients.slice())
      }

    addIngredients(ingredients:Ingredient[]) {
        //1. yol
        // for (let ingredient of ingredients) {
        //     this.onIngredientAdded(ingredient)
        // }

        //2. yol
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.emit(this.ingredients.slice())
    
    }

}