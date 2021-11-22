import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

interface QCM {
  name : string;
  NbrQst : number;
  answersBool : AnswerQCMBool[];
  answers : AnswerQCM[];
  questions : string[];
}
interface AnswerQCMBool {
  ListanswerBool : boolean[]
}

interface AnswerQCM {
  Listanswer : string[]
}

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.page.html',
  styleUrls: ['./new-game.page.scss'],
})



export class NewGamePage implements OnInit {


  class :string;
  course :string;
  
  constructor(public navCtrl: NavController,public firestore: AngularFirestore,private activatedRouter: ActivatedRoute) { 

    this.course = this.activatedRouter.snapshot.paramMap.get('course');
    this.class = this.activatedRouter.snapshot.paramMap.get('class');

    }



  ngOnInit() {
  }

  
}
