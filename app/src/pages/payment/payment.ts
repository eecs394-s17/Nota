import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private file: File, private transfer: Transfer, public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

  getImgurUrl() {
      //var formData = new FormData();
      //console.log(this.navParams.get("notes"));
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
          //console.log(response);
          //var photo = response.data.link;
          //console.log(photo);
          //link = photo;
          this.photoURL = response.data.link;
          console.log(this.photoURL);
          var photo_hash = response.data.deletehash;
        },
        cache: false,
        contentType: false,
        processData: false
      });

      this.download(this.photoURL);


  }

   download(url) {
    const fileTransfer = new TransferObject();
    let targetPath;
    // if(!this.platform.is('cordova')) {
    //       return false;
    // }
    // if (this.platform.is('ios')) {
      
    targetPath = this.file.documentsDirectory + "yo.jpg";
    url = "http://imgur.com/oBi9nEJ.jpg";
    console.log(url);
    // console.log(this.noteID);


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
