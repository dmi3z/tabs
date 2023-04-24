import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NodeTree } from '../../interfaces/node-tree.interface';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent {
  @Input() public node!: NodeTree;
  @Output() public itemSelected = new EventEmitter<NodeTree>();

  constructor() {}

  public toggleChildren(): void {
    this.node.collapsed = !this.node.collapsed;
  }

  public selected(): void {
    this.itemSelected.emit(this.node);
  }
}
