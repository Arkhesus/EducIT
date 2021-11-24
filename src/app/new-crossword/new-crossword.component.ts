import { Component,Input, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

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


@Component({
  selector: 'app-new-crossword',
  templateUrl: './new-crossword.component.html',
  styleUrls: ['./new-crossword.component.scss'],
  encapsulation: ViewEncapsulation.None,
})


export class NewCrosswordComponent implements OnInit {

  board
  wordArr
  wordBank
  wordsActive
  mode

  created :boolean = false

  Crossword : Crossword;
  @Input() course : string;
  @Input() class : string;

  constructor( public navCtrl: NavController,public firestore: AngularFirestore ) { 

    this.Crossword = {
      name : "",
      NbrWord : 0,
      word : [],
      board : [],
    }

    
  }

  Bounds = {  
    top:0, right:0, bottom:0, left:0,
  
    Update:function(x,y){
      this.top = Math.min(y,this.top);
      this.right = Math.max(x,this.right);
      this.bottom = Math.max(y,this.bottom);
      this.left = Math.min(x,this.left);
    },
    
    Clean:function(){
      this.top = 999;
      this.right = 0;
      this.bottom = 0;    
      this.left = 999;
    }
  };

  Submit(){
    // this.Crossword.board = this.board

    this.board.forEach(element => {
      let line :LineBoard = {
        ListLine : element
      }
      this.Crossword.board.push(line)
    });

    for(let i = 0; i < this.Crossword.word.length; i++){
      this.wordsActive.forEach(element => {
        if(element.string == this.Crossword.word[i].word.toUpperCase()){
          this.Crossword.word[i].x = element.x
          this.Crossword.word[i].y = element.y
          this.Crossword.word[i].direction = element.dir
        }
      });
    }
    
    let data = {
      type:'Crossword',
      name : this.Crossword.name,
      NbrWord : this.Crossword.NbrWord,
      word : this.Crossword.word,
      board : this.Crossword.board,
      class : this.class,
      course : this.course,
    }

    console.log(data)
    
    this.firestore.collection('games').doc(this.course + '_' + this.class + '_' +data.name).set(data)
    this.navCtrl.navigateForward('dashboard/' + this.class + '/' + this.course)
  }

  WordObj(stringValue){

    let word = {
      string : stringValue,
      char : stringValue.split(""),
      totalMatches : 0,
      effectiveMatches : 0,
      successfulMatches : [],
    }

    return word
  }


  addNewWord(){
    this.Crossword.NbrWord += 1

    let word : Word = {
        word : '',
        x : 0,
        y : 0,
        direction : 0,
        clue : '',
      }

    this.Crossword.word.push(word)
  }

  ngOnInit(){
 
  }


  Create(){
    this.created = true
    if (this.mode === 0){
      this.ToggleInputBoxes(true);
      let grid = this.BoardToHtml(" ")
      
      document.getElementById("crossword").innerHTML = grid
      this.mode = 1;
    }
    else{  
      this.GetWordsFromInput();
  
      for(var i = 0, isSuccess=false; i < 10 && !isSuccess; i++){
        this.CleanVars();
        isSuccess = this.PopulateBoard();
      }

      this.board = this.CleanBoard(this.board)
      

      document.getElementById("crossword").innerHTML = 
        (isSuccess) ? this.BoardToHtml(" "): "Failed to find crossword." ;
    }
  }

  CleanBoard(board){
    let filledRow = []
    let filledCol = []

    let RowNullQtty = 0
    let ColNullQtty = 0

    let RowNull = true
    let ColNull = true
    for(let row = 0; row < board.length; row++){
      if( !board[row].every(element => element === null)){
        filledRow.push(row)
        RowNull = false
      }
      if(RowNull == true){
        RowNullQtty += 1
      }
    }

    let newBoard = []


    
    for (let col = 0; col < board[0].length; col++){
      let column = []
      for (let row = 0; row < board.length; row++){
        column.push(board[row][col])

      }

      
      if( !column.every(element => element === null)){
        filledCol.push(col)
        ColNull = false
      }
      if(ColNull == true){
        ColNullQtty +=1
      }
    }

    
    let newIndexRow = 0;
    filledRow.forEach( row => {
      newBoard.push([])
      filledCol.forEach( col => {
        newBoard[newIndexRow].push(board[row][col])
      })
      newIndexRow ++;
    
    })

    this.wordsActive.forEach(element => {
      element.x = element.x - RowNullQtty
      element.y = element.y - ColNullQtty
    });

    console.log(this.wordsActive)
    
    return newBoard
  }

  Play(){
    var letterArr = document.getElementsByClassName('letter');
    
    for(var i = 0; i < letterArr.length; i++){
      letterArr[i].innerHTML = "<input class='char' type='text' maxlength='1'></input>";
    }
    
    this.mode = 0;
    this.ToggleInputBoxes(false);

  }



  ToggleInputBoxes(active){
    var w=document.getElementsByClassName('word'),
        d=document.getElementsByClassName('clue');
    
    for(var i=0;i<w.length; i++){
      if(active===true){
        this.RemoveClass(w[i], 'hide');
        this.RemoveClass(d[i], 'clueReadOnly');
       (<HTMLInputElement> d[i]).disabled = false;
      }
      else{
        this.AddClass(w[i], 'hide');
        this.AddClass(d[i], 'clueReadOnly');
        (<HTMLInputElement> d[i]).disabled = true;
      }
    }
  }

  
BoardToHtml(blank){

  for(var i=0, str=""; i<this.board.length; i++){
    str+="<div>";
    for(var j=0; j<this.board[0].length; j++){
      str += this.BoardCharToElement(this.board[i][j]);
    }
    str += "</div>";
  }

  
  return str;
}

BoardCharToElement(c){
  var arr=(c)?['square','letter']:['square'];
  return this.EleStr('div',[{a:'class',v:arr}],c);
}

EleStr(e,c,h){
  h = (h)?h:"";
  for(var i=0,s="<"+e+" "; i<c.length; i++){
    s+=c[i].a+ "='"+this.ArrayToString(c[i].v," ")+"' ";    
  }
  return (s+">"+h+"</"+e+">");
}

ArrayToString(a,s){
  if(a===null||a.length<1)return "";
  if(s===null)s=",";
  for(var r=a[0],i=1;i<a.length;i++){r+=s+a[i];}
  return r;
}

AddClass(ele,classStr){
  ele.className = ele.className.replaceAll(' '+classStr,'')+' '+classStr;
}

RemoveClass(ele,classStr){
  ele.className = ele.className.replaceAll(' '+classStr,'');
}

ToggleClass(ele,classStr){
  var str = ele.className.replaceAll(' '+classStr,'');
  ele.className = (str.length===ele.className.length)?str+' '+classStr:str;
}

GetWordsFromInput(){
  this.wordArr = [];  
  for(var i=0,val,w=document.getElementsByClassName("word");i<w.length;i++){
    val = (w[i] as HTMLInputElement).value.toUpperCase();
    if (val !== null && val.length > 1){this.wordArr.push(val);}
  }
}

CleanVars(){
  this.Bounds.Clean();
  this.wordBank = [];
  this.wordsActive = [];
  this.board = [];
  
  for(var i = 0; i < 32; i++){
    this.board.push([]);
    for(var j = 0; j < 32; j++){
      this.board[i].push(null);
    }
  }
}

PopulateBoard(){
  this.PrepareBoard();
  
  for(var i=0,isOk=true,len=this.wordBank.length; i<len && isOk; i++){
    isOk = this.AddWordToBoard();
  } 

  return isOk;
}


PrepareBoard(){
  this.wordBank=[];
  
  for(var i = 0, len = this.wordArr.length; i < len; i++){
    this.wordBank.push(this.WordObj(this.wordArr[i]));
  }
  
  for(i = 0; i <this.wordBank.length; i++){
    for(var j = 0, wA=this.wordBank[i]; j<wA.char.length; j++){
      for(var k = 0, cA=wA.char[j]; k<this.wordBank.length; k++){
        for(var l = 0,wB=this.wordBank[k]; k!==i && l<wB.char.length; l++){
          wA.totalMatches += (cA === wB.char[l])?1:0;
        }
      }
    }
  }  
}


AddWordToBoard(){
  var i, len, curIndex, curWord, curChar, curMatch, testWord, testChar, 
      minMatchDiff = 9999, curMatchDiff;  

  if(this.wordsActive.length < 1){
    curIndex = 0;
    for(i = 0, len = this.wordBank.length; i < len; i++){
      if (this.wordBank[i].totalMatches < this.wordBank[curIndex].totalMatches){
        curIndex = i;
      }
    }
    this.wordBank[curIndex].successfulMatches = [{x:12,y:12,dir:0}];
  }
  else{  
    curIndex = -1;
    
    for(i = 0, len = this.wordBank.length; i < len; i++){
      curWord = this.wordBank[i];
      curWord.effectiveMatches = 0;
      curWord.successfulMatches = [];
      for(var j = 0, lenJ = curWord.char.length; j < lenJ; j++){
        curChar = curWord.char[j];
        for (var k = 0, lenK = this.wordsActive.length; k < lenK; k++){
          testWord = this.wordsActive[k];
          for (var l = 0, lenL = testWord.char.length; l < lenL; l++){
            testChar = testWord.char[l];            
            if (curChar === testChar){
              curWord.effectiveMatches++;
              
              var curCross = {x:testWord.x,y:testWord.y,dir:0};              
              if(testWord.dir === 0){                
                curCross.dir = 1;
                curCross.x += l;
                curCross.y -= j;
              } 
              else{
                curCross.dir = 0;
                curCross.y += l;
                curCross.x -= j;
              }
              
              var isMatch = true;
              
              for(var m = -1, lenM = curWord.char.length + 1; m < lenM; m++){
                var crossVal = [];
                if (m !== j){
                  if (curCross.dir === 0){
                    var xIndex = curCross.x + m;
                    
                    if (xIndex < 0 || xIndex > this.board.length){
                      isMatch = false;
                      break;
                    }
                    
                    crossVal.push(this.board[xIndex][curCross.y]);
                    crossVal.push(this.board[xIndex][curCross.y + 1]);
                    crossVal.push(this.board[xIndex][curCross.y - 1]);
                  }
                  else{
                    var yIndex = curCross.y + m;
                    
                    if (yIndex < 0 || yIndex > this.board[curCross.x].length){
                      isMatch = false;
                      break;
                    }
                    
                    crossVal.push(this.board[curCross.x][yIndex]);
                    crossVal.push(this.board[curCross.x + 1][yIndex]);
                    crossVal.push(this.board[curCross.x - 1][yIndex]);
                  }

                  if(m > -1 && m < lenM-1){
                    if (crossVal[0] !== curWord.char[m]){
                      if (crossVal[0] !== null){
                        isMatch = false;                  
                        break;
                      }
                      else if (crossVal[1] !== null){
                        isMatch = false;
                        break;
                      }
                      else if (crossVal[2] !== null){
                        isMatch = false;                  
                        break;
                      }
                    }
                  }
                  else if (crossVal[0] !== null){
                    isMatch = false;                  
                    break;
                  }
                }
              }
              
              if (isMatch === true){                
                curWord.successfulMatches.push(curCross);
              }
            }
          }
        }
      }
      
      curMatchDiff = curWord.totalMatches - curWord.effectiveMatches;
      
      if (curMatchDiff<minMatchDiff && curWord.successfulMatches.length>0){
        curMatchDiff = minMatchDiff;
        curIndex = i;
      }
      else if (curMatchDiff <= 0){
        return false;
      }
    }
  }
  
  if (curIndex === -1){
    return false;
  }
    
  var spliced = this.wordBank.splice(curIndex, 1);
  this.wordsActive.push(spliced[0]);
  
  var pushIndex = this.wordsActive.length - 1,
      rand = Math.random(),
      matchArr = this.wordsActive[pushIndex].successfulMatches,
      matchIndex = Math.floor(rand * matchArr.length),  
      matchData = matchArr[matchIndex];
  
    this.wordsActive[pushIndex].x = matchData.x;
    this.wordsActive[pushIndex].y = matchData.y;
    this.wordsActive[pushIndex].dir = matchData.dir;
  
  for(i = 0, len = this.wordsActive[pushIndex].char.length; i < len; i++){
    var xIndex = matchData.x,
        yIndex = matchData.y;
    
    if (matchData.dir === 0){
      xIndex += i;    
      this.board[xIndex][yIndex] = this.wordsActive[pushIndex].char[i];
    }
    else{
      yIndex += i;  
      this.board[xIndex][yIndex] = this.wordsActive[pushIndex].char[i];
    }
    
    this.Bounds.Update(xIndex,yIndex);
  }

  
  return true;
}

customTrackBy(index : number, obj : any) {
  return index
}

}