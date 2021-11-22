import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { AppComponent } from './app.component';
import { NewQCMComponent } from './new-qcm/new-qcm.component';

import { AppRoutingModule } from './app-routing.module';


const firebaseConfig = {
  apiKey: "AIzaSyBX5dBkD9XcTeMNgC6OuZRxdz5PT4Jl3VU",
  authDomain: "educit.firebaseapp.com",
  projectId: "educit",
  storageBucket: "educit.appspot.com",
  messagingSenderId: "608889653580",
  appId: "1:608889653580:web:3d6b0ca7a757986e5b27e9",
  measurementId: "G-MYEJK4FJJD"
};


@NgModule({
  declarations: [
    AppComponent,
    NewQCMComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
