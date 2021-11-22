import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { collection, doc, getDoc } from "firebase/firestore";
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-connect',
  templateUrl: './connect.page.html',
  styleUrls: ['./connect.page.scss'],
})
export class ConnectPage implements OnInit {

  public mail : string;
  public password : string;
  public type = "prof"; 

  constructor(private Appcomp: AppComponent,public firestore: AngularFirestore,public afAuth: AngularFireAuth,public navCtrl: NavController, public toastCtrl: ToastController) { }

  ngOnInit() {
  }

  CreateUser() {
    this.afAuth.createUserWithEmailAndPassword(this.mail, this.password).then(auth => {
      let data = {
        type : this.type,
        state : "new",
        mail : this.mail
      }
      this.Appcomp.type = this.type

      this.firestore.collection("profile").doc(this.mail).set(data)
    }).catch(err => {
      this.Toast(err.message)
    })
  }

  ConnectUser(){

    this.firestore.collection('profile').doc(this.mail).get().subscribe( data => {
      console.log(data.exists)
      if(data.exists == false){
        this.Toast("Votre compte n'existe pas")
      }else{
        console.log(data.data()['type'], this.type)
        if(data.data()["type"] == this.type){

          this.afAuth.signInWithEmailAndPassword(this.mail, this.password).then(auth => {
            this.navCtrl.navigateForward("home")
          }).catch(err => {
            this.Toast(err.message)
          })

        }else{
          this.Toast("Votre compte ne correspond pas à ce type de profil")
        }

      }
      
    })



  }



  async Toast(message) {
    const toast = await this.toastCtrl.create({
      header: 'Erreur',
      message: message,
      position: 'middle',
      buttons: [
        {
          side: 'start',
          icon: 'alert',
          text: 'Fermer',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }

}
