import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';



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
    let params: URLSearchParams = new URLSearchParams();
    params.set('email', credentials.email);
    params.set('password', credentials.password);

    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    var data1 = {
      'email': credentials.email,
      'password': credentials.password
    };

    var isMatch = false;
    this.http.get("http://52.15.101.44:5000/api/v1/users", requestOptions)
      .subscribe((data) => {
        var res = data.json();
        for (var i = 0; i < res["users"].length; i++) {
          if (credentials.email == res["users"][i]["email"]) {
            if (credentials.password == res["users"][i]["password"]) {

              // setting the userid
              console.log("I have a crush on this user: ", res["users"][i])
              localStorage.setItem('id', res["users"][i]["id"]);
              this.nav.setRoot(TabsPage);

              isMatch = true;
            }
          }
        }
        if (isMatch != true) {
          alert("EMAIL OR PASSWORD IS WRONG!");
        }
        this.email2 = res["users"][0]["email"];
        this.password2 = res["users"][0]["password"];
        // console.log(res["users"][0]["email"]);
        // console.log(res["users"][0]);
        console.log(res);
        //console.log("password2 in get request: " + this.password2);
        //this.checkCredentials();
      })
  }

  checkCredentials() {
    if (this.password2 == this.registerCredentials.password && this.email2 == this.registerCredentials.email)
    {
      console.log("Password is good, redirecting to tabsPage");
      this.nav.setRoot(TabsPage);
    }
    else {
      console.log("Password/Email is wrong, Alerting")
      //this.showError("Email or Password is Wrong");
      //alert("Email or Password is Wrong");
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
