import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CarouselSettings } from './interfaces/carousel-settings.interface';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterViewInit {
  @Input() public set settings(value: CarouselSettings) {
    this.carouselSettings = { ...this.carouselSettings, ...value };
  }
  @ViewChild('content') public content!: ElementRef<HTMLElement>;
  @ViewChild('carousel') public carousel!: ElementRef<HTMLElement>;

  public items!: HTMLElement[];
  public position = 0;

  private itemWidth = 0;
  private totalSpace = 0;
  private currentSize = 1;

  private carouselSettings: CarouselSettings = {
    arrows: true,
    markers: true,
    size: 3,
    step: 1,
    space: 20,
  };

  @HostListener('window:resize') public onResize(): void {
    const size = this.getActualSize();
    this.position = 0;
    this.calculateEverything(size);
  }

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.items = Array.from(
      this.content.nativeElement.children
    ) as HTMLElement[];

    const size = this.getActualSize();
    this.calculateEverything(size);
  }

  public slideNext(): void {
    const { step, space } = this.carouselSettings;
    const size = this.getActualSize();
    const maxRightPosition =
      (this.items.length - size) * (this.itemWidth + space);

    if (Math.abs(this.position) < maxRightPosition) {
      this.position -= (this.itemWidth + space) * step;
    }
  }

  public slidePrev(): void {
    if (this.position < 0) {
      const { step, space } = this.carouselSettings;
      this.position += (this.itemWidth + space) * step;
    }
  }

  private calculateEverything(size: number): void {
    const { space } = this.carouselSettings;
    const carouselWidth =
      this.carousel.nativeElement.getBoundingClientRect().width;
    this.totalSpace = space * size;
    this.itemWidth = (carouselWidth - this.totalSpace) / size;

    this.items.forEach((item) => {
      this.renderer.setStyle(item, 'flex-shrink', 0);
      this.renderer.setStyle(item, 'display', 'inline-block');
      this.renderer.setStyle(item, 'min-width', this.itemWidth + 'px');
      this.renderer.setStyle(item, 'max-width', this.itemWidth + 'px');
      this.renderer.setStyle(item, 'margin-right', space + 'px');
      this.renderer.setStyle(item, 'box-sizing', 'border-box');
    });
  }

  private getActualSize(): number {
    const size = window.innerWidth < 1024 ? 1 : this.carouselSettings.size;

    return size;
  }
}
