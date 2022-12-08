import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MesureComponent } from '../list/mesure.component';
import { MesureDetailComponent } from '../detail/mesure-detail.component';
import { MesureUpdateComponent } from '../update/mesure-update.component';
import { MesureRoutingResolveService } from './mesure-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mesureRoute: Routes = [
  {
    path: '',
    component: MesureComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MesureDetailComponent,
    resolve: {
      mesure: MesureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MesureUpdateComponent,
    resolve: {
      mesure: MesureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MesureUpdateComponent,
    resolve: {
      mesure: MesureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mesureRoute)],
  exports: [RouterModule],
})
export class MesureRoutingModule {}
