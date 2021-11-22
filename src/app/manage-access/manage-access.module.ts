import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageAccessPageRoutingModule } from './manage-access-routing.module';

import { ManageAccessPage } from './manage-access.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageAccessPageRoutingModule
  ],
  declarations: [ManageAccessPage]
})
export class ManageAccessPageModule {}
