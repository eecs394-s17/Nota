import { Plugins } from '../../services/plugins.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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
	public base64Image: string; //unused var, delete?
	public form = this.fb.group({
		  title: ["", Validators.required],
    	course: ["", Validators.required], //validator not working because submit button fires post function on click
    	description: ["", Validators.required],
    	price: ["", Validators.compose([Validators.pattern('^[0-9]+$'),Validators.required])]
      // images: [[], Validators.required]
	});
	uploadingPage = UploadingPage;

  constructor(private http: Http, private navCtrl: NavController, private plugins: Plugins, public fb: FormBuilder) {
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
				'notes': this.images[0],
        'title': this.form.value.title,
				'course': this.form.value.course,
				'description': this.form.value.description,
				'price': this.form.value.price,
        'user_id': 5 //we want to grab id from localStorage?
    };
    console.log(this.images[0]);

    console.log(data1);



    // this.http.post("http://127.0.0.1:5000/api/v1/notes", data1)

    this.http.post("http://34.209.98.85:5000/api/v1/notes", data1)
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

    this.navCtrl.push(UploadingPage);
    // This may not be the best way to load it, try passing it  via navCtrl
    var base64image = document.getElementById("upload_img");
    base64image.innerHTML = "<img src='data:image/jpeg;base64,"+data1.notes+ "'>";

}}








