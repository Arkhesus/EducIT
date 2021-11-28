import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayGamePageRoutingModule } from './play-game-routing.module';
import { PlayGamePage } from './play-game.page';

import { PlayQCMComponent } from '../play-qcm/play-qcm.component';
import { PlayGroupsComponent } from '../play-groups/play-groups.component';
import { PlayCrosswordComponent } from '../play-crossword/play-crossword.component'
import { PlayGapTextComponent } from '../play-gap-text/play-gap-text.component';

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
    PlayGroupsComponent,
    PlayCrosswordComponent,
    PlayGapTextComponent
  ]
})
export class PlayGamePageModule {}
