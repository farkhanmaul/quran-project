import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  standalone: true
})
export class LoadingComponent {
  @Input() message: string = 'Loading...';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() type: 'spinner' | 'dots' | 'bars' = 'spinner';

  // TODO: Add loading animation logic
}