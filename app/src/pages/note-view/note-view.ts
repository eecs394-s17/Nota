import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { Http } from '@angular/http';

// import {Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';

import { DomSanitizer } from '@angular/platform-browser';

import { PaymentPage } from '../payment/payment';
import 'rxjs/add/operator/map'


declare var cordova: any;
/*
  Generated class for the NoteView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-note-view',
  templateUrl: 'note-view.html',
  providers: [Base64ToGallery]

})
export class NoteViewPage {
  item: {title: string, course: string, upload_date: string, price: string, note: string, description: string};
  title:string = "";
  course:string = "";
  upload_date:string = "";
  price:string = "";
  note:any;
  description:string = "";
  noteID:number;
  base64:string = "";


  constructor(private _domSanitizer: DomSanitizer, private base64ToGallery: Base64ToGallery, public navCtrl: NavController, public navParams: NavParams, public plt: Platform, public http: Http) {
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



  download(){
    this.base64ToGallery.base64ToGallery(this.base64, { prefix: '_img', mediaScanner: true }).then(
      res => console.log('Saved image to gallery ', res),
      err => console.log('Error saving image to gallery ', err)
    );

  }

  goToPayment() {
    this.navCtrl.push(PaymentPage);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteViewPage');
    this.title = this.navParams.get('title');
    this.course = this.navParams.get('course');
    this.upload_date = this.navParams.get('upload_date');
    this.description = this.navParams.get('description');
    this.price = this.navParams.get('price');
    this.note = this._domSanitizer.bypassSecurityTrustUrl("data:image/jpeg;base64," + this.navParams.get('note'));
    this.noteID = this.navParams.get('noteID');

    this.http.get("http://34.209.98.85:5000/api/v1/notes" + "?id=" + this.noteID)
        .subscribe(data => {
          var res = data.json();
          var base64 = res["notes"];
          this.base64 = base64;
          this.note = this._domSanitizer.bypassSecurityTrustUrl("data:image/jpeg;base64," + base64);
        })


    console.log("note is...:");
    console.log(this.note);
  }

  public get image() {
    return this.note;
  }


}

function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
