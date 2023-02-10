import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy{

  ingredients: Ingredient[] ;
  private igChangeSub : Subscription

  constructor (private shoppingLService: ShoppingListService) {}
  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe()
  }

  ngOnInit(): void {
    this.ingredients = this.shoppingLService.getIngredients()
    this.igChangeSub = this.shoppingLService.ingredientsChanged.
    subscribe((ingredients: Ingredient[])=>{this.ingredients=ingredients})
  }

  onIngredientAdded(ingredient: Ingredient) {
    this.ingredients.push(ingredient)
  }

  onEditItem(index:number){
    this.shoppingLService.startedEditing.next(index)
  }

}
