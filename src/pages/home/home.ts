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

declare var ApiAIPromises: any;
export class Message {
  constructor(public content: string, public sentBy: string, public title: string, public image: string, 
    public text: string, public button: string, public buttonUrl: string) {}
}
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  messages = [];
  @ViewChild(Content) content: Content;
  public question;

  constructor(public platform: Platform, public ngZone: NgZone, private speechRecognition: SpeechRecognition,
  private tts: TextToSpeech, public http: Http) {
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
    this.messages.push(new Message(question, "user","","","","",""));
    this.getBooksWithObservable(question)
	    .subscribe( response => {
        this.ngZone.run(()=> {

        if (response.speech.includes("Hammer")) {
            this.messages.push(new Message(response.speech,"bot","Hammer", 
         "https://images.homedepot-static.com/productImages/f1e59730-23fb-4660-ad22-61fef380589a/svn/tekton-claw-hammers-30303-64_1000.jpg", 
         "Sku Name: Hammer","Click for Hammer", ""));
         }
         else if(response.speech.includes("Sewing Machine")) {
          this.messages.push(new Message(response.speech,"bot","Sewing machine", 
         "https://images.homedepot-static.com/productImages/dd70303c-dbf0-423e-8a9f-fffc189897f8/svn/black-janome-sewing-machines-001hd1000be-64_1000.jpg", 
         "Sku Name: Sewing Machine","Click for Sewing Machine", ""));
         }
         else {
          this.messages.push(new Message(response.speech,"bot","","","","",""));
         }
         
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
