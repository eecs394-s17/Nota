import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';


var getStatus;

export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}



/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
// @Injectable()
// export class AuthService {
//   constructor(public http: Http) {
//     console.log('Hello AuthService Provider');
//   }

// }



@Injectable()
export class AuthService {
	constructor(public http: Http) {
    	console.log('Hello AuthService Provider');
  	}
   currentUser: User;
   persistingData: any;
   email2:string = "";
   password2:string= "";

   public login(credentials) {




    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {

        // At this point make a request to your backend to make a real check!
        var loginSuccess = this.makeGetRequest(credentials)
        console.log("login sucess is now ", loginSuccess)
        console.log("pasword2 now in login method: "+ this.password2);
        let access = (credentials.password === this.password2 && credentials.email === this.email2);
        this.currentUser = new User('Simon', 'saimon@devdactic.com');
        observer.next(access);
        observer.complete();
      });
    }
   }

  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

  // public makeGetRequest(credentials): Promise<string> {
  //   var data1 = {
  //     'email': credentials.email,
  //     'password': credentials.password
  //   };
  //   return this.http.get("http://0.0.0.0:5000/api/v1/users", data1)
  //                     .toPromise()
  //                     .then(this.extractData)
  //                     .catch(this.handleError);
  // }

  private extractData(res: Response) {
    // console.log("Extracting")
    let body = res.json();
    console.log("Extracting ", body)
    return body.data || { };
  }

private handleError (error: Response | any) {
  // In a real world app, we might use a remote logging infrastructure
  console.log("handling error")
  let errMsg: string;
  if (error instanceof Response) {
    const body = error.json() || '';
    const err = body.error || JSON.stringify(body);
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  } else {
    errMsg = error.message ? error.message : error.toString();
  }
  console.error(errMsg);
  return Promise.reject(errMsg);
}



  public makeGetRequest(credentials) {
    var data1 = {
      'email': credentials.email,
      'password': credentials.password
    };
    // // this.randomQuote;
    // console.log("credentials are ", data1);
    // // var response = {};
    // this.http.get("http://0.0.0.0:5000/api/v1/users", data1)
    //   .map(res => res.json())
    //   .map(meawesome => {
    //     return meawesome
    //   }).toPromise();
    //   .subscribe(
    //     data => this.persistingData = data,
    //     err => this.logError(err),
    //     () => console.log('Random quote complete' + this.persistingData)
    //
    //   );

      // console.log("data is ", res.text());

      this.http.get("http://0.0.0.0:5000/api/v1/users")
       .subscribe(data => {
         var res = data.json();
         //this.email2 = res["users"][0]["email"];
         //this.password2 = res["users"][0]["password"];
         //console.log(res["users"][0]["email"]);
         //console.log(res["users"]);
         console.log(res);
         //console.log("password2 in get request: " + this.password2);
       })
  }

  // logError(err) {
  //   console.error('There was an error: ' + err);
  // }


  // private extractData(res: Response) {
  //   let body = res.json();
  //   console.log("body is ", body)
  //   return body.data || {};
  // }


  // private handleError (error: Response | any) {
  //   // In a real world app, you might use a remote logging infrastructure
  //   let errMsg: string;
  //   if (error instanceof Response) {
  //     const body = error.json() || '';
  //     const err = body.error || JSON.stringify(body);
  //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  //   } else {
  //     errMsg = error.message ? error.message : error.toString();
  //   }
  //   console.error(errMsg);
  //   return Observable.throw(errMsg);
  // }




  //     .subscribe(data => {

  //       });
  //       for(i=0; i<100;i++) {
  //         var x = i;
  //       }
  //       console.log("entered")
  //       if (status == 200) {
  //         getReturn = true;
  //         // deferred.resolve();
  //       }
  //       // var response = data;
  //       // var alert = Alert.create({
  //       //     title: "Data String",
  //       //     subTitle: data.json().data,
  //       //     buttons: ["close"]
  //       // });
  //       // this.nav.present(alert); // I guess this is deprecated line, see http://stackoverflow.com/questions/41932399/ionic2-property-present-does-not-exist-on-type-navcontroller
  //     }, error => {
  //       console.log(JSON.stringify(error.json()));
  //       console.log('fail')
  //       getReturn = false;
  //       // deferred.resolve();
  //     });
  //     // console.log("getStatus is ", getStatus)
  //     // return response;
  // }



}
