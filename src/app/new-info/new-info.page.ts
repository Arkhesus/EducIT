import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-new-info',
  templateUrl: './new-info.page.html',
  styleUrls: ['./new-info.page.scss'],
})
export class NewInfoPage implements OnInit {

  classes = new Array();
  ChoosenClass: string = '';
  name : string;
  surname : string;
  type = this.Appcomp.type

  constructor(private Appcomp: AppComponent,public firestore: AngularFirestore,public navCtrl: NavController) { }

  ngOnInit() {
    this.firestore.collection("class").valueChanges().forEach(elem => {
      elem.forEach(classe => {
        this.classes.push(classe)

      })
      
    })
  }

  Update(){
    let data = {
      state : "created",
      class : this.ChoosenClass,
      name : this.name,
      surname : this.surname
    }

    if (this.type== 'prof'){
      data['Search'] = data.surname.toUpperCase() + data.name.toUpperCase()
    }
    this.Appcomp.state = data.state
    this.firestore.collection('profile').doc(this.Appcomp.mail).update(data)
    this.Appcomp.class = this.ChoosenClass
    this.Appcomp.name = this.name
    this.Appcomp.surname = this.surname
    // this.Appcomp.getCourse()
    this.navCtrl.navigateForward('home')
  }

}
