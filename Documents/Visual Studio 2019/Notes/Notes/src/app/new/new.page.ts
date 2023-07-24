import { Component, OnInit } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { DataService } from '../services/data.service';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Params } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { error } from 'console';
import { AlertController, ToastController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {
  capturedPhotos: any[] = [];
  topic = '';
  description = '';
  reference = '';
  date = new Date();
  imageUrls: any = [];
  url: any;
  selectedCards: number[] = [];
  doubleClickDelay = 500;
  clickTimer: any;
  router: any;
  card: any;
  oneDocData: any;
  cardClicked = false;
  activatedRoute: any;
  handlerMessage = '';
  roleMessage = '';


  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private dataservice: DataService,
    //private navParams: NavParams,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private alertController:AlertController
  ) {
    this.getPassedData();
    // this.capturedPhotos = undefined;
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  shortenBase64Link(base64Link: string): string {
    // Convert Base64 to Base64 URL-safe variant
    const base64UrlSafe = base64Link
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return base64UrlSafe;
  }

  getDate(event: any) {
    this.date = event.detail.value;
    console.log(this.date);
  }

  async takePhoto() {
    const image: Photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 90,
    });

    if (image.base64String) {
      this.capturedPhotos.push(image.base64String);
    }
  }

  async deleteBase64Photo(i: any) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want delete this image?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'my-custom-alert',
          handler: () => {
            console.log('Confirmation canceled');
          },
        },
        {
          text: 'Confirm',
          handler: () => {
            this.capturedPhotos.splice(i, 1);
          },
        },
      ],
    });
    await alert.present();
  }
  i = 0;

  async submit() {
    if (
      this.topic.trim() === '' ||
      this.description.trim() === '' ||
      this.reference.trim() === '' ||
      this.imageUrls.length === 0
    ) {
      this.showToast('Please fill all the required fields.');
    } else console.log(this.capturedPhotos);
    for (this.i = 0; this.i < this.capturedPhotos.length; this.i++) {
      this.url = await this.uploadImage(this.capturedPhotos[this.i]);
      console.log(this.url);
      const shortenedUrl = this.shortenBase64Link(this.url);

      // Push the shortened URL to the imageUrls array
      this.imageUrls.push(shortenedUrl);
      //this.imageUrls.push(this.url);
    }

    this.i = 0;
    this.db
      .collection('Notes')
      .ref.where('reference', '==', this.reference)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          // No document with the same reference exists, continue saving to the database
          this.db
            .collection('Notes')
            .add({
              topic: this.topic,
              description: this.description,
              reference: this.reference,
              date: this.date,
              capturedPhotosUrl: this.imageUrls,
            })
            .then((res: any) => {
              this.showToast('uploaded');
            })
            .catch((error: any) => {
              console.error('Error adding document: ', error);
              this.showToast('failed: ' + error);
            });
        } else {
          // A document with the same reference already exists, return an error
          this.showToast('Reference already exists!');
        }
      })
      .catch((error: any) => {
        console.error('Error checking for existing document: ', error);
        this.showToast('failed: ' + error);
      });
  }

  saveDocumentData() {
    if (this.reference && this.topic && this.description) {
      // Create a new object with the updated data
      const newData = {
        topic: this.topic,
        description: this.description,
        capturedPhotosUrl: this.capturedPhotos,
      };

      // Update the document in Firebase with the new data
      this.db
        .collection('Notes')
        .doc(this.reference)
        .update(newData)
        .then(() => {
          console.log('Document updated successfully!');
          // If the update is successful, you can choose to clear the capturedPhotos array
          // if you don't want to keep the old photo URLs after saving.
          // this.capturedPhotos = [];
        })
        .catch((error) => {
          console.error('Error updating document:', error);
        });
    } else {
      console.log('Please provide a valid topic and description.');
    }
  }

  async submit20() {
    if (!this.cardClicked) {
      this.showToast('Already on the database');
      return; // Exit the function early
    } else if (
      this.topic.trim() === '' ||
      this.description.trim() === '' ||
      this.reference.trim() === ''
    ) {
      this.showToast('Please fill all the required fields.');
    } else {
      console.log(this.capturedPhotos);
      for (this.i = 0; this.i < this.capturedPhotos.length; this.i++) {
        this.url = await this.uploadImage(this.capturedPhotos[this.i]);
        console.log(this.url);
        const shortenedUrl = this.shortenBase64Link(this.url);

        // Push the shortened URL to the imageUrls array
        this.imageUrls.push(shortenedUrl);
        //this.imageUrls.push(this.url);
      }

      this.i = 0;
      this.db
        .collection('Notes')
        .ref.where('reference', '==', this.reference)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            // No document with the same reference exists, continue saving to the database
            this.db
              .collection('Notes')
              .add({
                topic: this.topic,
                description: this.description,
                reference: this.reference,
                date: this.date,
                capturedPhotosUrl: this.imageUrls,
              })
              .then((res: any) => {
                this.showToast('Uploaded successfully!');
              })
              .catch((error: any) => {
                console.error('Error adding document: ', error);
                this.showToast('Failed to upload: ' + error);
              });
          } else {
            // A document with the same reference already exists, return an error
            this.showToast('Reference already exists!');
          }
        })
        .catch((error: any) => {
          console.error('Error checking for existing document: ', error);
          this.showToast('Failed: ' + error);
        });
    }
  }

  async submit2() {
    if (this.cardClicked) {
      this.showToast('Already on the database');
      return; // Exit the function early
    } else if (
      this.topic.trim() === '' ||
      this.description.trim() === '' ||
      this.reference.trim() === ''
    ) {
      this.showToast('Please fill all the required fields.');
    } else {
      console.log(this.capturedPhotos);
      for (this.i = 0; this.i < this.capturedPhotos.length; this.i++) {
        this.url = await this.uploadImage(this.capturedPhotos[this.i]);
        console.log(this.url);
        const shortenedUrl = this.shortenBase64Link(this.url);

        // Push the shortened URL to the imageUrls array
        this.imageUrls.push(shortenedUrl);
        //this.imageUrls.push(this.url);
      }

      this.i = 0;
      this.db
        .collection('Notes')
        .ref.where('reference', '==', this.reference)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            // No document with the same reference exists, continue saving to the database
            this.db
              .collection('Notes')
              .add({
                topic: this.topic,
                description: this.description,
                reference: this.reference,
                date: this.date,
                capturedPhotosUrl: this.imageUrls,
              })
              .then((res: any) => {
                this.showToast('Uploaded successfully!');
              })
              .catch((error: any) => {
                console.error('Error adding document: ', error);
                this.showToast('Failed to upload: ' + error);
              });
          } else {
            // A document with the same reference already exists, return an error
            this.showToast('Reference already exists!');
          }
        })
        .catch((error: any) => {
          console.error('Error checking for existing document: ', error);
          this.showToast('Failed: ' + error);
        });
    }
  }

  async uploadImage(file: string) {
    const fileName = Date.now().toString();
    const filePath = `new/${fileName}`;
    const fileRef = this.storage.ref(filePath);

    const uploadTask = fileRef.putString(file, 'base64', {
      contentType: 'image/jpeg',
    });
    const snapshot = await uploadTask;

    return snapshot.ref.getDownloadURL();
  }

  selectTheCard(index: number): void {
    if (this.clickTimer) {
      clearTimeout(this.clickTimer); // Clear the timer if another click is registered
      this.clickTimer = null;

      if (this.selectedCards.includes(index)) {
        const selectedIndex = this.selectedCards.indexOf(index);
        this.selectedCards.splice(selectedIndex, 1);
      } else {
        this.selectedCards.push(index);
      }
    } else {
      this.clickTimer = setTimeout(() => {
        this.clickTimer = null;

        // Handle single-click action if needed
        // For example, navigate to a detailed view of the card
      }, this.doubleClickDelay);
    }
  }

  isTheCardSelected(index: number): boolean {
    return this.selectedCards.includes(index);
  }

  deleteTheSelectedCards(): void {
    // Sort the selectedCards array in descending order
    this.selectedCards.sort((a, b) => b - a);

    // Remove the selected cards from the capturedPhotos array
    for (const index of this.selectedCards) {
      this.capturedPhotos.splice(index, 1);
    }

    // Clear the selectedCards array
    this.selectedCards = [];
  }

  selectCard(index: number): void {
    if (this.selectedCards.includes(index)) {
      // Card already selected, so deselect it
      const selectedIndex = this.selectedCards.indexOf(index);
      this.selectedCards.splice(selectedIndex, 1);
    } else {
      // Card not selected, so add it to the selected cards array
      this.selectedCards.push(index);
    }
  }

  isCardSelected(index: number): boolean {
    return this.selectedCards.includes(index);
  }

  deleteSelectedCards(): void {
    // Sort the selectedCards array in descending order
    this.selectedCards.sort((a, b) => b - a);

    // Remove the selected cards from the capturedPhotos array
    for (const index of this.selectedCards) {
      this.capturedPhotos.splice(index, 1);
    }

    // Clear the selectedCards array
    this.selectedCards = [];
  }

  fetchPhotos() {
    this.db
      .collection('Notes')
      .valueChanges()
      .subscribe((photos: any[]) => {
        this.capturedPhotos = photos;
      });
  }

  getPassedData() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params && params['data']) {
        this.reference = params['data'];
        console.log(this.reference);
        this.getOneDocumentData();
      }
    });
  }

  getOneDocumentData() {
    if (this.reference) {
      this.db
        .collection('Notes', (ref) =>
          ref.where('reference', '==', this.reference)
        )
        .valueChanges()
        .subscribe((data: any[]) => {
          console.log(data);
          this.oneDocData = data;
          console.log(data);
          this.topic = data[0].topic;
          this.description = data[0].description;

          this.capturedPhotos = [];

          data.forEach((item) => {
            if (
              item.capturedPhotosUrl &&
              Array.isArray(item.capturedPhotosUrl)
            ) {
              this.capturedPhotos.push(...item.capturedPhotosUrl);
            }
          });
        });
    }
  }

  async submitOrUpdater20() {
    try {
      this.route.queryParams.subscribe(async (params: Params) => {
        if (params && params['data']) {
          if (this.topic && this.description) {
            const updateData = {
              topic: this.topic,
              description: this.description,
              capturedPhotosUrl: this.capturedPhotos,
            };
            console.log(updateData);
            this.db
              .collection('Notes', (ref) =>
                ref.where('reference', '==', this.reference)
              )
              .get()
              .toPromise()
              .then((querySnapshot: any) => {
                querySnapshot.forEach((doc: { id: any; data: () => any }) => {
                  const id = doc.id;
                  console.log(id);
                  const userData = doc.data();
                  const loginCount = userData.loginCount || 0;
                  const newLoginCount = loginCount + 1;

                  this.db.collection('Notes').doc(id).update({
                    topic: this.topic,
                    description: this.description,
                    capturedPhotosUrl: this.capturedPhotos,
                  });
                });
              });
            // Assuming that this.reference holds the correct document ID
            // await this.db.collection('Notes').doc(this.reference).update(updateData)
            //this.showToast('Document updated successfully!');
          } else {
            this.showToast('Please provide a valid topic and description.');
          }
        } else {
          // User came from the home page using a button, proceed with submitting new data
          if (
            this.topic.trim() === '' ||
            this.description.trim() === '' ||
            this.reference.trim() === ''
          ) {
            this.showToast('Please fill all the required fields.');
          } else {
            console.log(this.capturedPhotos);
            for (let i = 0; i < this.capturedPhotos.length; i++) {
              this.url = await this.uploadImage(this.capturedPhotos[i]);
              console.log(this.url);
              const shortenedUrl = this.shortenBase64Link(this.url);

              // Push the shortened URL to the imageUrls array
              this.imageUrls.push(shortenedUrl);
              //this.imageUrls.push(this.url);
            }

            const querySnapshot = await this.db
              .collection('Notes')
              .ref.where('reference', '==', this.reference)
              .get();
            if (querySnapshot.empty) {
              // No document with the same reference exists, continue saving to the database
              await this.db.collection('Notes').add({
                topic: this.topic,
                description: this.description,
                reference: this.reference,
                date: this.date,
                capturedPhotosUrl: this.imageUrls,
              });
              this.showToast('Uploaded successfully!');
            } else {
              // A document with the same reference already exists, return an error
              this.showToast('Reference already exists!');
            }
          }
        }
      });
    } catch {
      this.showToast('Error');
    }
  }

  onCardClick(reference: string) {
    this.cardClicked = true;
  }

  ngOnInit() {}
}
