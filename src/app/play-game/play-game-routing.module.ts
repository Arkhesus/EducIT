import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayGamePage } from './play-game.page';

const routes: Routes = [
  {
    path: '',
    component: PlayGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayGamePageRoutingModule {}
