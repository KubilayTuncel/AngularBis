import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";


export class ShoppingListService {

    ingredientsChanged = new Subject<Ingredient[]>() // mevcut listeye ekleme yapildigi zaman bu degeri sayfada görmek icin
    // Emit operatörünü kullandik. Daha sonra onIngAdd methodun da bu eklemeyi kayit altina aldik
    // sevisin bagli oldugu ShoppingList.ts de bu kayidi ön tarafa gönderebilmek icin subsicrebi methodu ile eklemeyi gerceklestirdik.
    startedEditing = new Subject<number>()
    private ingredients: Ingredient[] = [
        new Ingredient('Apples',5),
        new Ingredient('Tomates',10),
      ];


      getIngredients() {
        return this.ingredients.slice()
      }

      getIngredient(index:number){
        return this.ingredients[index]
      }

      onIngredientAdded(ingredient: Ingredient) {
        this.ingredients.push(ingredient)
        //this.ingredientsChanged.emit(this.ingredients.slice())
        this.ingredientsChanged.next(this.ingredients.slice())
      }

    addIngredients(ingredients:Ingredient[]) {
        //1. yol
        // for (let ingredient of ingredients) {
        //     this.onIngredientAdded(ingredient)
        // }

        //2. yol
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice())
    
    }

    updateIngredient(index:number, newIngredient:Ingredient){
      this.ingredients[index] = newIngredient
      this.ingredientsChanged.next(this.ingredients.slice())
    }

    deleteIngredient(index:number) {
      this.ingredients.splice(index,1)
      this.ingredientsChanged.next(this.ingredients.slice())
    }

}