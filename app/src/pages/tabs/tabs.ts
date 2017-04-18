import { Component } from '@angular/core';

import { NotesPage } from '../notes/notes';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page

  tab1Root: any = NotesPage;
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;

  constructor() {

      console.log("IDDDDDDDD");
      console.log(localStorage.getItem('id');)

  }
}
