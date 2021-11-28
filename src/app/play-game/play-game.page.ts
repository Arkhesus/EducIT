import { Component, ElementRef, OnInit, QueryList, ViewChild, AfterViewInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Gesture, GestureController } from '@ionic/angular';
import { IonItem } from '@ionic/angular'


//QCM interfaces 
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

//Groups interfaces 
interface Groups {
  name : string;
  categories : string[];
  answers : string[];
  answersCategories : string[];
}

//Crossword interface
interface Crossword {
  name : string;
  NbrWord : number;
  word : Word[];
  board : LineBoard[]
}

interface LineBoard {
  ListLine : string[]
}

interface Word {
  word : string,
  direction : number,
  x: number,
  y : number,
  clue : string,
}

interface GapText {
  name : "",
  words : Array<string>,
  displayWord : boolean,
  text : string,
}


@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.page.html',
  styleUrls: ['./play-game.page.scss'],
})
export class PlayGamePage implements OnInit {

  //General data
  class : string;
  course : string;
  gameName:string;

  // QCM data
  GameQCM : QCM;
  AnswersQCM : Array<AnswerQCMBool>;
  indexQCM : number;

  // Groups data
  GameGroups : Groups;

  //Crossword data
  GameCrossword : Crossword;

  //GapText data
  GameGapText : GapText

  constructor(private gestCtrl : GestureController, private changedetectorRef: ChangeDetectorRef ,private activatedRouter: ActivatedRoute, public firestore: AngularFirestore) { }

  ngOnInit() {


    this.course = this.activatedRouter.snapshot.paramMap.get('course');
    this.class = this.activatedRouter.snapshot.paramMap.get('class');
    this.gameName = this.activatedRouter.snapshot.paramMap.get('game');

    this.firestore.collection('games', ref => ref.where("class", "==", this.class).where("course", "==", this.course).where("name", "==", this.gameName)).snapshotChanges()
    .subscribe( data => {
      data.forEach(childData => {
        
        if(childData.payload.doc.data()['type'] == "QCM"){
          this.GameQCM = {
            name : childData.payload.doc.data()['name'],
            NbrQst :childData.payload.doc.data()['NbrQst'] ,
            answersBool: childData.payload.doc.data()['answersBool'],
            answers : childData.payload.doc.data()['answers'],
            questions: childData.payload.doc.data()['questions'],
          }
          
          this.AnswersQCM = JSON.parse(JSON.stringify(this.GameQCM.answersBool))
          this.indexQCM = 0;
          for( let i = 0; i < this.AnswersQCM.length; i ++){
            for (let j = 0; j < this.AnswersQCM[i].ListanswerBool.length; j++){
              this.AnswersQCM[i].ListanswerBool[j] = false
            }
          }
        }

        if(childData.payload.doc.data()['type'] == "Groups"){
          this.GameGroups = {
            name : childData.payload.doc.data()['name'],
            categories : childData.payload.doc.data()['categories'],
            answers : childData.payload.doc.data()['answers'],
            answersCategories : childData.payload.doc.data()['answersCategories']
          }
        }

        if(childData.payload.doc.data()['type'] == "Crossword"){
          this.GameCrossword = {
            name : childData.payload.doc.data()['name'],
            NbrWord : childData.payload.doc.data()['NbrWord'],
            word : childData.payload.doc.data()['word'],
            board : childData.payload.doc.data()['board']
          }

          console.log(this.GameCrossword)
        }

        if(childData.payload.doc.data()['type'] == "GapText"){
          this.GameGapText = {
            name : childData.payload.doc.data()['name'],
            words : childData.payload.doc.data()['words'],
            displayWord : childData.payload.doc.data()['displayWord'],
            text : childData.payload.doc.data()['text']
          }

          console.log(this.GameGapText)
        }
        
      })
    })



  }
  


// ------------------------------------

// ------------------------------------
}