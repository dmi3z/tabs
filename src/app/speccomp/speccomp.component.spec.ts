import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeccompComponent } from './speccomp.component';

describe('SpeccompComponent', () => {
  let component: SpeccompComponent;
  let fixture: ComponentFixture<SpeccompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeccompComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeccompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
