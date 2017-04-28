import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import {LoginPage} from "../login/login";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  logout() {
    this.navCtrl.push(LoginPage);
    localStorage.clear();
  }

  notes: Array<string> = [];
  items: Array<{title: string, course: string, upload_date: string, price: string, description: string, noteID: number}>;
  posts: any;

  constructor(public navCtrl: NavController, public http: Http, public plt: Platform,) {
    this.items = [];


    this.plt.ready().then((readySource) => {
      console.log('Platform ready from', readySource);

    });

  }


  ionViewDidEnter() {
    console.log('ionViewDidEnter b');
    this.items = [];

    this.http.get("http://34.209.98.85:5000/api/v1/user?user_id="+localStorage.getItem("id"))
        .subscribe(data => {
          var res = data.json();
          console.log(res);

          var users = res["users"];
          console.log(all_users.length);
          for (let i = 0; i< all_users.length; i++){
            console.log(all_users[i]);
            this.items.push({
              password: all_users[i].password,
              id: all_users[i].id,
              email: all_users[i].email,
            });

          }

        });

    this.http.get("http://34.209.98.85:5000/api/v1/notes?user_id="+localStorage.getItem("id"))
        .subscribe(data => {
          var res = data.json();
          console.log(res);

          var all_notes = res["notes"];
          console.log(all_notes.length);
          for (let i = 0; i< all_notes.length; i++){
            console.log(all_notes[i]);
            this.items.push({
              title: all_notes[i].title,
              course: all_notes[i].course,
              upload_date: all_notes[i].upload_date,
              price: all_notes[i].price,
              description: all_notes[i].description,
              noteID: all_notes[i].id
            });

          }

        });
  }

  itemTapped(event, item) {
    this.navCtrl.push(ContactPage, {
      item: item
    });
  }
}
