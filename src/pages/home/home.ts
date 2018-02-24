import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';
import { ɵConsole } from '@angular/core/core';
import { Console } from '@angular/compiler/src/util';
import { ViewChild } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Component, NgZone } from '@angular/core';

import { Platform, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
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
  location = '';
  myMessage : Message;
  messages = [];
  bulbon = false;
  slides= [];
  @ViewChild(Content) content: Content;
  public question;
  pet: string = "kittens";
  constructor(public platform: Platform, public ngZone: NgZone, private speechRecognition: SpeechRecognition,
  private tts: TextToSpeech, public http: Http, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController) {
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
  openModalHelp(message) {
    let modal = this.modalCtrl.create(ModalContentPageHelp, message);
    modal.present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Actions Available',
      buttons: [
        {
          text: 'Change OnHands for a SKU',
          handler: () => {
            this.openModalHelp({details: "onhands"});
          }
        },{
          text: 'Change Location for a SKU',
          handler: () => {
            this.openModalHelp({details: "location"});
          }
        }
        ,{
          text: 'Print Overhead Tag for a SKU',
          handler: () => {
            this.openModalHelp({details: "print"});;
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  openModal(message) {
    let modal = this.modalCtrl.create(ModalContentPage, message, {showBackdrop: false});
    modal.onDidDismiss(data => {
      this.oh = Constants.currentOH;
      this.location = Constants.currentLocation;
      //this.messages.push(Constants.myMessageConstant);
    });
    modal.present();
  }

  openModalPrint(message) {
    let modal = this.modalCtrl.create(ModalContentPagePrint,message);
    modal.onDidDismiss(data => {
    });
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
          this.location = Constants.location1;
          Constants.currentSkuNumber = this.skuNumber;
          Constants.currentOH = this.oh;
          Constants.currentLocation = this.location;
          this.myMessage = new Message(response.speech,"bot","Hammer", 
          "https://images.homedepot-static.com/productImages/f1e59730-23fb-4660-ad22-61fef380589a/svn/tekton-claw-hammers-30303-64_1000.jpg", 
          "10 lb. Sledge Hammer with 34 in. Fiberglass Handle","Click for Hammer", "",false);
          Constants.myMessageConstant = this.myMessage;
            this.messages.push(this.myMessage);
            this.speak("The product you searched for is Hammer. It is a 10 lb. Sledge Hammer with 34 in. Fiberglass Handle Hammer");
         }
         else if(response.speech.includes("Sewing Machine")) {
          this.skuNumber = Constants.skuNumber2;
          this.oh = Constants.onHandQuantity2;
          this.location = Constants.location2;
          Constants.currentSkuNumber = this.skuNumber;
          Constants.currentOH = this.oh;
          Constants.currentLocation = this.location;
           this.myMessage = new Message(response.speech,"bot","Sewing machine", 
           "https://images.homedepot-static.com/productImages/dd70303c-dbf0-423e-8a9f-fffc189897f8/svn/black-janome-sewing-machines-001hd1000be-64_1000.jpg", 
           "Janome HD1000 Black Edition Industrial-Grade Sewing Machine","Click for Sewing Machine", "", false);
           Constants.myMessageConstant = this.myMessage;
          this.messages.push(this.myMessage);
          this.speak("The product you searched for is Sewing machine. It is a Janome HD1000 Black Edition Industrial-Grade Sewing Machine");
         }

         else if(response.speech.includes("Please input the new OH quantity")) {
           Constants.change = "New OnHands Value";
           Constants.changeValue = "Change OnHands Value";
          this.openModal({details: this.myMessage});
         }

         else if(response.speech.includes("Please input the new location")) {
          Constants.change = "New Location Value";
          Constants.changeValue = "Change Location Value";
         this.openModal({details: this.myMessage});
        }

        else if(response.speech.includes("print")) {
         this.openModalPrint({details: this.myMessage});
        }

        else if(response.speech.includes("These are the available actions in the app. Please click on the help topics and i will guide you on each of those actions")) {
          this.presentActionSheet();
          this.speak(response.speech);
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
        this.speak("These are the top available light bulbs in home depot. You can slide over the content to see all the top bulbs available.")

         }
         
         else {
          this.messages.push(new Message(response.speech,"bot","","","","","",false));
          this.speak(response.speech);
         }
        
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
  location = Constants.currentLocation;
   change = Constants.change;
   changeValue = Constants.changeValue;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public speechRecognition: SpeechRecognition,
    private tts: TextToSpeech,
    public homepage: HomePage,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.change = Constants.change;
    this.changeValue = Constants.changeValue;
    this.message = this.params.get('details');
    this.skuNumber = Constants.currentSkuNumber;
    this.oh = Constants.currentOH;
    this.location = Constants.currentLocation;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      var speech = "Please click on the text field to change Location";
    if(Constants.change === "New Location Value") {
      speech = "Please click on the text field to change Location";
    }
    else {
      speech = "Please click on the text field to change OnHands"
    }
    this.speak(speech);
    }, 1000);
    
  }
  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  
  presentConfirm() {
    var tit = '';
    var mess = '';
    if(Constants.change === "New Location Value") {
      tit = "Confirm Location Change";
      mess = "Do you want to confirm the Location Change?";
    }
    else {
      tit = "Confirm OH Change";
      mess = "Do you want to confirm the OH Change?";
    }
    let alert = this.alertCtrl.create({

      title: tit,
      message: mess,
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
            if(Constants.change === "New Location Value") {
              this.location = this.newOh;
            if(Constants.skuNumber1 === this.skuNumber) {
                Constants.location1 = this.oh;
            }
            else {
              Constants.location2 = this.oh;
            }
            this.homepage.func();
           // console.log(this.homepage.messages);
            // this.homepage.pushMessage(Constants.myMessageConstant);
            this.presentToast("Location details updated successfully");
            this.speak("Location details updated successfully");
            }
            else {
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
              this.presentToast("OnHand quantity updated successfully");
              this.speak("OnHand quantity updated successfully");
            }
            
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
  .then(() => {if(msg.includes("OnHand quantity updated successfully") ||
msg.includes("Location details updated successfully")) {this.dismiss()} })
  .catch((reason: any) => console.log(reason));
  }

  dismiss() {
    let data = this.oh;
    this.viewCtrl.dismiss(data);
    
  }
}





@Component({
  templateUrl: 'modal-content-print.html'
})
 export class ModalContentPagePrint {
skuNumber;
image;
message;
quantity;
print;
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public tts: TextToSpeech,
    public speechRecognition: SpeechRecognition,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.skuNumber = Constants.currentSkuNumber;
    this.message = this.params.get('details');
    this.image = this.message.image;
    this.quantity = '';
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.speak("Please input the quantity for the tag by clicking on the quantity text field");
    }, 1000);
    
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Tag Printed Successfully',
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      
    });
  
    toast.present();
  }
  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Printing....'
    });
  
    loading.onDidDismiss(() => {
      this.presentToast();
    this.speak("The given tag was printed successfully.");
    });

    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }
  startVoice() {
    console.log("speech in modal");
    this.speechRecognition.startListening()
  .subscribe(
    (matches: Array<string>) => {
      this.quantity = matches[0];
      this.speak("Are you ready to print the tag with the given details. If yes, please say print in the next voice input screen or say cancel. You can always print the tag using the print button at the bottom of the page.")
      
    },
    (onerror) => console.log('error:', onerror)
  )}

  startVoiceForPrint() {
    console.log("speech in modal");
    this.speechRecognition.startListening()
  .subscribe(
    (matches: Array<string>) => {
      this.print = matches[0];
      if(this.print === 'print' || 'Print' || 'prind') {
        this.printMethod();

      } else {
          this.speak("print cancelled. You can always print the tag by clicking print button at the bottom of the page.")
      }
    },
    (onerror) => console.log('error:', onerror)
  )}

  printMethod() {
    this.presentLoadingDefault();
    
    
  }
  presentConfirm() {
    let alert = this.alertCtrl.create({

      title: 'Confirm Print',
      message: "Are you sure to print the Overhead Tag?",
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
            this.speak("Overhead Tag Printed Successfully");
           
            
          }
        }
      ]
    });
    this.speak("Are you sure to proceed");
    alert.present();
  

  }
  speak(msg) {
    this.tts.speak(msg)
  .then(() => {if(msg.includes("The given tag was printed successfully.")) {this.dismiss()}
else if(msg.includes("Are you ready to print the tag with the given details. If yes, please say print in the next voice input screen or say cancel. You can always print the tag using the print button at the bottom of the page.")) 
{this.startVoiceForPrint();} })
  .catch((reason: any) => console.log(reason));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}


