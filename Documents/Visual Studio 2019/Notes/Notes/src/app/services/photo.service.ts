import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  // async takePicture() {
  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: true,
  //     resultType: CameraResultType.Uri
  //   });

  //   if (image && image.webPath) {
  //     const imageUrl = image.webPath;

  //     // Use the imageUrl as needed, e.g., set it as the source of an image element
  //     const imageElement = document.getElementById('your-image-id') as HTMLImageElement;
  //     imageElement.src = imageUrl;
  //   }
  // }

}


