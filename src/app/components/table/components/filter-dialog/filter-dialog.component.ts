import {
  Component,
  ComponentRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { originalOrder, stopProp } from '../../utils/utils';

@Component({
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss'],
})
export class FilterDialogComponent implements OnInit {
  public static dialogInstance: ComponentRef<FilterDialogComponent>;
  @Output() public filterDestroy = new EventEmitter<{
    [key: string]: string;
  }>();
  public filterFields!: { [key: string]: string };
  protected filterForm!: FormGroup;
  protected originalOrder = originalOrder;
  protected stopProp = stopProp;

  constructor() {}

  ngOnInit(): void {
    const filterControls = Object.keys(this.filterFields).reduce(
      (acc, key) => Object.assign(acc, { [key]: new FormControl('') }),
      {}
    );
    this.filterForm = new FormGroup(filterControls);
  }

  public closeDialog(): void {
    FilterDialogComponent.dialogInstance.destroy();
  }

  public apply(): void {
    const formValue = this.filterForm.value;
    this.filterDestroy.emit(formValue);
    this.closeDialog();
  }
}
