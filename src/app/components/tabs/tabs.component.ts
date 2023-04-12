import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { TabComponent } from './interfaces/tab-component.interface';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterViewInit, OnChanges {
  @Input() public tabs: TabComponent[] = [];
  @ViewChild('ruler') public rulerRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('content', { read: ViewContainerRef })
  protected contentRefs!: QueryList<ViewContainerRef>;
  protected activeTabIndex = 0;
  protected overflowed!: boolean;
  protected hiddenIndex!: number;

  private tabEntities: ComponentRef<any>[] = [];

  constructor() {}

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
      this.addTab(
        tabsChanges.currentValue[tabsChanges.currentValue.length - 1]
      );
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
    this.tabs.splice(tabIndex, 1);

    if (tabIndex === this.activeTabIndex) {
      this.activeTabIndex = 0;
    }
    this.calculateDimensions();
  }

  private addTab(tab: TabComponent): void {
    setTimeout(() => {
      const contentRefs = this.contentRefs.toArray();
      const tabEntity = contentRefs[contentRefs.length - 1].createComponent(
        tab.component
      );
      this.tabEntities.push(tabEntity);

      this.calculateDimensions();
    }, 0);
  }

  private calculateDimensions(): void {
    const rulerWidth = this.rulerRef.nativeElement.clientWidth - 250;
    const tabsWidth = this.tabs.length * 150;

    this.overflowed = tabsWidth >= rulerWidth;
    if (this.overflowed && !this.hiddenIndex) {
      this.hiddenIndex = this.tabs.length - 1;
    }
  }
}
