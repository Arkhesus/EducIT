import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewInfoPageRoutingModule } from './new-info-routing.module';

import { NewInfoPage } from './new-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewInfoPageRoutingModule
  ],
  declarations: [NewInfoPage]
})
export class NewInfoPageModule {}
