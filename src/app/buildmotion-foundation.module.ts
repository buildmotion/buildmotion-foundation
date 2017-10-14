import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuildMotionAlertModule } from 'buildmotion-alert';
import { BuildmotionLoggingModule } from 'buildmotion-logging';

@NgModule({
  imports: [
    CommonModule,
    BuildMotionAlertModule,
    BuildmotionLoggingModule
  ],
  declarations: []
})
export class BuildmotionFoundationModule { }
