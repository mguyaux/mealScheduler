import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRecipeIngredient, NewRecipeIngredient } from '../recipe-ingredient.model';

export type PartialUpdateRecipeIngredient = Partial<IRecipeIngredient> & Pick<IRecipeIngredient, 'id'>;

export type EntityResponseType = HttpResponse<IRecipeIngredient>;
export type EntityArrayResponseType = HttpResponse<IRecipeIngredient[]>;

@Injectable({ providedIn: 'root' })
export class RecipeIngredientService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/recipe-ingredients');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(recipeIngredient: NewRecipeIngredient): Observable<EntityResponseType> {
    return this.http.post<IRecipeIngredient>(this.resourceUrl, recipeIngredient, { observe: 'response' });
  }

  update(recipeIngredient: IRecipeIngredient): Observable<EntityResponseType> {
    return this.http.put<IRecipeIngredient>(
      `${this.resourceUrl}/${this.getRecipeIngredientIdentifier(recipeIngredient)}`,
      recipeIngredient,
      { observe: 'response' }
    );
  }

  partialUpdate(recipeIngredient: PartialUpdateRecipeIngredient): Observable<EntityResponseType> {
    return this.http.patch<IRecipeIngredient>(
      `${this.resourceUrl}/${this.getRecipeIngredientIdentifier(recipeIngredient)}`,
      recipeIngredient,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRecipeIngredient>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRecipeIngredient[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRecipeIngredientIdentifier(recipeIngredient: Pick<IRecipeIngredient, 'id'>): number {
    return recipeIngredient.id;
  }

  compareRecipeIngredient(o1: Pick<IRecipeIngredient, 'id'> | null, o2: Pick<IRecipeIngredient, 'id'> | null): boolean {
    return o1 && o2 ? this.getRecipeIngredientIdentifier(o1) === this.getRecipeIngredientIdentifier(o2) : o1 === o2;
  }

  addRecipeIngredientToCollectionIfMissing<Type extends Pick<IRecipeIngredient, 'id'>>(
    recipeIngredientCollection: Type[],
    ...recipeIngredientsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const recipeIngredients: Type[] = recipeIngredientsToCheck.filter(isPresent);
    if (recipeIngredients.length > 0) {
      const recipeIngredientCollectionIdentifiers = recipeIngredientCollection.map(
        recipeIngredientItem => this.getRecipeIngredientIdentifier(recipeIngredientItem)!
      );
      const recipeIngredientsToAdd = recipeIngredients.filter(recipeIngredientItem => {
        const recipeIngredientIdentifier = this.getRecipeIngredientIdentifier(recipeIngredientItem);
        if (recipeIngredientCollectionIdentifiers.includes(recipeIngredientIdentifier)) {
          return false;
        }
        recipeIngredientCollectionIdentifiers.push(recipeIngredientIdentifier);
        return true;
      });
      return [...recipeIngredientsToAdd, ...recipeIngredientCollection];
    }
    return recipeIngredientCollection;
  }
}
