import { Pipe, PipeTransform } from '@angular/core';
import { TabComponent } from '../interfaces/tab-component.interface';

@Pipe({
  name: 'appOverflowTabs',
  pure: false,
})
export class OverflowTabsPipe implements PipeTransform {
  transform(tabs: TabComponent[], index: number, right?: boolean) {
    if (right) {
      return tabs.slice(index - 1, tabs.length - 1);
    }
    return tabs.slice(0, index);
  }
}
