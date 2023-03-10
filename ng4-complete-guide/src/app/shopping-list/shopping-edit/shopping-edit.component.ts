import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy{

  @ViewChild('f', {static:false}) slForm:NgForm
  subscription : Subscription
  editMode = false
  editedItemIndex : number
  editedItem: Ingredient

  constructor (private shoppingLService: ShoppingListService) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
    

  ngOnInit(): void {
   this.subscription = this.shoppingLService.startedEditing.subscribe(
    (index:number)=>{
      this.editedItemIndex = index
      this.editMode = true
      this.editedItem = this.shoppingLService.getIngredient(index)
      this.slForm.setValue({
        name:this.editedItem.name,
        amount:this.editedItem.amount
      })
    }
   )
  }

 
 
  onSubmit(form:NgForm) {
    const value=form.value
    const newIngredient = new Ingredient(value.name,value.amount)
    if(this.editMode) {
      this.shoppingLService.updateIngredient(this.editedItemIndex, newIngredient)
    }else {
      this.shoppingLService.onIngredientAdded(newIngredient)
    }
    this.editMode = false
   form.reset()
  }

  onClear(){
    this.slForm.reset()
    this.editMode = false
  }

  onDelete() {
    this.shoppingLService.deleteIngredient(this.editedItemIndex)
    this.onClear()
  }
  
}
