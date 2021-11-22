import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  course : string;
  class : string;
  ListGame : Array<any>;
  type = this.appComp.type

  constructor(private appComp : AppComponent, private activatedRouter: ActivatedRoute, public firestore: AngularFirestore) { 
    this.course = this.activatedRouter.snapshot.paramMap.get('course');
    this.class = this.activatedRouter.snapshot.paramMap.get('class');
  }

  ngOnInit() {

    this.ListGame = []

    this.firestore.collection('games', ref => ref.where("class", "==", this.class).where("course", "==", this.course)).snapshotChanges()
    .subscribe( data => {
      data.forEach(childData => {
        console.log(childData.payload.doc.data())
        this.ListGame.push(childData.payload.doc.data())
      })
    })

  }

}
