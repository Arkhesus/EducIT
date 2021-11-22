import { Input, Component, ElementRef, OnInit, QueryList, ViewChild, AfterViewInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Gesture, GestureController } from '@ionic/angular';
import { IonItem } from '@ionic/angular'

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
  selector: 'app-play-qcm',
  templateUrl: './play-qcm.component.html',
  styleUrls: ['./play-qcm.component.scss'],
})
export class PlayQCMComponent implements OnInit {

  @Input() class : string;
  @Input() course : string;
  @Input() gameName:string;

  @Input() GameQCM : QCM;
  @Input() AnswersQCM : Array<AnswerQCMBool>;

  total : number;
  point : number;
  corrected : boolean = false;
  success = true;

  @Input() indexQCM : number;
  showNext = false;
  QttyError : number = 0;

  constructor(private gestCtrl : GestureController, private changedetectorRef: ChangeDetectorRef ,private activatedRouter: ActivatedRoute, public firestore: AngularFirestore) { }

  ngOnInit() {


    console.log(this.course, this.class, this.gameName)
    console.log(this.GameQCM)
    // this.firestore.collection('games', ref => ref.where("class", "==", this.class).where("course", "==", this.course).where("name", "==", this.gameName)).snapshotChanges()
    // .subscribe( data => {
    //   data.forEach(childData => {
    //     if(childData.payload.doc.data()['type'] == "QCM"){
    //       this.GameQCM = {
    //         name : childData.payload.doc.data()['name'],
    //         NbrQst :childData.payload.doc.data()['NbrQst'] ,
    //         answersBool: childData.payload.doc.data()['answersBool'],
    //         answers : childData.payload.doc.data()['answers'],
    //         questions: childData.payload.doc.data()['questions'],
    //       }
          
          
    //       this.AnswersQCM = JSON.parse(JSON.stringify(this.GameQCM.answersBool))
    //       this.indexQCM = 0;
    //       for( let i = 0; i < this.AnswersQCM.length; i ++){
    //         for (let j = 0; j < this.AnswersQCM[i].ListanswerBool.length; j++){
    //           this.AnswersQCM[i].ListanswerBool[j] = false
    //         }
    //       }
    //     }
        
    //   })
    // })



  }


  CorrectQCM(iAnswer){
    
    if(this.AnswersQCM[this.indexQCM].ListanswerBool[iAnswer] == false){
      this.AnswersQCM[this.indexQCM].ListanswerBool[iAnswer] = true
    }else {
    this.AnswersQCM[this.indexQCM].ListanswerBool[iAnswer] = false
    }



    let correct = true
      for (let j = 0; j < this.AnswersQCM[this.indexQCM].ListanswerBool.length; j++){
        if(this.AnswersQCM[this.indexQCM].ListanswerBool[j] !=this.GameQCM.answersBool[this.indexQCM].ListanswerBool[j]){
          document.getElementById(iAnswer).style.backgroundColor = '#ff6961'
          this.AnswersQCM[this.indexQCM].ListanswerBool[iAnswer] = false
          correct = false
        
        }
    }

    if(correct){
      document.getElementById(iAnswer).style.backgroundColor = '#6bd793'
      this.showNext = true
    }else{
      this.QttyError +=1
    }
}


nextQuestion() {
  this.indexQCM += 1;
  this.showNext = false
}




}
