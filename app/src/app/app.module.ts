import { Plugins } from '../services/plugins.service';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { NotesPage } from '../pages/notes/notes';
import { TabsPage } from '../pages/tabs/tabs';
import { NoteViewPage } from '../pages/note-view/note-view';
import { PaymentPage } from '../pages/payment/payment';
import {UploadingPage} from "../pages/uploading/uploading";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { AuthService } from '../providers/auth-service';
import * as $ from 'jquery';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    NotesPage,
    TabsPage,
    UploadingPage,
    NoteViewPage,
    LoginPage,
    RegisterPage,
    PaymentPage

  ],
  imports: [
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    NotesPage,
    TabsPage,
    UploadingPage,
    NoteViewPage,
    LoginPage,
    RegisterPage,
    PaymentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Plugins,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
