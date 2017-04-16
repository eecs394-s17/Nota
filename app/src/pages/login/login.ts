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
  email2:string = "";
  password2:string = "";

  constructor(private http: Http, private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {}

  public createAccount() {
    this.nav.push(RegisterPage);
  }

  public login() {
    //this.showLoading()
    // this.auth.login(this.registerCredentials).subscribe(allowed => {
    //   if (allowed) {
    //     setTimeout(() => {
    //     this.loading.dismiss();
    //     this.nav.setRoot(TabsPage)
    //     });
    //   } else {
    //     this.showError("Access Denied");
    //   }
    // },
    // error => {
    //   this.showError(error);
    // })
    this.makeGetRequest(this.registerCredentials);

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

  makeGetRequest(credentials) {
    this.http.get("http://0.0.0.0:5000/api/v1/users")
      .subscribe(data => {
        var res = data.json();
        this.email2 = res["users"][0]["email"];
        this.password2 = res["users"][0]["password"];
        console.log(res["users"][0]["email"]);
        console.log(res["users"]);
        console.log(res);
        console.log("password2 in get request: " + this.password2);
        this.checker();
      })
  }

  checker() {
    if (this.password2 == this.registerCredentials.password && this.email2 == this.registerCredentials.email)
    {
      console.log("YAY THIS IS GOOD");
      this.nav.setRoot(TabsPage);
    }
    else {
      console.log("NO THIS IS BAD")
    }


  }

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


}
