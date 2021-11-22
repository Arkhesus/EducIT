import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  state : string;

  constructor(private Appcomp: AppComponent,public afAuth: AngularFireAuth,public firestore: AngularFirestore,private menu: MenuController) {

    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        console.log('non connecté');
  

      } else {
        this.firestore.collection('profile').doc(auth.email).get().subscribe( data => {
          this.state = data.data()['state']
        })
      }
    })

  }

  openMenu(){
    this.menu.toggle();
  }
}
