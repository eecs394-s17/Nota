import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { Http } from '@angular/http';


import { dataSrvc } from './data.service';

import 'rxjs/add/operator/map'

/*
  Generated class for the NoteView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-note-view',
  templateUrl: 'note-view.html'
})
export class NoteViewPage {
  item: {courseName: string, userName: string, date: string, price: string, note: string};
  courseName:string = "";
  userName:string = "";
  date:string = "";
  price:string = "";
  note:string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, public http: Http) {
//     this.plt.ready().then((readySource) => {
//       console.log('Platform ready from', readySource);
//       this.http.get("http://127.0.0.1:5000/api/v1/notes")
//         .subscribe(data => {
//           var res = data.json();
//           // this.items.push( { courseName: res['courseName'],}) etc.
//           this.note = res["all_notes"];
//           //this.notes.push(res["notes"]); // Stores notes data from get request in notes
//           console.log('yay notes in note-view')
//   })


// })
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteViewPage');
    this.courseName = this.navParams.get('courseName');
    this.userName = this.navParams.get('userName');
    this.date = this.navParams.get('date');
    this.price = this.navParams.get('price');
    this.note = this.navParams.get('note');
    console.log("note is...: ");
    console.log(this.note);
  }



}
