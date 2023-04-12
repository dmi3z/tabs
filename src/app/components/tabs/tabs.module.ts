import { NgModule } from '@angular/core';
import { TabsComponent } from './tabs.component';
import { CommonModule } from '@angular/common';
import { OverflowTabsPipe } from './pipes/overflow-tabs.pipe';
import { ViewResizeDirective } from './directives/view-resize.directive';

@NgModule({
  declarations: [TabsComponent, OverflowTabsPipe, ViewResizeDirective],
  imports: [CommonModule],
  exports: [TabsComponent],
})
export class TabsModule {}
