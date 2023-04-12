import {
  Directive,
  HostListener,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[appViewResize]',
})
export class ViewResizeDirective implements OnInit {
  @Output() public viewResized = new EventEmitter<void>();
  @HostListener('window:resize') public test() {
    this.viewResized.emit();
  }

  constructor() {}

  ngOnInit(): void {
    console.log('Here');
  }
}
