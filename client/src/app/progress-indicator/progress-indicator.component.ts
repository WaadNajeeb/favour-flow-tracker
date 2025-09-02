import { Component, Input } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type ProgressIndicatorType = 'splash' | 'default' | 'error'
@Component({
    selector: 'app-progress-indicator',
    imports: [MatProgressSpinnerModule],
    templateUrl: './progress-indicator.component.html',
    styleUrls: ['./progress-indicator.component.scss']
})
export class ProgressIndicatorComponent {
  @Input() message: string = '';
  @Input() type: ProgressIndicatorType = 'default';
}
