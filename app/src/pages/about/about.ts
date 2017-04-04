import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {UploadingPage} from '../uploading/uploading';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  uploadingPage = UploadingPage;
  constructor(public navCtrl: NavController) {

  }



}
