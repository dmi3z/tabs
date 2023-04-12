import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { TabComponent } from './interfaces/tab-component.interface';
import { Subject, fromEvent, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() public tabs: TabComponent[] = [];
  @ViewChild('ruler') public rulerRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('content', { read: ViewContainerRef })
  protected contentRefs!: QueryList<ViewContainerRef>;
  protected activeTabIndex = 0;
  protected overflowed!: boolean;
  protected hiddenIndex!: number;

  private tabEntities: ComponentRef<any>[] = [];
  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.handleViewResize();
  }

  ngAfterViewInit(): void {
    this.tabEntities = this.contentRefs.map((contentRef, index) => {
      const tabEntity = contentRef.createComponent(this.tabs[index].component);
      tabEntity.instance.text = this.tabs[index].title;

      return tabEntity;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const tabsChanges = changes['tabs'];
    if (tabsChanges && !tabsChanges.firstChange) {
      const prevTabs = tabsChanges.previousValue as TabComponent[];
      const curTabs = tabsChanges.currentValue as TabComponent[];
      const diff = curTabs.filter((tab) => !prevTabs.includes(tab));

      this.addTabs(diff);
    }
  }

  public getTabInstanses(): any[] {
    return this.tabEntities.map((tab) => tab.instance);
  }

  protected openTab(tabIndex: number): void {
    this.activeTabIndex = tabIndex;
  }

  protected removeTab(event: MouseEvent, tabIndex: number): void {
    event.stopPropagation();
    this.tabEntities[tabIndex].destroy();
    this.tabs = this.tabs.filter((_, index) => index !== tabIndex);

    if (tabIndex === this.activeTabIndex) {
      this.activeTabIndex = 0;
    }

    if (tabIndex < this.activeTabIndex) {
      this.activeTabIndex--;
    }

    this.calculateDimensions();
  }

  private addTabs(tabs: TabComponent[]): void {
    setTimeout(() => {
      const contentRefs = this.contentRefs.toArray();
      const startAddPosition = contentRefs.length - tabs.length;
      const tabEntities = tabs.map((tab, index) =>
        contentRefs[startAddPosition + index].createComponent(tab.component)
      );
      this.tabEntities = [...this.tabEntities, ...tabEntities];
      this.calculateDimensions();
    }, 0);
  }

  private calculateDimensions(): void {
    const rulerWidth = this.rulerRef.nativeElement.clientWidth - 150;
    const tabsWidth = this.tabs.length * 150;

    this.overflowed = tabsWidth >= rulerWidth;
    if (this.overflowed) {
      this.hiddenIndex = Math.floor(rulerWidth / 150);
    } else {
      this.hiddenIndex = this.tabs.length;
    }
  }

  private handleViewResize(): void {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateDimensions());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
