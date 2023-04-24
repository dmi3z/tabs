import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  @Input() public pagesCount!: number;
  @Input() public currentPageIndex = 0;
  @Input() public itemsPerPage!: number;

  @Output() public pageChanged = new EventEmitter<number>();

  public paginationNumbers!: number[];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['pagesCount']) {
      this.initializePaginator();
    }
  }

  public increasePage(): void {
    if (this.currentPageIndex + 1 < this.pagesCount) {
      this.currentPageIndex++;
      this.pageChanged.emit(this.currentPageIndex);
    }
  }

  public decreasePage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.pageChanged.emit(this.currentPageIndex);
    }
  }

  public goToPage(pageIndex: number): void {
    this.currentPageIndex = pageIndex;
    this.pageChanged.emit(this.currentPageIndex);
  }

  private initializePaginator(): void {
    this.paginationNumbers = Array(this.pagesCount)
      .fill(1)
      .map((_, i) => i);
  }
}
