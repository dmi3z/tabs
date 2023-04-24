import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NodeTree } from './interfaces/node-tree.interface';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent {
  @Input() data: NodeTree[] = [];
  @Output() public itemSelected = new EventEmitter<
    Omit<NodeTree, 'collapsed' | 'children'>
  >();

  constructor() {}

  public selected(item: NodeTree): void {
    const { collapsed, children, ...rest } = item;
    this.itemSelected.emit(rest);
  }
}
