import { Plugins } from '../../services/plugins.service';
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {UploadingPage} from '../uploading/uploading';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	images: Array<string> = [];
	public base64Image: string;
	uploadingPage = UploadingPage;
  constructor(private plugins: Plugins, private navCtrl: NavController) {


  }

   openAlbums = () : void => {
        this.plugins.albums.open().then((imgUrls) => {            
            if(imgUrls) {
            this.images.push(imgUrls);            
          } 
        });        
    }
      
    openCamera = () : void => { 
        this.plugins.camera.open().then((imageUrl) => { 
          if(imageUrl) {
            this.images.push(imageUrl);            
          }
      });
    }
    
    startUploading = () : void => {
      this.navCtrl.setRoot(UploadingPage, {
          images: this.images
      });
      console.log(this.images);
      }  


}
