import { Plugins } from '../../services/plugins.service';
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';


// import {Alert} from 'ionic-framework/ionic'; // no need for Page


import { Http } from '@angular/http';

// import { Http} from '@angular/http';
import {UploadingPage} from '../uploading/uploading';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	images: Array<string> = [];
	public base64Image: string;
	uploadingPage = UploadingPage;

  constructor(private http: Http, private navCtrl: NavController, private plugins: Plugins) {
  	this.http = http;
  	this.navCtrl = navCtrl;

  }

   openAlbums = () : void => {
        this.plugins.albums.open().then((imgUrls) => {            
            if(imgUrls) {
            this.images.push(imgUrls);   
            var base64image = document.getElementById("preview");
		    base64image.innerHTML = "<img src='data:image/jpeg;base64,"+imgUrls+ "'>";       
          } 
        });        
    }
      
    openCamera = () : void => { 
        this.plugins.camera.open().then((imageUrl) => { 
          if(imageUrl) {
            this.images.push(imageUrl);
            var base64image = document.getElementById("preview");
		    base64image.innerHTML = "<img src='data:image/jpeg;base64,"+imageUrl+ "'>";   
          }
      });
    }
    
    startUploading = () : void => {
      this.navCtrl.setRoot(UploadingPage, {
          images: this.images
      });
      console.log(this.images[0]);
      }  


makePostRequest() {
	var data1 = {
				'notes': this.images[0]
    };
    console.log(this.images[0]);
    var base64image = document.getElementById("upload_img");
    base64image.innerHTML = "<img src='data:image/jpeg;base64,"+this.images[0]+ "'>";

    this.http.post("http://sebastianperez.pythonanywhere.com/api/v1/notes", data1)
        .subscribe(data => {
        // var alert = Alert.create({
        //     title: "Data String",
        //     subTitle: data.json().data,
        //     buttons: ["close"]
        // });
        // this.nav.present(alert); // I guess this is deprecated line, see http://stackoverflow.com/questions/41932399/ionic2-property-present-does-not-exist-on-type-navcontroller
    }, error => {
        console.log(JSON.stringify(error.json()));
    });
}}








