import { constantCase } from '@ionic/app-scripts/dist';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';
import { ɵConsole } from '@angular/core/core';
import { Console } from '@angular/compiler/src/util';
import { ViewChild } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Component, NgZone } from '@angular/core';

import { Platform, LoadingController, ToastController, ActionSheetController, PopoverController } from 'ionic-angular';
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
  help='help';
  actionsAvailable = 'Actions Available:';
  @ViewChild(Content) content: Content;
  get format()   { return Constants.language; }
  public question;
  pet: string = "kittens";
  constructor(public platform: Platform, public ngZone: NgZone, private speechRecognition: SpeechRecognition,
  private tts: TextToSpeech, public http: Http, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController,
  private popoverCtrl: PopoverController) {
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

  presentPopover(myEvent) {

    let popover = this.popoverCtrl.create(PopoverPage);

    popover.present({
      ev: myEvent
    });
  }
  openModalHelp(message) {
    let modal = this.modalCtrl.create(ModalContentPageHelp, message);
    modal.present();
  }

  presentActionSheet() {
    var tit;
    var text1,text2,text3,text4;
    if(Constants.language === 'english') {
      tit = 'Actions Available';
      text1 = 'Change OnHands for a SKU';
      text2 = 'Change Location for a SKU';
      text3 = 'Print Overhead Tag for a SKU';
      text4 = 'Cancel';

    }
    else {
      tit = 'Acciones disponibles';
      text1 = 'Cambiar Onhands por un Sku';
      text2 = 'Cambiar la ubicación de un Sku';
      text3 = 'Imprimir etiqueta de gastos generales';
      text4 = 'cancelar';
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: tit,
      buttons: [
        {
          text: text1,
          handler: () => {
            this.openModalHelp({details: "onhands"});
          }
        },{
          text: text2,
          handler: () => {
            this.openModalHelp({details: "location"});
          }
        }
        ,{
          text: text3,
          handler: () => {
            this.openModalHelp({details: "print"});;
          }
        },{
          text: text4,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
    if(Constants.language === "english") {
      this.speak("These are the available actions in the app. Please click on the help topics and i will guide you on each of those actions");

    }
    else {
      this.speakSpanish();
    }
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
          var title;
          var text;
          if(Constants.language === "spanish") {
            title = "Martillo";
            text = "Martillo de trineo de 10 lb con manija de fibra de vidrio de 34 pulgadas";
          } else {
            title = "Hammer";
            text = "10 lb Sledge Hammer with 34 inch Fiberglass Handle";
          }
          this.skuNumber = Constants.skuNumber1;
          this.oh = Constants.onHandQuantity1;
          this.location = Constants.location1;
          Constants.currentSkuNumber = this.skuNumber;
          Constants.currentOH = this.oh;
          Constants.currentLocation = this.location;
          this.myMessage = new Message(response.speech,"bot",title, 
          "https://images.homedepot-static.com/productImages/f1e59730-23fb-4660-ad22-61fef380589a/svn/tekton-claw-hammers-30303-64_1000.jpg", 
          text,"Click for Hammer", "",false);
          Constants.myMessageConstant = this.myMessage;
            this.messages.push(this.myMessage);
            if(Constants.language === "english")
            this.speak("The product you searched for is Hammer. It is a 10 lb Sledge Hammer with 34 in Fiberglass Handle Hammer");
            else this.spanish("El producto que buscaste es Hammer. Es un martillo de trineo de 10 lb con 34 en martillo de mango de fibra de vidrio");
         }
         else if(response.speech.includes("Sewing Machine")) {
          var title;
          var text;
          if(Constants.language === "spanish") {
            title = "Máquina de coser";
            text = "Máquina de coser de grado industrial Janome HD1000 Black Edition";
          } else {
            title = "Sewing machine";
            text = "Janome HD1000 Black Edition Industrial-Grade Sewing Machine";
          }
          this.skuNumber = Constants.skuNumber2;
          this.oh = Constants.onHandQuantity2;
          this.location = Constants.location2;
          Constants.currentSkuNumber = this.skuNumber;
          Constants.currentOH = this.oh;
          Constants.currentLocation = this.location;
           this.myMessage = new Message(response.speech,"bot",title, 
           "https://images.homedepot-static.com/productImages/dd70303c-dbf0-423e-8a9f-fffc189897f8/svn/black-janome-sewing-machines-001hd1000be-64_1000.jpg", 
           text,"Click for Sewing Machine", "", false);
           Constants.myMessageConstant = this.myMessage;
          this.messages.push(this.myMessage);
          if(Constants.language === "english")
          this.speak("The product you searched for is Sewing machine. It is a Janome HD1000 Black Edition Industrial-Grade Sewing Machine");
          else this.spanish("El producto que busca es Máquina de coser. Es una máquina de coser de grado industrial Janome HD1000 Black Edition");
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
          if(Constants.language === 'english')
          this.speak(response.speech);
          else this.speakSpanish();
         }

         else if(response.speech.includes("bulb")) {
          this.bulbon = true;
          type Statuses = Array<BulbDetails>;
          var title1,title2,title3 ,title4;
          var text1,text2,text3,text4;
          if(Constants.language === "spanish") {
            text1 = "LED no regulable";
            title1 = "El autismo Equivalente Azul A19 de 60 vatios no regulable habla bombilla LED";
            title2 = "El verde equivalente a 60 vatios no regulable A19 habla bombilla LED";
            text3 = "Bombilla de luz de inundación LED";
            title3 = "Bombilla de luz de inundación con LED amarillo PAR38 equivalente a 90W";
            text4 = "LED regulable";
            title4 = "Bombilla de luz de vidrio transparente regulable de color rosa A19 de 25W Equivalente";
          } else {
            text1 = "Non Dimmable LED";
            title1 = "60-Watt Equivalent Blue A19 Non-Dimmable Autism Speaks LED Light Bulb";
            title2 = "60-Watt Equivalent Green A19 Non-Dimmable Autism Speaks LED Light Bulb";
            text3 = "LED Flood Light Bulb";
            title3 = "90W Equivalent PAR38 Yellow LED Flood Light Bulb";
            text4 = "Dimmable LED"
            title4 = "25W Equivalent Pink-Colored A19 Dimmable LED Clear Glass Light Bulb"
          }
          var statuses: Statuses = [
            new BulbDetails("https://images.homedepot-static.com/productImages/7aea5fdc-5a1d-4a4e-a5f0-bff644499525/svn/philips-colored-light-bulbs-463166-64_1000.jpg",
        text1, title1,
      "$5","Click to buy this", ""),
            new BulbDetails("https://images.homedepot-static.com/productImages/647af41c-23f8-426b-90a3-d8c74f837eb8/svn/philips-colored-light-bulbs-463224-64_1000.jpg",
            text1, title2,
          "$5","Click to buy this", ""),
          new BulbDetails("https://images.homedepot-static.com/productImages/c3010681-0747-417c-927e-2ced1fdbd00b/svn/philips-colored-light-bulbs-469080-64_1000.jpg",
        text3, title3,
      "$10","Click to buy this", ""),
      new BulbDetails("https://images.homedepot-static.com/productImages/f7d47d59-75e9-46fc-9421-5eb273d78e96/svn/feit-electric-colored-light-bulbs-a19-tpk-led-sgk-64_1000.jpg",
      text4, title4,
    "$15","Click to buy this", "")
];
this.slides = statuses;
      this.messages.push(new Message("These are the top available light bulbs","bot","","","","","",true));
        response.speech = "These are the top available light bulbs";
        if(Constants.language === "english")
        this.speak("These are the top available light bulbs in home depot. You can slide over the content to see all the top bulbs available.")
        else this.spanish("Estas son las mejores bombillas disponibles en Home Depot. Puede deslizar sobre el contenido para ver todas las bombillas superiores disponibles.");
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

  speakSpanish() {
    var msg = "Estas son las acciones disponibles. Haga clic en cualquier acción y lo guiaré a través de ella.";
    this.tts.speak({
      text: msg,
        locale: 'es-ES',
    })
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
  }

  spanish(msg) {
    this.tts.speak({
      text: msg,
        locale: 'es-ES',
    })
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

  get format()   { return Constants.language; }
  ngAfterViewInit() {
    setTimeout(() => {
      var speech = "Please input the new Location value at the next voice input. If you wish to cancel the updation say cancel";
    if(Constants.change === "New Location Value") {
      if(Constants.language === "english")
      speech = "Please input the new Location value at the next voice input. If you wish to cancel the updation say cancel";
      else speech = "Ingrese el nuevo valor de ubicación en la siguiente entrada de voz. Si desea cancelar la actualización, indique cancelar";
    }
    else {
      if(Constants.language === "english")
      speech = "Please input the new OnHand value at the next voice input. If you wish to cancel the updation say cancel"
      else speech = "Ingrese el nuevo valor de OnHand en la próxima entrada de voz. Si desea cancelar la actualización, indique cancelar";
    }
    if(Constants.language === "english")
    this.speak(speech, 10);
    else this.spanish(speech, 10);

    //this.startVoice();
    }, 1000);
    
  }

  startVoiceToFetchValue() {
    console.log("speech in modal");
    this.speechRecognition.startListening()
  .subscribe(
    (matches: Array<string>) => {
      this.newOh = matches[0];
      if(matches[0] === 'cancel' || matches[0] === 'Cancel') {
        this.cancelUpdation();
      }
      else if(matches[0] === 'confirm' || matches[0]==='Confirm') {
        return 'confirmed';
      }
      else {
        this.newOh = matches[0];
      }
      //this.presentConfirm();
      
    },
    (onerror) => console.log('error:', onerror)
  )

  return '';
  }

  spanish(msg, number) {
    this.tts.speak({
      text: msg,
        locale: 'es-ES',
    })
    .then(() => {if(number === 1) {this.dismiss()}
  
if(number === 10) {
  this.startVoice();
}
if(number === 5) {
  this.updationSuccessful();
}
 })
      .catch((reason: any) => console.log(reason));
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
      if(Constants.language === "english") {
        tit = "Confirm Location Change";
        mess = "Do you want to confirm the Location Change?";
      }
      else {
        tit = "Confirmar el cambio de ubicación";
        mess = "¿Deseas confirmar el cambio de ubicación?"
      }
     
    }
    else {
      if(Constants.language === "english") {
        tit = "Confirm OH Change";
      mess = "Do you want to confirm the OH Change?";
      } else {
        tit = "Confirmar OH Cambiar";
      mess = "¿Desea confirmar el cambio de OH?";
      }
      
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
            var toasttext, toastspeak;
            if(Constants.language === "english") {
              toasttext = "Location details updated successfully";
            }else toasttext = "Detalles de ubicación actualizados con éxito"
            this.presentToast(toasttext);
            if(Constants.language === "english") {
              this.speak(toasttext,0);
            } else this.spanish(toasttext, 1);
            
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
              var toasttext, toastspeak;
            if(Constants.language === "english") {
              toasttext = "OnHand quantity updated successfully";
            }else toasttext = "Cantidad en mano actualizada con éxito"
            this.presentToast(toasttext);
            if(Constants.language === "english") {
              this.speak(toasttext,0);
            } else this.spanish(toasttext,1);
            }
            
          }
        }
      ]
    });
    var i , returnval;
    if(Constants.change === "New Location Value") {
      i=Constants.currentLocation;
    } else i = Constants.currentOH;
    if(Constants.language === "english")
    this.speak("Are you sure to update the value from "+i+ "to "+this.newOh+ "If yes, please confirm else cancel at the next voice input", 5 );
    else this.spanish("¿Estás seguro de actualizar el valor de ? "+i+"a "+this.newOh+ "En caso afirmativo, confirme que canceló en la siguiente entrada de voz", 5)
    //alert.present();
    
    //alert.dismiss();
    //this.updationSuccessful
  }

  updationSuccessful() {
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
            var toasttext, toastspeak;
            if(Constants.language === "english") {
              toasttext = "Location details updated successfully";
            }else toasttext = "Detalles de ubicación actualizados con éxito"
            this.presentToast(toasttext);
            if(Constants.language === "english") {
              this.speak(toasttext,0);
            } else this.spanish(toasttext, 1);
            
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
              var toasttext, toastspeak;
            if(Constants.language === "english") {
              toasttext = "OnHand quantity updated successfully";
            }else toasttext = "Cantidad en mano actualizada con éxito"
            this.presentToast(toasttext);
            if(Constants.language === "english") {
              this.speak(toasttext,0);
            } else this.spanish(toasttext,1);
            }

  }
  

  startVoice(): string {
    console.log("speech in modal");
    this.speechRecognition.startListening()
  .subscribe(
    (matches: Array<string>) => {
      this.newOh = matches[0];
      if(matches[0] === 'cancel' || matches[0] === 'Cancel') {
        this.cancelUpdation();
      }
      else if(matches[0] === 'confirm' || matches[0]==='Confirm') {
        this.updationSuccessful();
      }
      else {
        this.newOh = matches[0];
        this.presentConfirm();
      }
      //
      
    },
    (onerror) => console.log('error:', onerror)
  )

  return '';


  }

  cancelUpdation() {
    if(Constants.language === "english") {
      this.speak("Action is cancelled. You are now redirected to the main page", 0);
    }
    else {
      this.spanish("La acción se cancela. Ahora se le redirige a la página principal",0);
    }
    this.dismiss();
  }

  speak(msg, number): string {
    this.tts.speak(msg)
  .then(() => {if(msg.includes("OnHand quantity updated successfully") ||
msg.includes("Location details updated successfully" || msg.includes("Detalles de ubicación actualizados con éxito") || msg.includes("Cantidad en mano actualizada con éxito"))) {this.dismiss()};
if(number === 5) {
  this.startVoice();
 
}
if(number === 10) {
  this.startVoice();
}
 })
  .catch((reason: any) => console.log(reason));
  return '';
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
printField = "printField";
quantityField = "quantityField";
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

  get format()   { return Constants.language; }

  spanish(msg, number) {
    this.tts.speak({
      text: msg,
        locale: 'es-ES',
    })
    .then(() => {if(number === 1 ) {this.dismiss()}
    else if(number === 2) 
    {this.startVoiceForPrint();} 
if(number === 10) {
  this.startVoice();
}  
})
      .catch((reason: any) => console.log(reason));
      }
  ngAfterViewInit() {
    setTimeout(() => {
      if(Constants.language === "english")
      this.speak("Please input the quantity for the tag at the next voice input", 10);
      else this.spanish("Ingrese la cantidad de la etiqueta en la próxima entrada de voz", 10)
    }, 1000);

    //this.startVoice();
    
  }

  presentToast() {
var toastMessage;
    if(Constants.language === "english")
    toastMessage = "Tag Printed Successfully";
    else toastMessage = "Etiqueta impresa con éxito";
    let toast = this.toastCtrl.create({
      message: toastMessage,
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
      if(Constants.language === "english")
    this.speak("The given tag was printed successfully.", 0);
    else this.spanish("La etiqueta dada se imprimió con éxito.", 1);
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
      if(Constants.language === "english")
      this.speak("Are you ready to print the tag with the given details. If yes, please say print in the next voice input screen or say cancel. You can always print the tag using the print button at the bottom of the page.", 0)
      else this.spanish("¿Estás listo para imprimir la etiqueta con los detalles dados? En caso afirmativo, indique imprimir en la siguiente pantalla de entrada de voz o decir cancelar. Siempre puede imprimir la etiqueta usando el botón de imprimir en la parte inferior de la página.",2)
      
    },
    (onerror) => console.log('error:', onerror)
  )}

  startVoiceForPrint() {
    console.log("speech in modal");
    this.speechRecognition.startListening()
  .subscribe(
    (matches: Array<string>) => {
      this.print = matches[0];
      if(this.print === 'print' || this.print ==='Print' || this.print ==='prind' || this.print ==='impresión' || this.print ==='impresion') {
        this.printMethod();

      } else {
        if(Constants.language === "english")
          this.speak("print cancelled. You can always print the tag by clicking print button at the bottom of the page.", 0)
          else this.spanish("impresión cancelada Siempre puede imprimir la etiqueta haciendo clic en el botón Imprimir en la parte inferior de la página.", 0)
      }
    },
    (onerror) => console.log('error:', onerror)
  )}

  printMethod() {
    this.presentLoadingDefault();
    
    
  }
  presentConfirm() {
    var tit;
    var mess;
    var can;
    var con;
    if(Constants.language === "english") {
      tit = "Confirm Print";
      mess = "Are you sure to print the Overhead Tag?";
      can = "Cancel";
      con = "Confirm";
    } else {
      tit = "Confirm Print";
      mess = "¿Estás seguro de imprimir la etiqueta de arriba?";
      can = "Cancelar";
      con = "Confirmar";

    }
    let alert = this.alertCtrl.create({

      title: tit,
      message: mess,
      buttons: [
        {
          text: can,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: con,
          handler: () => {
            if(Constants.language === "english")
            this.speak("Overhead Tag Printed Successfully", 0);
            else this.spanish("Etiqueta de arriba impresa con éxito", 1)
           
            
          }
        }
      ]
    });
    if(Constants.language === "english")
    this.speak("Are you sure to proceed?", 0);
    else this.spanish("¿Estás seguro de proceder?", 0)
    alert.present();
  

  }
  speak(msg, number) {
    this.tts.speak(msg)
  .then(() => {if(msg.includes("The given tag was printed successfully.") || msg.includes("La etiqueta dada se imprimió con éxito.") ) {this.dismiss()}
else if(msg.includes("Are you ready to print the tag with the given details. If yes, please say print in the next voice input screen or say cancel. You can always print the tag using the print button at the bottom of the page.") ||
msg.includes("impresión cancelada Siempre puede imprimir la etiqueta haciendo clic en el botón Imprimir en la parte inferior de la página.")) 
{this.startVoiceForPrint();}
if(number === 10) {
  this.startVoice();
}

 })
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
    var language = Constants.language;
    this.message = this.params.get('details');
    if(this.message === "onhands") {
     if(language === "english") {
      this.howToTitle = "How to change OnHands?";
      this.items = ["1. Input the SkuNumber in the home page", "2. Once the card is displayed for the sku", "3. Input command change onhands","4. or Input change oh", "5. Click on the change Oh field","6. Input New OnHands", "7. Confirm the change"];
     }
     else {
      this.howToTitle = "¿Cómo cambiar OnHands?";
      this.items = ["1. Ingrese el número de Sku en la página de inicio", "2. Una vez que se muestre la tarjeta para el sku", "3. Comando de entrada cambie las mangas", "4 o Ingrese cambie oh", "5. Haga clic en el cambio Oh campo "," 6. Ingrese nuevas OnHands "," 7. Confirme el cambio "];
     }
      
    }

    else if(this.message === "location") {
      if(language === "english") {
        this.howToTitle = "How to change Location?";
        this.items = ["1. Input the SkuNumber in the home page", "2. Once the card is displayed for the sku", "3. Input command change location","4. or Input change loc", "5. Click on the change Location field","6. Input new Location", "7. Confirm the change"];
      }
      else {
        this.howToTitle = "¿Cómo cambiar la ubicación?";
        this.items = ["1. Ingrese el número de Sku en la página de inicio "," 2. Una vez que se muestra la tarjeta para el sku "," 3. El comando de entrada cambia la ubicación "," 4. o Ingresar cambiar loc "," 5. Haga clic en el campo Cambiar ubicación "," 6. Ingrese una nueva ubicación "," 7. Confirma el cambio "];
      }
      
    }
    else if(this.message === "print") {
      if(language === "english") {
        this.howToTitle = "How to Print Overhead tag?";
      this.items = ["1. Input the SkuNumber in the home page", "2. Once the card is displayed for the sku", "3. Input command print tag","4. or print overhead tag", "5. Click on the change quantity field","6. Input new quantity", "7. Confirm the Print"];
      }
      else {
        this.howToTitle = "Cómo imprimir la etiqueta de arriba?";
        this.items = ["1. Ingrese el número de Sku en la página de inicio "," 2. Una vez que se muestra la tarjeta para el sku "," 3. Etiqueta de impresión del comando de entrada "," 4. o imprimir la etiqueta de gastos generales "," 5. Haga clic en el campo de cantidad de cambio "," 6. Ingrese una nueva cantidad "," 7. Confirme la impresión "];
      }
      
    }
  }

  ngAfterViewInit() {
    var text1;
    var text2;
    var text3;

    if(Constants.language === 'english') {
      text1 = "To Change OnHands for a sku, do the following  ."+
      "Input the sku number in the home page.   and Once the card is displayed for the sku."+
    "  input the command change on hands or change oh. Click on the change oh field and input the new oh value."+
  "   After that, confirm the changes";
  text2 = "To Change Location for a sku, do the following  ."+
  " Input the sku number in the home page.   and Once the card is displayed for the sku."+
" input the command change location or change loc.  Click on the change location field and input the new location value."+
"   After that, confirm the changes";
text3 = "To Print tag for a sku, do the following  ."+
"Input the sku number in the home page.    and Once the card is displayed for the sku. "+
"  input the command print tag or print overhead tag. Click on the quantity field and input the new quantity."+
"   After that, confirm the print";

    }
    else {
      text1 = "Para cambiar OnHands por un sku, haz lo siguiente     ." +
            "Ingrese el número de sku en la página de inicio. Y una vez que se muestre la tarjeta para el sku." +
          "ingrese el cambio de comando en las manos o cambie oh. Haga clic en el campo cambiar oh e ingrese el nuevo valor oh" +
        "Después de eso, confirma los cambios";
      text2 = "Para cambiar la ubicación de un sku, haga lo siguiente   ." +
        "Ingrese el número sku en la página de inicio. Y Una vez que se muestre la tarjeta para el sku" +
      "ingrese la ubicación de cambio de comando o cambie la ubicación. Haga clic en el campo de ubicación de cambio e ingrese el nuevo valor de ubicación  ."+
      "Después de eso, confirma los cambios";
      text3 = "Para imprimir la etiqueta de un sku, haga lo siguiente    ."
      "Ingrese el número sku en la página de inicio. Y una vez que se muestre la tarjeta para el sku." +
      "ingrese la etiqueta de impresión del comando o la etiqueta de gastos generales de impresión. Haga clic en el campo cantidad e ingrese la nueva cantidad." +
      "Después de eso, confirme la impresión";

    }
    setTimeout(() => {
      if(this.message === "onhands") {
        this.speak(text1,Constants.language);
        
      }
  
      else if(this.message === "location") {
        this.speak(text2,Constants.language);
      }
      else if(this.message === "print") {
        this.speak(text3, Constants.language );
      }
    }, 1000);
    
  }


  speak(msg, language) {
    var loc;
    if(language === "english") {
      loc = 'en-US';
    }
    else {
      loc = 'es-ES';

    }
    this.tts.speak({
      text: msg,
        locale: loc,
    })
  .then(() => {return "completed"})
  .catch((reason: any) => console.log(reason));
  }
   
  dismiss() {
    this.speak("", Constants.language);
    this.viewCtrl.dismiss();
  }
  ngOnDestroy() {
    this.speak("", Constants.language);
  }
}




@Component({
  templateUrl: 'popover.html'
})
 export class PopoverPage {
selectedLanguage = Constants.language;
selectLanguage = "selectLanguage";
english = "english";
spanish = "spanish";
get format()   { return Constants.language; }
  constructor(
    public viewCtrl: ViewController,
  ) {
    this.selectedLanguage = Constants.language;
  }

  buttonClicked() {

    Constants.language = this.selectedLanguage;
    this.close();

  }


  close() {
    this.viewCtrl.dismiss();
  }
}