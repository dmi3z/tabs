import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-multiselect-checkbox',
  templateUrl: './multiselect-checkbox.component.html',
  styleUrls: ['./multiselect-checkbox.component.scss'],
})
export class MultiselectCheckbox {
  @Input() public state: 'none' | 'partial' | 'all' = 'none';
  @Output() public checked = new EventEmitter<void>();

  constructor() {}

  public check(): void {
    this.checked.emit();
  }
}
