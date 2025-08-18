import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// TODO: Import Angular Material modules when installed
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatCardModule } from '@angular/material/card';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    
    // TODO: Add Angular Material modules when installed
    // MatToolbarModule,
    // MatSidenavModule,
    // MatButtonModule,
    // MatIconModule,
    // MatCardModule,
    // MatInputModule,
    // MatSelectModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    // MatProgressBarModule,
    // MatProgressSpinnerModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    
    // TODO: Export Angular Material modules when installed
    // MatToolbarModule,
    // MatSidenavModule,
    // MatButtonModule,
    // MatIconModule,
    // MatCardModule,
    // MatInputModule,
    // MatSelectModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    // MatProgressBarModule,
    // MatProgressSpinnerModule,
  ],
  declarations: [
    // TODO: Add shared components, directives, pipes
  ]
})
export class SharedModule { }