import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
//import { getFirestore, provideFirestore } from '@angular/fire/firestore';
//import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { AngularFireStorageModule } from '@angular/fire/compat/storage'
import { RouterModule, Routes } from '@angular/router';

const firebaseConfig = {
  apiKey: 'AIzaSyDvSuwR--vjuDp7Mh2aclO-VRH7yNsr8L0',
  authDomain: 'image-75326.firebaseapp.com',
  databaseURL: 'https://console.firebase.google.com/u/1/project/image-75326',
  projectId: 'image-75326',
  storageBucket: 'image-75326.appspot.com',
  messagingSenderId: '310560292317',
  appId: '1:310560292317:web:29ecb857e71e7023bc4a34'
};

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule, 
    AngularFireModule.initializeApp(environment.firebase)
    ,AngularFirestoreModule,AngularFireAuthModule,AngularFireStorageModule
],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {
  
}

