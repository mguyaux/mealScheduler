import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RecipeIngredientComponent } from '../list/recipe-ingredient.component';
import { RecipeIngredientDetailComponent } from '../detail/recipe-ingredient-detail.component';
import { RecipeIngredientUpdateComponent } from '../update/recipe-ingredient-update.component';
import { RecipeIngredientRoutingResolveService } from './recipe-ingredient-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const recipeIngredientRoute: Routes = [
  {
    path: '',
    component: RecipeIngredientComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RecipeIngredientDetailComponent,
    resolve: {
      recipeIngredient: RecipeIngredientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RecipeIngredientUpdateComponent,
    resolve: {
      recipeIngredient: RecipeIngredientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RecipeIngredientUpdateComponent,
    resolve: {
      recipeIngredient: RecipeIngredientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(recipeIngredientRoute)],
  exports: [RouterModule],
})
export class RecipeIngredientRoutingModule {}
