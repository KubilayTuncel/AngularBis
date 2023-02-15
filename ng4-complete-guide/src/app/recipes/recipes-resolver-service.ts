import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStrogeService } from "../shared/data-storege-Service";
import { Recipe } from "./recipe.model";
import { RecipesService } from "./recipes.service";


@Injectable ({providedIn:'root'})
export class RecipesResolverService implements Resolve<Recipe[]>{

    constructor (private dataStor : DataStrogeService,
                private recipesService:RecipesService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        const recipes = this.recipesService.getRecipes()

        if(recipes.length === 0) {
            return this.dataStor.fetchRecipes()
        }else {
            return recipes
        }
    }
    

}