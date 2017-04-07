import { Component, OnInit } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

import { Http } from '@angular/http';

import { dataSrvc } from './data.service';

import 'rxjs/add/operator/map'
import { NoteViewPage } from '../note-view/note-view';
@Component({
  selector: 'page-home',
  templateUrl: 'notes.html'
})
// AKA NotesPage
export class NotesPage {
	notes: Array<string> = [];
  items: Array<{courseName: string, userName: string, date: string, price: string, note: string}>;
	posts: any;

  constructor(public navCtrl: NavController, public http: Http, public plt: Platform,) {
    this.items = [];
    // for (let i = 1; i < 4; i++) {
    //   this.items.push({
    //     courseName: "Kyu's EECS-394 Lecture Note # "+ i,
    //     userName: 'Kyu',
    //     date: "Apr "+ i +", 2017",
    //     price: '$'+ i,
    //     note: 'This is where the notes text goes. This is Leture #' + i
    //   });
    // }

  	this.plt.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      this.http.get("http://127.0.0.1:5000/api/v1/notes") 
      	.subscribe(data => {
      		var res = data.json();
      		// this.items.push( { courseName: res['courseName'],}) etc.
          var all_notes = res["all_notes"];
          console.log(all_notes.length);
          for (let i = 0; i< all_notes.length; i++){
            console.log(all_notes[i]);
            this.items.push({
              courseName: all_notes[i].course,
              userName: all_notes[i].name,
              date: "Apr "+ i +", 2017",
              price: all_notes[i].price,
              note: all_notes[i].notes
            });

          }

        //   this.items[0].note = res["notes"];
      		// this.notes.push(res["notes"]); // Stores notes data from get request in notes

 



      	});

    });



  }

  launchNoteViewPage(item) {
    console.log("note view page launch")
    this.navCtrl.push(NoteViewPage,item);
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(NotesPage, {
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






