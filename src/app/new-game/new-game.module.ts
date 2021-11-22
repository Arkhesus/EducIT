import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewGamePageRoutingModule } from './new-game-routing.module';

import { NewQCMComponent } from '../new-qcm/new-qcm.component';
import { NewGroupsComponent } from '../new-groups/new-groups.component';
import { NewCrosswordComponent } from '../new-crossword/new-crossword.component';

import { NewGamePage } from './new-game.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewGamePageRoutingModule,
  ],
  declarations: [
    NewGamePage,
    NewQCMComponent,
    NewGroupsComponent,
    NewCrosswordComponent
  ]
})
export class NewGamePageModule {}
