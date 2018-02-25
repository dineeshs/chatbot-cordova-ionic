import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage, ModalContentPagePrint, ModalContentPageHelp, PopoverPage } from '../pages/home/home';
import { SpeechRecognition  } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { ModalContentPage } from '../pages/home/home';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Translate } from '../pages/home/translate';

@NgModule({
  declarations: [
    MyApp,  
    HomePage,
    ModalContentPage,
    ModalContentPagePrint,
    ModalContentPageHelp,
    Translate,
    PopoverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ModalContentPage,
    ModalContentPagePrint,
    ModalContentPageHelp,
    PopoverPage
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SpeechRecognition,
    TextToSpeech,
    HomePage,
  ]
})
export class AppModule {}
