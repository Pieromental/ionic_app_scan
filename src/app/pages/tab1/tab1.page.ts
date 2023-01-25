import { Component, OnDestroy } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController } from '@ionic/angular';
import { resolve } from 'dns';
import { DataLocalService } from '../../services/data-local.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnDestroy {
  slideOpt = {
    allowSlidePrev: false,
    allowSlideNext: false,
  };
  conten_visibilit = '';
  respuesta: string = '';
  constructor(
    private dataLocal: DataLocalService,
    private alertCtrl: AlertController
  ) {}
  async checkPermission() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      } else if (status.denied) {
        const alert = await this.alertCtrl.create({
          header: 'Sin permisos',
          message:
            'Por favor permite el acceso a la cámara en tus configuraciones',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
            },
            {
              text: 'Ir a Ajustes',
              handler: () => {
                BarcodeScanner.openAppSettings();
                return false;
              },
            },
          ],
        });
        await alert.present();
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  }
  async startScan() {
    try {
      const permission = await this.checkPermission();
      if (permission) {
        this.hideContent();
        const result = await BarcodeScanner.startScan();
        this.stopScan();
        if (result.hasContent) {
          const contenido = result.content || 'EMPTY';
          const formato = result.format || 'EMPTY';
          this.dataLocal.guardarRegistro(formato, contenido);
        }
      }else{
        return true;
      }
    } catch (e) {
      this.stopScan();
    }
  }
  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body')!.classList.remove('scanner-active');
    this.conten_visibilit = '';
  }
  async hideContent(){
    await BarcodeScanner.hideBackground();
    document.querySelector('body')!.classList.add('scanner-active');
    this.conten_visibilit = 'hidden';
  }
  ngOnDestroy() {
    this.stopScan();
  }

}
