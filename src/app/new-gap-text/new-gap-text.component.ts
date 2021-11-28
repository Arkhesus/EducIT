import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';

interface GapText {
  name : "",
  words : Array<string>,
  displayWord : boolean,
  text : string,
}

@Component({
  selector: 'app-new-gap-text',
  templateUrl: './new-gap-text.component.html',
  styleUrls: ['./new-gap-text.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class NewGapTextComponent implements OnInit {


  @Input() class
  @Input() course

  GapText : GapText

  constructor( public navCtrl: NavController,public firestore: AngularFirestore ) {
    this.GapText = {
      name : "",
      words  : [],
      text : "",
      displayWord : false,
    }
   }

  ngOnInit() {}

  UpdateOutput(){
    let output = document.getElementById('output')
    let input = 0
    console.log("Work")

    console.log(output.innerText, this.GapText.text)
    let BrutText = this.GapText.text.split("[ . . . ]")
    console.log(BrutText)
    let NetText = "<div style='display : inline-block;'>"
    BrutText.forEach(elem => {
      if(elem != ""){
        console.log(BrutText.indexOf(elem))
        if(BrutText.indexOf(elem) == BrutText.length-1){
          console.log("okey")
          NetText += "<label style='margin:auto;padding : 2px;'>" + elem + "</label>"
        }else{
          console.log("not okey")
          NetText += "<label style='margin:auto; padding : 2px;'> " + elem + "</label>"+ "<input id='" + input + "' class='wordsInput'" +input + "' ></input> "

          input ++
          // NetText += "<label>" + elem + "</label>"
        }
      }

    })

    NetText += "</div>"

    output.innerHTML = NetText

    let wordsInput = document.getElementsByClassName("wordsInput")
    for(let index = 0; index < input; index++){
      
      wordsInput[index].addEventListener("change", this.onChange.bind(this, wordsInput[index].id))
    }



  }

  addGapWord() {
    let input = document.getElementById("input")
    this.GapText.words.push("")
    this.GapText.text += " [ . . . ]"
  }

  onChange (id) {
    console.log(event)
    this.GapText.words[id] = event.target['value']
}

Submit(){
  console.log(this.GapText)

  let data = {
    type:'GapText',
    name : this.GapText.name,
    words : this.GapText.words,
    text : this.GapText.text,
    displayWord : this.GapText.displayWord,
    class : this.class,
    course : this.course,
  }

  console.log(data)
  
  this.firestore.collection('games').doc(this.course + '_' + this.class + '_' +data.name).set(data)
  this.navCtrl.navigateForward('dashboard/' + this.class + '/' + this.course)
}

}
