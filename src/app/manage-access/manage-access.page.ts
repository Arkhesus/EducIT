import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-manage-access',
  templateUrl: './manage-access.page.html',
  styleUrls: ['./manage-access.page.scss'],
})


export class ManageAccessPage implements OnInit {

toAccept = new Array();
resultArr = new Array();
listeUser = new Array();
selectedName = "";
selectedSurname = "";
Newclass : string;
class : string;
prof : string;
mail : string;
name : string;
surname : string;
newRubriks : string;


  constructor(private Appcomp: AppComponent, public firestore: AngularFirestore, public afAuth: AngularFireAuth) { }

  ngOnInit() {
    // this.profile = this.firestore.collection("profile").valueChanges();


    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        console.log('non connecté');
      } 
      else {
        this.mail = auth.email

        this.firestore.collection("profile").doc(this.mail).get().subscribe(data => {
            this.name = data.data()["name"]
            this.surname = data.data()["surname"]

            this.firestore.collection("class", ref => ref.where("profName", "==", this.name).where("profSurname", "==", this.surname)).snapshotChanges()
            .subscribe(data => {
              data.forEach(ChildData => {
                this.class = ChildData.payload.doc.data()["class"]

                this.firestore.collection('profile', ref => ref.where("state" , "==", "created").where("class", "==", this.class).where("type", "==", "student")).snapshotChanges()
                .subscribe(data => {
                  data.forEach( newStudent => {
                    this.toAccept.push(newStudent.payload.doc.data())
                  })
                  
                })

              })
            })
          })


      }
    });

    this.firestore.collection("profile").valueChanges().forEach(elem => {
      elem.forEach(prof => {
          this.listeUser.push(prof)
        
    })
    console.log(this.listeUser)
  })

  }

  search(event){
    this.selectedName = ""
    this.selectedSurname = ""
    this.resultArr = []
    let searchKey: string = event.target.value;
    let firstLetter = searchKey.toUpperCase();
    console.log(firstLetter);
    console.log(this.listeUser)


    this.listeUser.forEach(user => {
        if(user["type"] == "prof"){
          if(user["name"].toUpperCase().startsWith(firstLetter) | user["surname"].toUpperCase().startsWith(firstLetter)){
            this.resultArr.push(user)
          }
        }

    })
  }

  Accept(user){
    let data = {
      state : "accepted",
    }
  this.firestore.collection('profile').doc(user.mail).update(data)
  let e = document.getElementById(user.mail)
  e.style.display = "none"
  this.presentAlert("L'élève a été accepté")
  }


  Choosen(prof){
    this.resultArr=[]
    this.selectedName = prof.name
    this.selectedSurname = prof.surname
  }

  addClass() {
    
    let data = {
      class : this.Newclass,
      profName : this.selectedName,
      profSurname : this.selectedSurname
    }

    this.firestore.collection('class').doc(data.class).set(data)
    this.presentAlert("La nouvelle classe a été joutée")
    this.Appcomp.course = []
    this.resultArr=[]
    this.selectedName = ""
    this.selectedSurname = ""
  }

  addRubriks(){
    let data = {
      course : this.newRubriks,
      class : this.class
    }
    this.firestore.collection("course").doc(data.course + "_" + data.class).set(data)
    this.presentAlert("La nouvelle rubrique a été joutée")
  }

  async presentAlert(text) {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = 'Information';
    alert.message = text;
    alert.buttons = ['OK'];
  
    document.body.appendChild(alert);
    await alert.present();
  
    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}

