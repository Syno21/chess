import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LoadingController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>Collection in Firebase</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-card *ngFor="let document of documents$ | async">
      <ion-card-header>
        <ion-card-title>{{ document.name }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <!-- Display other document properties here -->
      </ion-card-content>
    </ion-card>
  </ion-content>
`,
})
export class HomePage {
  tables$: any;
  router: any;
  cards: any[] = [];

  constructor(private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private auth: AngularFireAuth,
    private route: Router, private firebaseService: FirebaseService) {
      this.firestore.collection('Notes').valueChanges().subscribe(data => {
        this.tables$ = data;  
      });
      //console.log(this.tables$)
    }
     
    /*goToNewPage(tableData: any) {
      this.navCtrl.navigateForward('new', {
        queryParams: {
          tableData: JSON.stringify(tableData)
        }
      });
    }*/

    onCardClick(data: any) {
      //console.log(data);
      this.navCtrl.navigateForward('/new', { queryParams: { data: data, source: 'cards' } });
      //this.router.navigate(['/new'], { state: { cards } });
    }

    navigateToNewPage() {
      // Navigating to the new page with query parameter "source=button"
     // this.router.navigateForward(['/new'], { queryParams: { source: 'cards' } });
      this.navCtrl.navigateForward('/new', { queryParams: { source: 'buttons' } });
    }

    /*moveToNewPage(tableData: any) {
      this.router.navigateByUrl('/', {
        state: {
          tableData: tableData
        }
      });
    }*/
}
