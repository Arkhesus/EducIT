import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewInfoPage } from './new-info.page';

const routes: Routes = [
  {
    path: '',
    component: NewInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewInfoPageRoutingModule {}
