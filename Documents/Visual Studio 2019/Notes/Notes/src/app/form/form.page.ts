import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { DataService } from '../services/data.service';
import { AlertController, NavParams } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  capturedPhotos: any[] = [];
  topic = '';
  description = '';
  reference = '';
  date = new Date();
  imageUrls: any=[];
  url: any;
  selectedCards: number[] = [];
  doubleClickDelay = 500;
  clickTimer: any;
  router: any;
  card: any;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private dataservice: DataService,
    //private navParams: NavParams,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  

}
