import { Plugins } from '../../services/plugins.service';
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {UploadingPage} from '../uploading/uploading';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
<<<<<<< HEAD

	images: Array<string> = [];

  constructor(private plugins: Plugins, public navCtrl: NavController) {
=======
  uploadingPage = UploadingPage;
  constructor(public navCtrl: NavController) {
>>>>>>> 3315bb73644d270c557f0cdcce5e9d75ddff8339

  }

   openAlbums = () : void => {
        this.plugins.albums.open().then((imgUrls) => {            
            imgUrls.forEach((imageUrl: string) : void => {
                if(imageUrl){                  
                  this.images.push(imageUrl);
                }
            }); 
        });        
    }
      
    openCamera = () : void => { 
        this.plugins.camera.open().then((imageUrl) => { 
          if(imageUrl) {
            this.images.push(imageUrl);            
          }
      });
    }
    
    


}
