import { Component, Input, OnInit } from '@angular/core';
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
  selector: 'app-new-qcm',
  templateUrl: './new-qcm.component.html',
  styleUrls: ['./new-qcm.component.scss'],
})
export class NewQCMComponent implements OnInit {

  game : string; 
  QCM : QCM;
  @Input() course : string;
  @Input() class : string;


  constructor(public navCtrl: NavController,public firestore: AngularFirestore,private activatedRouter: ActivatedRoute) { 


    let answerQCMBool :Array<AnswerQCMBool>= [{ ListanswerBool:[]}]
    let answers : Array<AnswerQCM> = [{Listanswer : []}]
    this.QCM = {
      name :'',
      NbrQst : 0,
      answersBool : answerQCMBool,
      answers : answers,
      questions : []
    }


  }

  ngOnInit() {
  }

  Submit(){
    console.log(this.QCM)

    let data = {
      type:'QCM',
      name : this.QCM.name,
      NbrQst : this.QCM.NbrQst,
      answersBool : this.QCM.answersBool,
      answers : this.QCM.answers,
      questions : this.QCM.questions,
      class : this.class,
      course : this.course,
    }

    this.firestore.collection('games').doc(this.course + '_' + this.class + '_' +data.name).set(data)
    this.navCtrl.navigateForward('dashboard/' + this.class + '/' + this.course)
  }

  addNewQuestion(){
    this.QCM.questions.push("")
    this.QCM.answers[this.QCM.NbrQst] = {Listanswer : []}
    this.QCM.answersBool[this.QCM.NbrQst] = { ListanswerBool:[]}
    this.QCM.NbrQst += 1
  }

  addTextQuestion (index, text){
    this.QCM.questions[index] = text
  }

  AddTextAnswer(question, nbr){
    console.log("I am in")
    this.QCM.answers[question].Listanswer = []
    this.QCM.answersBool[question].ListanswerBool = []
    for(let i = 0; i < nbr; i++){
      console.log(i)
      this.QCM.answers[question].Listanswer.push('')
      this.QCM.answersBool[question].ListanswerBool.push(false)
    }
  }

  customTrackBy(index : number, obj : any) {
    return index
  }

}
