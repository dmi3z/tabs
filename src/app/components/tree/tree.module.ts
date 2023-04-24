import { NgModule } from '@angular/core';
import { TreeComponent } from './tree.component';
import { CommonModule } from '@angular/common';
import { BranchComponent } from './components/branch/branch.component';

@NgModule({
  declarations: [TreeComponent, BranchComponent],
  imports: [CommonModule],
  exports: [TreeComponent],
})
export class TreeModule {}
