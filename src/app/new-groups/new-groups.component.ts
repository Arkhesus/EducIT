import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';


interface Groups {
  name : string;
  categories : string[];
  answers : string[];
  answersCategories : string[];
}

@Component({
  selector: 'app-new-groups',
  templateUrl: './new-groups.component.html',
  styleUrls: ['./new-groups.component.scss'],
})
export class NewGroupsComponent implements OnInit {


  GameGroups : Groups;
  @Input() class:string;
  @Input() course : string;

  constructor(public navCtrl: NavController,public firestore: AngularFirestore) { }

  ngOnInit() {
    this.GameGroups = {
      name : '',
      categories : [],
      answers : [],
      answersCategories : [],
    }
  }

  addNewCategory(){
    this.GameGroups.categories.push('')
  }

  addNewAnswer(){
    this.GameGroups.answers.push('')
  }

  Submit(){
    console.log(this.GameGroups)

    let data = {
      type:'Groups',
      name : this.GameGroups.name,
      categories : this.GameGroups.categories,
      answers : this.GameGroups.answers,
      answersCategories : this.GameGroups.answersCategories,
      class : this.class,
      course : this.course,
    }

    this.firestore.collection('games').doc(this.course + '_' + this.class + '_' +data.name).set(data)
    this.navCtrl.navigateForward('dashboard/' + this.class + '/' + this.course)
  }


  customTrackBy(index : number, obj : any) {
    return index
  }

}
