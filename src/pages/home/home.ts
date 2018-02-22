import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';
import { ɵConsole } from '@angular/core/core';
import { Console } from '@angular/compiler/src/util';
import { ViewChild } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Component, NgZone } from '@angular/core';

import { Platform } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Content } from 'ionic-angular';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Constants } from './constants'

declare var ApiAIPromises: any;
declare var skuNumber: any;
declare var oh: any;
export class Message {
  constructor(public content: string, public sentBy: string, public title: string, public image: string, 
    public text: string, public button: string, public buttonUrl: string, public displayBulb: boolean) {}
}
export class BulbDetails {
  constructor(public image: string, public title: string, public content: string, public rate: string, public button: string,
  public buttonUrl:string) {}
}
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  skuNumber = '';
  oh = '';
  myMessage : Message;
  messages = [];
  bulbon = false;
  slides= [];
  @ViewChild(Content) content: Content;
  public question;
  pet: string = "kittens";
  constructor(public platform: Platform, public ngZone: NgZone, private speechRecognition: SpeechRecognition,
  private tts: TextToSpeech, public http: Http, public modalCtrl: ModalController) {
    // console.log(" on constructor");
    // platform.ready().then(() => {
    // console.log("platform ready for api.ai call");
    //   ApiAIPromises.init({
    //     clientAccessToken: "09af47400a3441c6ad33b01ca04b3531"
    //   })
    //   // .then((result) =>  console.log(result)),
    //   // function(error) { console.log(error) }
    //   .then((data) => {
    //       console.log('ApiAi initialised');
    //       console.log(data);
    //     }).catch((error) => {
    //       console.error('ApiAi Error: ',error)
    //     });
        
    // });
  }

  openModal(message) {
    let modal = this.modalCtrl.create(ModalContentPage, message, {showBackdrop: false});
    modal.onDidDismiss(data => {
      this.oh = data;
      //this.messages.push(Constants.myMessageConstant);
    });
    this.speak("Please click on the text field to change OnHand");
    modal.present();
  }

  ngAfterViewChecked() {
    this.scrollToTop();
  }

  scrollToTop() {
    this.content.scrollToBottom();
  }

  ngOnInit() {
    console.log("on init");
 this.platform.ready().then(() => {
   console.log("platform ready for speech recognition");
  console.log("platform ready");
  console.log(this.speechRecognition.hasPermission());
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {

        if (!hasPermission) {
        this.speechRecognition.requestPermission()
          .then(
            () => console.log('Granted'),
            () => console.log('Denied')
          )
        }

      }); 
    })

  }

  ask(question) {
       
    //this.speak(question);
    console.log(question);
    this.question = '';
    this.messages.push(new Message(question, "user","","","","","",false));
    this.getBooksWithObservable(question)
	    .subscribe( response => {
        this.ngZone.run(()=> {

        if (response.speech.includes("Hammer")) {
          this.skuNumber = Constants.skuNumber1;
          this.oh = Constants.onHandQuantity1;
          Constants.currentSkuNumber = this.skuNumber;
          Constants.currentOH = this.oh;
          this.myMessage = new Message(response.speech,"bot","Hammer", 
          "https://images.homedepot-static.com/productImages/f1e59730-23fb-4660-ad22-61fef380589a/svn/tekton-claw-hammers-30303-64_1000.jpg", 
          "Sku Name: Hammer","Click for Hammer", "",false);
          Constants.myMessageConstant = this.myMessage;
            this.messages.push(this.myMessage);
         }
         else if(response.speech.includes("Sewing Machine")) {
          this.skuNumber = Constants.skuNumber2;
          this.oh = Constants.onHandQuantity2;
          Constants.currentSkuNumber = this.skuNumber;
          Constants.currentOH = this.oh;
           this.myMessage = new Message(response.speech,"bot","Sewing machine", 
           "https://images.homedepot-static.com/productImages/dd70303c-dbf0-423e-8a9f-fffc189897f8/svn/black-janome-sewing-machines-001hd1000be-64_1000.jpg", 
           "Sku Name: Sewing Machine","Click for Sewing Machine", "", false);
           Constants.myMessageConstant = this.myMessage;
          this.messages.push(this.myMessage);
         }

         else if(response.speech.includes("Please input the new OH quantity")) {
          this.openModal({details: this.myMessage});
         }

         else if(response.speech.includes("bulb")) {
          this.bulbon = true;
          type Statuses = Array<BulbDetails>;

          var statuses: Statuses = [
            new BulbDetails("https://images.homedepot-static.com/productImages/7aea5fdc-5a1d-4a4e-a5f0-bff644499525/svn/philips-colored-light-bulbs-463166-64_1000.jpg",
        "Non Dimmable LED", "60-Watt Equivalent Blue A19 Non-Dimmable Autism Speaks LED Light Bulb",
      "$5","Click to buy this", ""),
            new BulbDetails("https://images.homedepot-static.com/productImages/647af41c-23f8-426b-90a3-d8c74f837eb8/svn/philips-colored-light-bulbs-463224-64_1000.jpg",
            "Non Dimmable LED", "60-Watt Equivalent Green A19 Non-Dimmable Autism Speaks LED Light Bulb",
          "$5","Click to buy this", ""),
          new BulbDetails("https://images.homedepot-static.com/productImages/c3010681-0747-417c-927e-2ced1fdbd00b/svn/philips-colored-light-bulbs-469080-64_1000.jpg",
        "LED Flood Light Bulb", "90W Equivalent PAR38 Yellow LED Flood Light Bulb",
      "$10","Click to buy this", ""),
      new BulbDetails("https://images.homedepot-static.com/productImages/f7d47d59-75e9-46fc-9421-5eb273d78e96/svn/feit-electric-colored-light-bulbs-a19-tpk-led-sgk-64_1000.jpg",
      "Dimmable LED", "25W Equivalent Pink-Colored A19 Dimmable LED Clear Glass Light Bulb",
    "$15","Click to buy this", "")
];
this.slides = statuses;
      this.messages.push(new Message("These are the top available light bulbs","bot","","","","","",true));
        response.speech = "These are the top available light bulbs";

         }
         
         else {
          this.messages.push(new Message(response.speech,"bot","","","","","",false));
         }
         if(!response.speech.includes("Please input the new OH quantity"))
         this.speak(response.speech);
         });
      }); 
    // .then(({result: {fulfillment: {speech}}}) => {
    //   console.log(speech);
    //    this.ngZone.run(()=> {
         
    //    });
    // }),
    //function(error) { console.log(error) }
  }

  func() {
    this.oh = Constants.currentOH;
  }

  getBooksWithObservable(question): Observable<any> {
    var body = {
	"inputText" : ""+question
};
        return this.http.post("https://apiai-test-poc.cfapps.io/apiai/getSpeech",body)
		   .map(this.extractData)
		   .catch(this.handleErrorObservable);
    }

    private extractData(res: Response) {
	let body = res.json();
        return body || {};
    }
    private handleErrorObservable (error: Response | any) {
	console.error(error.message || error);
	return Observable.throw(error.message || error);
    }

  startVoice() {
    this.speechRecognition.startListening()
  .subscribe(
    (matches: Array<string>) => {
      this.ask(matches[0]);
    },
    (onerror) => console.log('error:', onerror)
  )

  }

  speak(msg) {
    this.tts.speak(msg)
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
  }
 }

