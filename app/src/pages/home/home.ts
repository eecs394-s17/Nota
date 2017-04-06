import { Component, OnInit } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

import { Http } from '@angular/http';

import { dataSrvc } from './data.service';

import 'rxjs/add/operator/map'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	notes: Array<string> = [];
	posts: any;

  constructor(public navCtrl: NavController, public http: Http, public plt: Platform) {

  	this.plt.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      this.http.get("http://sebastianperez.pythonanywhere.com/api/v1/notes")
      	.subscribe(data => {
      		var res = data.json();
      		this.notes.push(res["notes"]); // Stores notes data from get request in notes
      		console.log(this.notes);
      	});
      
    });

  }


  // makeGetRequest = () : void => {
  //     // this.navCtrl.setRoot(UploadingPage, {
  //     //     images: this.images
  //     // });
  //     console.log(this.test);
  //     }  




	// ngOnInit() {
 //        return this.service.getComments().then(data => this.comments = data);
 //    }



}

// $scope.doThisFunction = function(){
//     document.getElementById("test").innerHTML = "AJOOAOA";
// };






