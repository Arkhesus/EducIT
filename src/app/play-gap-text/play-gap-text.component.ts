import { Component, OnInit, Input, ViewEncapsulation, Output } from '@angular/core';
import { Event } from '@angular/router';

@Component({
  selector: 'app-play-gap-text',
  templateUrl: './play-gap-text.component.html',
  styleUrls: ['./play-gap-text.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class PlayGapTextComponent implements OnInit {

  @Input() GameGapText;
  RandomWords : Array<any>
  total : 100
  filledIn = 0
  QttyError = 0
  constructor() { 
   
  }

  ngOnInit() {

    this.total = this.GameGapText.words.length

    var i, j, tmp;

    this.RandomWords = [...this.GameGapText.words]

    for (i = this.RandomWords.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      tmp = this.RandomWords[i];
      this.RandomWords[i] = this.RandomWords[j];
      this.RandomWords[j] = tmp;
  }
    console.log(this.RandomWords)
    this.DisplayGame()
  }

  DisplayGame(){
    let output = document.getElementById('output')
    let input = 0
    console.log("Work")

    let BrutText = this.GameGapText.text.split("[ . . . ]")
    console.log(BrutText)
    let NetText = "<div style='display : inline-block; padding : 20px;'>"
    BrutText.forEach(elem => {
      if(elem != ""){
        console.log(BrutText.indexOf(elem))
        if(BrutText.indexOf(elem) == BrutText.length-1){
          console.log("okey")
          NetText += "<label style='margin:auto;padding : 2px;'>" + elem + "</label>"
        }else{
          console.log("not okey")
          NetText += "<label style='margin-top:auto; padding : 2px;'> " + elem + "</label>"+ "<input id='" + input + "' class='wordsInput'" +input + "' ></input> "

          input ++
          // NetText += "<label>" + elem + "</label>"
        }
      }

    })

    NetText += "</div>"

    output.innerHTML = NetText

    let wordsInput = document.getElementsByClassName("wordsInput")
    for(let index = 0; index < input; index++){
      
      wordsInput[index].addEventListener("change", this.onChange.bind(this))
    }



  }

  onChange (this, event) {
    let value = event.target['value']

    if(this.GameGapText.displayWord){
      if(this.GameGapText.words.includes(value)){
        if(value == this.GameGapText.words[event.target["id"]]){
          console.log("oook")
          event.target.style.backgroundColor = "#6bd793"
          this.filledIn += 1

          if(this.filledIn == this.total){
            let output = document.getElementById('output')
            output.setAttribute('hidden', 'hidden',)
          }

        }else {
          event.target.style.backgroundColor = "#f67828"
          this.QttyError += 1

        }
        console.log("Is in the list")
      }else{
        console.log("Is not in the list")
        event.target.style.backgroundColor = "#ff6961"
        this.QttyError += 1


      }
    }else{
      console.log(false)
      if(value == this.GameGapText.words[event.target["id"]]){
        console.log("oook")
        event.target.style.backgroundColor = "#6bd793"
        this.filledIn += 1

        if(this.filledIn == this.total){
          let output = document.getElementById('output')
          output.setAttribute('hidden', 'hidden',)
        }
        
      }else {
        event.target.style.backgroundColor = "#ff6961"
        this.QttyError += 1


      }
      console.log("Is in the list")
    }

    console.log(this.QttyError, this.total, this.filledIn)
}

}
