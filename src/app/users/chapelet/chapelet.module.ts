import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// drag and drop 


import { IonicModule } from '@ionic/angular';

import { ChapeletPageRoutingModule } from './chapelet-routing.module';

import { ChapeletPage } from './chapelet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChapeletPageRoutingModule
  ],

  declarations: [ChapeletPage,]
})
export class ChapeletPageModule {}