@Component({
  templateUrl: 'modal-content.html'
})
 export class ModalContentPage {
  message;
  pet: string = "puppies";
  newOh = "";
  skuNumber= Constants.currentSkuNumber;
  oh = Constants.currentOH;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public speechRecognition: SpeechRecognition,
    private tts: TextToSpeech,
    public homepage: HomePage,
    private alertCtrl: AlertController
  ) {
    this.message = this.params.get('details');
    this.skuNumber = Constants.currentSkuNumber;
    this.oh = Constants.currentOH;
  }

  
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm OH Change',
      message: 'Do you want to confirm the OH Change?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.oh = this.newOh;
            if(Constants.skuNumber1 === this.skuNumber) {
                Constants.onHandQuantity1 = this.oh;
            }
            else {
              Constants.onHandQuantity2 = this.oh;
            }
            this.homepage.func();
           // console.log(this.homepage.messages);
            // this.homepage.pushMessage(Constants.myMessageConstant);
            this.speak("OnHand quantity updated successfully");
          }
        }
      ]
    });
    this.speak("Are you sure to proceed");
    alert.present();
  }
  

  startVoice() {
    console.log("speech in modal");
    this.speechRecognition.startListening()
  .subscribe(
    (matches: Array<string>) => {
      this.newOh = matches[0];
      this.presentConfirm();
      
    },
    (onerror) => console.log('error:', onerror)
  )


  }

  speak(msg) {
    this.tts.speak(msg)
  .then(() => {if(msg.includes("OnHand quantity updated successfully")) {this.dismiss()} })
  .catch((reason: any) => console.log(reason));
  }

  dismiss() {
    let data = this.oh;
    this.viewCtrl.dismiss(data);
    
  }
}