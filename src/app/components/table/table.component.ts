import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { SortEvent, SortableHeader } from './directives/sortable.directive';
import { TableSettings } from './interfaces/table-settings.interface';
import { originalOrder, stopProp } from './utils/utils';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { CheckboxState } from './constants/checkbox-state';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T extends { id: number; [key: string]: any }>
  implements OnInit, OnDestroy
{
  @Input() public data: T[] = [];
  @Input() public set tableSettings(value: TableSettings) {
    this.settings = { ...this.settings, ...value };
  }
  @ViewChildren(SortableHeader) headers!: QueryList<SortableHeader>;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() filterChanged = new EventEmitter<{
    [Property in keyof T]: string;
  }>();
  @Output() selectionChanged = new EventEmitter<T[]>();

  public columns!: { [Property in keyof T]: string };
  public data$ = new BehaviorSubject<T[]>([]);
  public pagesCount!: number;
  public settings: TableSettings = {
    page: 0,
    size: 10,
    selectable: false,
    asyncData: false,
    visibleColumns: null,
    pagination: true,
    filterable: false,
  };

  public contentForm!: FormGroup;
  public filtersForm!: FormGroup;
  public checkboxesState: CheckboxState = CheckboxState.NONE;
  public originalOrder = originalOrder;
  public filterSelected = stopProp;

  private destroy$ = new Subject<void>();

  constructor(private vcr: ViewContainerRef) {}

  ngOnInit(): void {
    this.columns = this.getAvailableColumns();
    this.refreshData(this.data);
    this.refreshSelectionForm();

    this.initializePagination(this.data);
    this.initializeFiltersForm();
  }

  public changePage(page: number): void {
    if (page !== this.settings.page) {
      if (this.settings.asyncData) {
        this.pageChanged.emit(page);
      } else {
        this.settings.page = page;
        this.refreshData(this.data);
      }
      this.refreshSelectionForm();
    }
  }

  public sortBy(event: SortEvent): void {
    const { column, direction } = event;
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    switch (direction) {
      case '':
        this.refreshData(this.data);
        break;

      case 'asc':
        const sortedDataAsc = [...this.data].sort((a, b) => {
          if (typeof a[column] === 'number' && typeof b[column] === 'number') {
            return a[column] - b[column];
          } else {
            const strA = a[column];
            const strB = b[column];
            return strA.localeCompare(strB);
          }
        });
        this.refreshData(sortedDataAsc);
        break;

      case 'desc':
        const sortedDataDesc = [...this.data].sort((a, b) => {
          if (typeof a[column] === 'number' && typeof b[column] === 'number') {
            return b[column] - a[column];
          } else {
            const strA = a[column];
            const strB = b[column];
            return strB.localeCompare(strA);
          }
        });
        this.refreshData(sortedDataDesc);
        break;
    }
    this.refreshSelectionForm();
  }

  public multiselectChecked(): void {
    if (this.checkboxesState === CheckboxState.ALL) {
      this.resetContentForm(false);
      this.checkboxesState = CheckboxState.NONE;
    } else {
      this.resetContentForm(true);
      this.checkboxesState = CheckboxState.ALL;
    }

    const formValue = this.contentForm.value as {
      [Property in keyof T]: boolean;
    };
    const selectedItems = this.getSelectedItems(formValue);
    this.selectionChanged.emit(selectedItems);
  }

  public searchItems(filterValue: { [Property in keyof T]: string }): void {
    if (this.settings.asyncData) {
      this.filterChanged.emit(filterValue);
    } else {
      const filledFilters = Object.keys(filterValue).reduce((acc, key) => {
        if (filterValue[key]) {
          return Object.assign(acc, {
            [key]: filterValue[key].toString().toLowerCase(),
          });
        } else {
          return acc;
        }
      }, {} as { [Property in keyof T]: string });

      const res = this.data.filter((item) => {
        const keys = Object.keys(filledFilters);
        return keys.every((key) =>
          item[key].toString().toLowerCase().includes(filledFilters[key])
        );
      });

      this.refreshData(res);
      this.refreshSelectionForm();
      this.initializePagination(res);
    }
  }

  public openFilterDialog(): void {
    const filterDialogRef = this.vcr.createComponent(FilterDialogComponent);
    FilterDialogComponent.dialogInstance = filterDialogRef;
    filterDialogRef.instance.filterFields = this.columns;
    filterDialogRef.instance.filterDestroy
      .pipe(take(1))
      .subscribe((res) =>
        this.searchItems(res as { [Property in keyof T]: string })
      );
  }

  private resetContentForm(value: boolean): void {
    const formKeys = Object.keys(this.contentForm.controls);
    formKeys.forEach((key) =>
      this.contentForm.get(key)?.patchValue(value, { emitEvent: false })
    );
  }

  private initializePagination(data: T[]): void {
    const size = this.settings?.size || 10;
    this.pagesCount = Math.ceil(data.length / size);
  }

  private refreshData(data: T[]): void {
    if (this.settings.pagination) {
      if (!this.settings.asyncData) {
        const { page, size } = this.settings;
        const pageNum = page || 0;
        const pageSize = size || 10;
        const splittedData = data.slice(
          pageNum * pageSize,
          pageNum * pageSize + pageSize
        );

        this.data$.next(splittedData);
      } else {
        this.data$.next(data);
      }
    } else {
      this.data$.next(data);
    }
  }

  private initializeFiltersForm(): void {
    if (this.settings?.filterable) {
      let columns: (keyof T)[] = [];
      if (this.settings.visibleColumns) {
        columns = Object.keys(this.settings.visibleColumns);
      } else {
        columns = Object.keys(this.data[0]);
      }
      const filterControls = columns.reduce(
        (acc, columnName) =>
          Object.assign(acc, { [columnName]: new FormControl('') }),
        {} as { [Property in keyof T]: AbstractControl<string> }
      );
      this.filtersForm = new FormGroup(filterControls);
    } else {
      this.filtersForm = new FormGroup({});
    }
  }

  private refreshSelectionForm(): void {
    const formControls = this.data$.value.reduce(
      (acc, item) => Object.assign(acc, { [item.id]: new FormControl(false) }),
      {} as { [Property in keyof T]: AbstractControl<boolean> }
    );
    this.contentForm = new FormGroup(formControls);

    this.contentForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((values) => {
        const allSelected = Object.values(values).every((val) => val);
        if (allSelected) {
          this.checkboxesState = CheckboxState.ALL;
        } else if (Object.values(values).some((val) => val)) {
          this.checkboxesState = CheckboxState.PARTIAL;
        } else {
          this.checkboxesState = CheckboxState.NONE;
        }
        const selectedItems = this.getSelectedItems(values);

        this.selectionChanged.emit(selectedItems);
      });
  }

  private getSelectedItems(selection: { [Property in keyof T]: boolean }): T[] {
    const selectedKeys = (Object.keys(selection) as (keyof T)[]).reduce(
      (acc, key) => {
        if (selection[key]) {
          return Object.assign(acc, { [key]: selection[key] });
        }
        return acc;
      },
      {} as { [id: number]: boolean }
    );

    const selectedItems = this.data$.value.filter(
      (item) => selectedKeys[item.id]
    );

    return selectedItems;
  }

  private getAvailableColumns(): { [Property in keyof T]: string } {
    const tableColumns = Object.keys(this.data[0] as Object) as (keyof T)[];

    if (this.settings.visibleColumns) {
      return this.settings.visibleColumns as {
        [Property in keyof T]: string;
      };
    } else {
      return tableColumns.reduce(
        (acc, columnName) => ({ ...acc, [columnName]: columnName }),
        {} as { [Property in keyof T]: string }
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
