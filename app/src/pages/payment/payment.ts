import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Http } from '@angular/http';
import * as $ from 'jquery';

declare var window: any;

/*
  Generated class for the Payment page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
  providers: [File, Transfer, TransferObject]
})
export class PaymentPage {
  require : any;
  link: string;
  photoURL:string = "";

  constructor(public http: Http,public navCtrl: NavController, public platform: Platform, public navParams: NavParams, private file: File, private transfer: Transfer, public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

  getImgurUrl() {
      //var formData = new FormData();
      //console.log(this.navParams.get("notes"));

      var self = this;

      var img = this.navParams.get("notes");
      $.ajax({
        url: "http://api.imgur.com/3/image",
        type: "POST",
        datatype: "base64",
        headers: {
          "Authorization" : "Client-ID 2d00b22f750b942"
        },
        data: img,
        success: function(response) {

          this.photoURL = response.data.link;
          console.log(this.photoURL);
          var photo_hash = response.data.deletehash;
          self.download(this.photoURL);



        },
        cache: false,
        contentType: false,
        processData: false
      });
  }

  upvote()
  {
    console.log("score is "+ this.navParams.get('score'))
    console.log("note_id is "+ this.navParams.get('note_id'))
    var data1 = {
          'score':this.navParams.get('score')+1,
          'note_id': this.navParams.get('note_id') //we want to grab id from localStorage?
      };
      console.log(data1)

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
    console.log("ya i just upvoted");
  }

  downvote()
  {
    var data1 = {
          'score':this.navParams.get('score')-1,
          'note_id': this.navParams.get('note_id') //we want to grab id from localStorage?
      };
      console.log(data1)
      //"http://34.209.98.85:5000/api/v1/notes"
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
    console.log("ya i just down voted");
  }

   download(url) {
    const fileTransfer = new TransferObject();
    let targetPath;
    if(!this.platform.is('cordova')) {
          return false;
    }
    if (this.platform.is('ios')) {
      targetPath = this.file.documentsDirectory + "yo.jpg"; // TODO: use real filename
    }
    else if (this.platform.is('android')) {
      targetPath = this.file.dataDirectory + "yo.jpg"; // TODO: use real filename
    }
    else{
      return false;
    }
    // url = "http://imgur.com/oBi9nEJ.jpg";
    console.log(url);


    fileTransfer.download(url, targetPath).then((entry) => {

        const alertSuccess = this.alertCtrl.create({
          title: `Download Succeeded!`,
          // subTitle: `${image} was successfully downloaded to: ${entry.toURL()}`,
          buttons: ['Ok']
        });

        alertSuccess.present();

      }, (error) => {

        const alertFailure = this.alertCtrl.create({
          title: `Download Failed!`,
          subTitle: `${url}`,
          // subTitle: `${image} was not successfully downloaded. Error code: ${error.code}`,
          buttons: ['Ok']
        });

        alertFailure.present();

      });

      window.cordova.plugins.imagesaver.saveImageToGallery(targetPath, onSaveImageSuccess, onSaveImageError);

      function onSaveImageSuccess() {
    console.log('--------------success');
}

      function onSaveImageError(error) {
          console.log('--------------error: ' + error);
      }

}


  openCheckout() {
  var handler = (<any>window).StripeCheckout.configure({
    key: 'pk_test_12oQnqfg1ThndGJmF98hrkHG',
    locale: 'auto',
    token: function (token: any) {
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.
    }
  });

  handler.open({
    name: 'Demo Site',
    description: '2 widgets',
    amount: 2000
  });

}
}
