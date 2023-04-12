import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from './components/tabs/tabs.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ReactiveFormsModule, TabsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
