import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuildMotionAlertModule } from 'buildmotion-alert';
import { BuildMotionLoggingModule } from 'buildmotion-logging';

@NgModule({
  imports: [
    CommonModule,
    BuildMotionAlertModule,
    BuildMotionLoggingModule
  ],
  declarations: []
})
export class BuildMotionFoundationModule { }