@Component({
  templateUrl: 'modal-content-help.html'
})
 export class ModalContentPageHelp {
howToTitle = '';
items;
message;
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public tts: TextToSpeech,
    public speechRecognition: SpeechRecognition,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.message = this.params.get('details');
    if(this.message === "onhands") {
      this.howToTitle = "How to change OnHands?";
      this.items = ["1. Input the SkuNumber in the home page", "2. Once the card is displayed for the sku", "3. Input command change onhands","4. or Input change oh", "5. Click on the change Oh field","6. Input New OnHands", "7. Confirm the change"];
    }

    else if(this.message === "location") {
      this.howToTitle = "How to change Location?";
      this.items = ["1. Input the SkuNumber in the home page", "2. Once the card is displayed for the sku", "3. Input command change location","4. or Input change loc", "5. Click on the change Location field","6. Input new Location", "7. Confirm the change"];
    }
    else if(this.message === "print") {
      this.howToTitle = "How to Print Overhead tag?";
      this.items = ["1. Input the SkuNumber in the home page", "2. Once the card is displayed for the sku", "3. Input command print tag","4. or print overhead tag", "5. Click on the change quantity field","6. Input new quantity", "7. Confirm the Print"];
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if(this.message === "onhands") {
        this.speak("To Change OnHands for a sku, do the following  ."+
      "Input the sku number in the home page.   and Once the card is displayed for the sku."+
    "  input the command change on hands or change oh. Click on the change oh field and input the new oh value."+
  "   After that, confirm the changes");
        
      }
  
      else if(this.message === "location") {
        this.speak("To Change Location for a sku, do the following  ."+
      " Input the sku number in the home page.   and Once the card is displayed for the sku."+
    " input the command change location or change loc.  Click on the change location field and input the new location value."+
  "   After that, confirm the changes");
      }
      else if(this.message === "print") {
        this.speak("To Print tag for a sku, do the following  ."+
      "Input the sku number in the home page.    and Once the card is displayed for the sku. "+
    "  input the command print tag or print overhead tag. Click on the quantity field and input the new quantity."+
  "   After that, confirm the print");
      }
    }, 1000);
    
  }


  speak(msg) {
    this.tts.speak(msg)
  .then(() => {return "completed"})
  .catch((reason: any) => console.log(reason));
  }
   
  dismiss() {
    this.speak("");
    this.viewCtrl.dismiss();
  }
  ngOnDestroy() {
    this.speak("");
  }
}