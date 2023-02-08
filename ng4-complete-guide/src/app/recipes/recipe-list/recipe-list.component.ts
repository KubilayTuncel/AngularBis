import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit{

  recipes: Recipe[];

constructor (private recipeService: RecipesService,
              private router: Router,
              private route:ActivatedRoute) {}
  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes()
  }
 
  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo:this.route})
  }

}
