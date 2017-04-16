import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { Http } from '@angular/http';


 
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: Loading;
  registerCredentials = {email: '', password: ''};
 
  constructor(private http: Http, private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {}
 
  public createAccount() {
    this.nav.push(RegisterPage);
  }
 
  public login() {
    this.showLoading()
    this.auth.login(this.registerCredentials).subscribe(allowed => {
      if (allowed) {
        setTimeout(() => {
        this.loading.dismiss();
        this.nav.setRoot(TabsPage)
        });
      } else {
        this.showError("Access Denied");
      }
    },
    error => {
      this.showError(error);
    })
  }



  //   // this.showLoading()
  //   this.auth.login(this.registerCredentials).subscribe(allowed => {
  //     console.log("allowed is");




  //     // if (allowed) {
  //     //   setTimeout(() => {
  //     //   this.loading.dismiss();
  //     //   this.nav.setRoot(TabsPage);
  //     //   });
  //     //   var userExists = this.makeGetRequest();
  //     //   console.log("userexists is ", userExists)
  //     //   if (userExists != {}) {
  //     //     this.nav.push(TabsPage);
  //     //   } else {
  //     //     this.showError("Access Denied");
  //     //   }
        
  //     // } 
  //   },
  //   error => {
  //     console.log("there was error");
  //     this.showError(error);
  //   });
  // }
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }
 
  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  makeGetRequest() {
    var data1 = {
      'email': this.registerCredentials.email,
      'password': this.registerCredentials.password
    };

    console.log(data1);
    // var response = {};

    this.http.get("http://0.0.0.0:5000/api/v1/users", data1)
      .subscribe(data => {
        // var response = data;
        // var alert = Alert.create({
        //     title: "Data String",
        //     subTitle: data.json().data,
        //     buttons: ["close"]
        // });
        // this.nav.present(alert); // I guess this is deprecated line, see http://stackoverflow.com/questions/41932399/ionic2-property-present-does-not-exist-on-type-navcontroller
      }, error => {
        console.log(JSON.stringify(error.json()));
        console.log('fail')
      });
      // return response;
  }

}