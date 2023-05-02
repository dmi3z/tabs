import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
// import { TabsModule } from './components/tabs/tabs.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from './components/table/table.module';
import { SpeccompComponent } from './speccomp/speccomp.component';
import { CarouselComponent } from './components/carousel/carousel.component';

@NgModule({
  declarations: [AppComponent, SpeccompComponent, CarouselComponent],
  imports: [BrowserModule, ReactiveFormsModule, TableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
