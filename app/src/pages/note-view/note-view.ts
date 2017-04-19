import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { Http } from '@angular/http';

import {Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

import { DomSanitizer } from '@angular/platform-browser';


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
  providers: [Transfer, TransferObject, File]

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


  constructor(private _domSanitizer: DomSanitizer, private transfer: Transfer, private file: File, public navCtrl: NavController, public navParams: NavParams, public plt: Platform, public http: Http) {
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
 fileTransfer: TransferObject = this.transfer.create();


  download(){
    const url = 'http://www.jqueryscript.net/images/Dynamic-Horizontal-Vertical-Image-Slider-Plugin-slideBox.jpg';
    this.fileTransfer.download(url, this.file.documentsDirectory + 'file.pdf').then((entry) => {
    console.log('download complete: ' + entry.toURL());
  }, (error) => {
    // handle error
    console.log("test");
  });
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
          this.note = this._domSanitizer.bypassSecurityTrustUrl("data:image/jpeg;base64," + base64);
        })


    console.log("note is...:");
    console.log(this.note);
  }

  public get image() {
    return this.note;
  }


}
