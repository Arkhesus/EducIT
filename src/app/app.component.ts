import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})


export class AppComponent {

  type : string; 
  mail : string;
  name : string;
  surname : string;
  class : string;course = new Array ();
  state : string;
  
  constructor(public firestore: AngularFirestore, private menu: MenuController,private router: Router, public afAuth: AngularFireAuth,public navCtrl: NavController) {
    
    this.initializeApp()

  }

initializeApp() {
  this.afAuth.authState.subscribe(auth => {
    if (!auth) {
      console.log('non connecté');

      this.navCtrl.navigateRoot('connect');
    } else {
      this.mail = auth.email
      this.firestore.collection('profile').doc(auth.email).get().subscribe( data => {
        this.type = data.data()["type"]
        console.log(this.type, data.data()['state'])
        if(data.data()["state"] == "new") {
          console.log("new info")
          this.navCtrl.navigateRoot("new-info")
        }else{
          console.log("home")
          console.log(data.data()["state"])
          
          this.firestore.collection("profile").doc(auth.email).get().subscribe(data => {
          this.name = data.data()["name"]
          this.surname = data.data()["surname"]
          this.class = data.data()["class"]
          this.state = data.data()['state']
          this.course=[]
          this.getCourse();
          
        });
        this.navCtrl.navigateRoot('home');
        }
      })


    }
  });
}

Disconnect(){
  this.menu.close();
  this.type = ''
  this.name = ''
  this.surname = '' 
  this.class = ''
  this.state = ''
  this.mail = ''
  this.afAuth.signOut();
  
}




getCourse(){
  this.course=[]
  this.firestore.collection("course", ref => ref.where("class", "==", this.class)).snapshotChanges()
  .subscribe(data => {
    this.course=[]
    data.forEach(childData => {
      this.course.push(childData.payload.doc.data()["course"])
    });
  });
}


}