import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {
  recipes:Recipe[] = [
    new Recipe('A Test Recipe','This is simply a test',
    'https://i20.haber7.net/resize/1300x731/haber/haber7/photos/2019/16/sunumu_sik_olan_pratik_ana_yemek_tarifleri_1555673831_6061.jpg'),
    new Recipe('A Test Recipe','This is simply a test',
    'https://cdn.yemek.com/mncrop/940/625/uploads/2019/07/tire-kofte-tarifi.jpg')
  ];
}
