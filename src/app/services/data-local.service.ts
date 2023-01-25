import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { EmailComposer, EmailComposerOptions } from '@awesome-cordova-plugins/email-composer/ngx';
@Injectable({
  providedIn: 'root',
})
export class DataLocalService {
  guardados: Registro[] = [];
  constructor(private navCtrl:NavController,private email:EmailComposer) {
    this.cargarRegistros();
  }
  async guardarRegistro(format: string, text: string) {
    await this.cargarRegistros();
    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    await Preferences.set({
      key: 'registros',
      value: JSON.stringify(this.guardados) ,
    });
    this.abrirRegistro(nuevoRegistro);
  
  }
  async cargarRegistros(){
    try{
      const registrosJSOn= await Preferences.get({
        key:'registros'
      });
      this.guardados= JSON.parse(<string>registrosJSOn.value) || [];
      
    }catch(e){

    }
  }
  async abrirRegistro(registro:Registro){
    this.navCtrl.navigateForward('/tabs/tab2');
    switch (registro.type){
      case 'http':
      await Browser.open({ url: `${registro.text}` });
      break;
      case 'geo':
      this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
      break;
      default:
        console.log(registro.type);
        break;
    }
  }
  enviarCorreo(){
    const arrTemp=[];
    const titulos='Tipo, Formato, Creado en, Texto\n';
    arrTemp.push(titulos);
    this.guardados.forEach(registro=>{
      const linea=`${registro.type}, ${registro.format}, ${registro.created}, ${registro.text.replace(',',' ')}\n`
      arrTemp.push(linea);
    })
    this.crearArchivoFisico(arrTemp.join(''))
  }
  async crearArchivoFisico(text:string){
    console.log('X')
    await Filesystem.writeFile({
      path: 'registro.csv',
      data: text,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    const contents = await Filesystem.readFile({
      path: 'registro.xlsx',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    const archivo=`${Directory.Documents}/registro.csv`
    const email:EmailComposerOptions={
      to:'agrobelensac@gmail.com',
      cc:'pieromental@gmail.com',
      attachments:[`${Directory.Documents}/registro.csv`],
      subject:'First Email',
      body:'Trying to send a email.Hope it Works'
    }
    await this.email.open(email);
  }
}
