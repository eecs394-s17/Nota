import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import {TabsPage} from "../tabs/tabs";

import { Http } from '@angular/http';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = {firstName: '', lastName: '', email: '', password: ''};

  constructor(public http: Http, private nav: NavController, private auth: AuthService, private alertCtrl: AlertController) {}

  public register() {
    this.auth.register(this.registerCredentials).subscribe(success => {
      if (success) {
        this.createSuccess = true;
        this.makePostRequest();
          this.showPopup("Success", "Account created.");
          this.nav.push(TabsPage);

      } else {
        this.showPopup("Error", "Problem creating account.");
      }
    },
    error => {
      this.showPopup("Error", error);
    });
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
       {
         text: 'OK',
         handler: data => {
           if (this.createSuccess) {
             //this.nav.popToRoot();
           }
         }
       }
     ]
    });
    alert.present();
  }

  makePostRequest() {
    var data1 = {
      'firstName': this.registerCredentials.firstName,
      'lastName': this.registerCredentials.lastName,
      'email': this.registerCredentials.email,
      'password': this.registerCredentials.password
    };

    console.log(data1);


    // this.http.post("http://127.0.0.1:5000/api/v1/notes", data1)

    this.http.post("http://34.209.98.85:5000/api/v1/users", data1)
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
  }
}
