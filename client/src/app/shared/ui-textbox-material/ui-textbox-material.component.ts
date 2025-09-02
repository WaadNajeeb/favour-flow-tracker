import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-ui-textbox-material',
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ui-textbox-material.component.html',
  styleUrl: './ui-textbox-material.component.scss'
})
export class UiTextboxMaterialComponent implements OnInit  {

  readonly control = input<FormControl>(new FormControl<string | null>(''));
  readonly label = input<string>();
  readonly required = input<boolean>(true);
  readonly autofocus = input<boolean>(false);
  readonly icon = input<string>();
  readonly disabled = input<boolean>();
  readonly placeholder = input<string>();
  ngOnInit(): void {
    if(this.disabled()){
      this.control().disable();
    }
  }
}
