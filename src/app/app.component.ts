import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { TestComponent } from './components/test/test.component';
import { TabComponent } from './components/tabs/interfaces/tab-component.interface';
import { TabsComponent } from './components/tabs/tabs.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('tabss', { read: TabsComponent })
  public tabsComponent!: TabsComponent;
  public tabs: TabComponent[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.tabsComponent;
  }

  public addTab(): void {
    const tab: TabComponent = {
      title: Math.random().toString(),
      component: TestComponent,
    };

    this.tabs = [...this.tabs, tab, tab];
  }
}
