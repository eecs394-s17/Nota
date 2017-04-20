import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
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
