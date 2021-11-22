import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayGamePageRoutingModule } from './play-game-routing.module';
import { PlayGamePage } from './play-game.page';

import { PlayQCMComponent } from '../play-qcm/play-qcm.component';
import { PlayGroupsComponent } from '../play-groups/play-groups.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayGamePageRoutingModule
  ],
  declarations: [
    PlayGamePage,
    PlayQCMComponent,
    PlayGroupsComponent
  ]
})
export class PlayGamePageModule {}
