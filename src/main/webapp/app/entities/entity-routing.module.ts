import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'recipe',
        data: { pageTitle: 'mealScheduelerApp.recipe.home.title' },
        loadChildren: () => import('./recipe/recipe.module').then(m => m.RecipeModule),
      },
      {
        path: 'recipe-ingredient',
        data: { pageTitle: 'mealScheduelerApp.recipeIngredient.home.title' },
        loadChildren: () => import('./recipe-ingredient/recipe-ingredient.module').then(m => m.RecipeIngredientModule),
      },
      {
        path: 'mesure',
        data: { pageTitle: 'mealScheduelerApp.mesure.home.title' },
        loadChildren: () => import('./mesure/mesure.module').then(m => m.MesureModule),
      },
      {
        path: 'ingredient',
        data: { pageTitle: 'mealScheduelerApp.ingredient.home.title' },
        loadChildren: () => import('./ingredient/ingredient.module').then(m => m.IngredientModule),
      },
      {
        path: 'user-info',
        data: { pageTitle: 'mealScheduelerApp.userInfo.home.title' },
        loadChildren: () => import('./user-info/user-info.module').then(m => m.UserInfoModule),
      },
      {
        path: 'schedule',
        data: { pageTitle: 'mealScheduelerApp.schedule.home.title' },
        loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
