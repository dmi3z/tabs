import { NgModule, ViewContainerRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LookupInputModule } from 'lookup-input';
import { MultiselectDropdownModule } from 'multiselect-dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from './components/tabs/tabs.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    LookupInputModule,
    MultiselectDropdownModule,
    ReactiveFormsModule,
    TabsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
