import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';
import { SortableHeader } from './directives/sortable.directive';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from './components/pagination/pagination.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { MultiselectCheckbox } from './components/multiselect-checkbox/multiselect-checkbox.component';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';

@NgModule({
  declarations: [
    TableComponent,
    SortableHeader,
    PaginationComponent,
    CheckboxComponent,
    MultiselectCheckbox,
    FilterDialogComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [TableComponent],
})
export class TableModule {}
