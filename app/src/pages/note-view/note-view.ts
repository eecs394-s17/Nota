import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { Http } from '@angular/http';

import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

// import { Base64ToGallery } from '@ionic-native/base64-to-gallery';

import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { PaymentPage } from '../payment/payment';
import 'rxjs/add/operator/map'

declare var FileUploadOptions: any;

// declare var cordova: any;
/*
  Generated class for the NoteView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-note-view',
  templateUrl: 'note-view.html',
  providers: [File, Transfer, TransferObject]
})
export class NoteViewPage {

  item: {title: string, course: string, upload_date: string, price: string, note: string, description: string};
  title:string = "";
  course:string = "";
  upload_date:string = "";
  price:string = "";
  note:any;
  description:string = "";
  note_id:number;
  base64:string = "";
  score:number;
  public form = this.fb.group({
      passcode: ["", Validators.required]
  });




  constructor(public fb: FormBuilder, private _domSanitizer: DomSanitizer, public alertCtrl: AlertController, private file: File, private transfer: Transfer, public navCtrl: NavController, public navParams: NavParams, public plt: Platform, public http: Http) {
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



//   download() {
//     const fileTransfer = new TransferObject();
//     let targetPath;
//     // if(!this.platform.is('cordova')) {
//     //       return false;
//     // }
//     // if (this.platform.is('ios')) {

//     targetPath = this.file.documentsDirectory + "yo.jpg";
//         // }
//     // else if(this.platform.is('android')) {
//     //       targetPath = this.file.dataDirectory + this.noteID;
//     // }
//     // console.log("encod   becomes ", encodeURI(atob(this.base64)));
//     var image = this.base64;
//     // var ext = image.split(';')[0].match(/jpeg|png|gif/)[0];
//     // var buf = new Buffer(image, 'base64');
//     // console.log("buf is ", buf);
//     // this.file.writeFile(this.file.documentsDirectory, "test.jpg", atob(image));
//     console.log(targetPath);
//     // console.log(this.noteID);
//     var url = "http://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/1966.png";
//     fileTransfer.download(url, targetPath);

//     fileTransfer.download(url, targetPath).then((entry) => {

//         const alertSuccess = this.alertCtrl.create({
//           title: `Download Succeeded!`,
//           subTitle: `${image} was successfully downloaded to: ${entry.toURL()}`,
//           buttons: ['Ok']
//         });

//         alertSuccess.present();

//       }, (error) => {

//         const alertFailure = this.alertCtrl.create({
//           title: `Download Failed!`,
//           subTitle: `${image} was not successfully downloaded. Error code: ${error.code}`,
//           buttons: ['Ok']
//         });

//         alertFailure.present();

//       });


// }

  goToPayment() {
    let noteDict = { "notes":this.base64, "note_id":this.note_id,"score":this.score};
    console.log('noteDict is...')
    console.log(noteDict)
    this.navCtrl.push(PaymentPage,noteDict);
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteViewPage');
    this.title = this.navParams.get('title');
    this.course = this.navParams.get('course');
    this.upload_date = this.navParams.get('upload_date');
    this.description = this.navParams.get('description');
    this.price = this.navParams.get('price');
    // this.note = this._domSanitizer.bypassSecurityTrustUrl("data:image/jpeg;base64," + this.navParams.get('note'));
    this.note_id = this.navParams.get('noteID');
    this.score = this.navParams.get('score');

    this.http.get("http://34.209.98.85:5000/api/v1/notes" + "?id=" + this.note_id)
        .subscribe(data => {
          var res = data.json();
          var base64 = res["notes"];
          this.base64 = base64;
          this.note = this._domSanitizer.bypassSecurityTrustUrl("data:image/jpeg;base64," + base64);
        })


    console.log("note is...:");
    //console.log(this.note);
  }

  public get image() {
    return this.note;
  }


}
