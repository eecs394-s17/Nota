import {Injectable} from "@angular/core";
import {Camera} from 'ionic-native';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'underscore';

@Injectable()
export class Plugins {
    
    constructor(private _domSanitizer: DomSanitizer) { }     
    
    // albums = {            
    //     open () : Promise<any>  { 
    //         return ImagePicker.getPictures({
    //                 quality: 100, 
    //                 outputType: 1,                       
    //                 maximumImagesCount: 1
    //         }).then((imgUrls) => {
    //             return imgUrls;
    //         }, (err) => {                                   
    //             if(err.error == "cordova_not_available") {               
    //                 alert("Cordova is not available, please make sure you have your app deployed on a simulator or device");                                   
    //             } else {                
    //                 console.log("Failed to open albums: " + err.error);
    //             }
    //         });
    //     },         
    // }
    albums = {       
        open () : Promise<any>  {
            let options = {
                destinationType: 0,
                sourceType: 0,
                encodingType: 0,
                quality:100,
                allowEdit: true,
                saveToPhotoAlbum: false,            
            };        
            return Camera.getPicture(options).then((imgUrl) => {
                return imgUrl;
            }, (err) => {                
                if(err.error == "cordova_not_available") {
                    alert("Cordova is not available, please make sure you have your app deployed on a simulator or device");            
                } else {
                    console.log("Failed to open camera: " + err.error);                
                }    
            });
        } 
    }  
    camera = {       
        open () : Promise<any>  {
            let options = {
                destinationType: 0,
                sourceType: 1,
                encodingType: 0,
                quality:100,
                allowEdit: false,
                saveToPhotoAlbum: true,            
                correctOrientation: true,
            };        
            return Camera.getPicture(options).then((imgUrl) => {
                return imgUrl;
            }, (err) => {                
                if(err.error == "cordova_not_available") {
                    alert("Cordova is not available, please make sure you have your app deployed on a simulator or device");            
                } else {
                    console.log("Failed to open camera: " + err.error);                
                }    
            });
        } 
    }  
}