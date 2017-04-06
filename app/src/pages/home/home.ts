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
// AKA NotesPage
export class HomePage {
	notes: Array<string> = [];
  items: Array<{courseName: string, userName: string, date: string, price: string, note: string}>;
	posts: any;

  constructor(public navCtrl: NavController, public http: Http, public plt: Platform,) {
    this.items = [];
    for (let i = 1; i < 4; i++) {
      this.items.push({
        courseName: "Kyu's EECS-394 Lecture Note # "+ i,
        userName: 'Kyu',
        date: "Apr "+ i +", 2017",
        price: '$'+ i,
        note: 'This is where the notes text goes. This is Leture #' + i
      });
    }

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

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(HomePage, {
      item: item
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






