import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';


/*
  Generated class for the Payment page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage {
  require : any;
  link: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

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
          var photo = response.data.link;
          console.log(photo);
          link = photo;
          var photo_hash = response.data.deletehash;
        },
        cache: false,
        contentType: false,
        processData: false
      });
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
