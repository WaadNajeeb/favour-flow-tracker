import { CommonModule } from '@angular/common';
import { ContentChild, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgSelectComponent, NgSelectModule, } from '@ng-select/ng-select';
import { Observable, of, Subject } from 'rxjs';
@Component({
  selector: 'app-dropdown',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule, ReactiveFormsModule,
    NgSelectComponent,
    FormsModule, ReactiveFormsModule, CommonModule, NgSelectModule, MatCheckboxModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
  label = input<string>('');
  placeholder = input<string>('');
  control = input<FormControl>(new FormControl(''));
  allowMultiple = input<boolean>(false);
  private _items: any[] | null | undefined = [];
  dropdownValues = input<string[] | null>(null);
  people$: Observable<string[]> = of(['asfasdf', 'asdfsd',' asdfwee']);;
  @Input() set items(items: any[] | null | undefined) {
    if (items) {
      // we need to filter nulls/undefined because ng-select crashes :(
      this._items = items.filter(item => item != null && items != undefined);
    } else {
      this._items = items;
    }
  }


  readonly bindLabel = input<string>('');
  readonly bindValue = input<string>('');
  readonly trackByFn = input<(item: any, index: number) => boolean>();
  readonly customTagFunction = input<(search: string) => any>();
  readonly isLoading = input<boolean | null | undefined>(false);

  readonly clearable = input<boolean>(false);
  readonly searchChanged = input<Subject<string>>(new Subject<string>());

  get items() {
    return this._items;
  }

  isRequired(): boolean {
    const ctrl = this.control();
    if (!ctrl || !ctrl.validator) return false;

    const validator = ctrl.validator({} as AbstractControl);
    return validator ? validator['required'] !== undefined : false;
  }

  @ContentChild('optionTemplate') optionTemplate?: TemplateRef<any>;
  @ContentChild('labelTemplate') labelTemplate?: TemplateRef<any>;
  // @ContentChild('optionTemplate', { read: TemplateRef }) optionTemplate?: TemplateRef<any>;
  @ViewChild(NgSelectComponent) select?: NgSelectComponent;
  readonly allowTagging = input(false);

  @Output() onDropdownValue: EventEmitter<string> = new EventEmitter<string>();

  protected editing() {
    // if (this.defaultOptions?.autoFocus || this.autoFocus()) {
    //   setTimeout(() => {
    //     this.select?.focus();
    //   });
    // }
  }

  protected getTagFunction(): boolean | any {
    const allowTagging = this.allowTagging();

    if (allowTagging) {
      return this.tagFn;
    }
    this.select?.closeOnSelect;
    return false;
  }

  ngAfterContentInit(): void {
    // there is error on some of the fields such as address type
    // it work for other fields for some reason
    // setTimeout(() => {
    //   this.control.addValidators(this.invalidValueChecker());
    //   this.control.updateValueAndValidity();
    // });
  }

  // Must be defined as arrow function to avoid needing .bind(this)
  private tagFn = (search: string) => {
    // return;
    const customTagFunction = this.customTagFunction();
    if (typeof customTagFunction === 'function') {
      return customTagFunction(search);
    }
    return search;
  };
	selectedPersonId = 'asdfsd';
  onChange($event: string) {
    this.onDropdownValue.emit($event);
  }
}
export interface Person {
	id: string;
	isActive: boolean;
	age: number;
	name: string;
	gender: string;
	company: string;
	email: string;
	phone: string;
	disabled?: boolean;
}
