import { AfterViewInit, Component, Input, ViewEncapsulation  } from '@angular/core';


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

@Component({
  selector: 'app-play-crossword',
  templateUrl: './play-crossword.component.html',
  styleUrls: ['./play-crossword.component.scss'],
  encapsulation: ViewEncapsulation.None,
  
})
export class PlayCrosswordComponent implements AfterViewInit {


  @Input() GameCrossword : Crossword

  wordArr
  wordBank
  wordsActive
  mode = 0

  created :boolean = false
  board 

  QttyError:number =0
  Total:number =0
  FilledIn:number =0

  constructor() {
}

 

  ngAfterViewInit(){
    console.log(this.GameCrossword)


    let ConcatenateBoard = []
    this.GameCrossword.board.forEach(elem => {
      ConcatenateBoard.push(elem.ListLine)
    })
    this.board = ConcatenateBoard
    console.log(this.board)

    this.Create();
    this.Play(this.board);
   
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

  CheckValue(value){
    console.log("Hello world !", value)
  }


  Create(){
    this.created = true
    if (this.mode === 0){
      this.ToggleInputBoxes(true);
      let grid = this.BoardToHtml(" ")
      
      document.getElementById("crossword").innerHTML = grid
      // this.mode = 1;
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

  Play(board){
    var letterArr = document.getElementsByClassName('letter');
    console.log(letterArr)
    for(var i = 0; i < letterArr.length; i++){
      console.log(letterArr[i].id)

      let coord = letterArr[i].id.split("_")

      let html = "<input id=" + letterArr[i].id + " class='char' type='text' maxlength='1'"
      this.GameCrossword.word.forEach(elem => {
        if(elem.x == parseInt(coord[0]) && elem.y == parseInt(coord[1]) ){
          html += "placeholder =" + (this.GameCrossword.word.indexOf(elem) +1)
        }
      })
      this.Total += 1
      console.log(this.Total)

      html += "></input>"
      letterArr[i].innerHTML = html;

    }

    var CharArr = document.getElementsByClassName('char');
    console.log(letterArr)
    for(var i = 0; i < CharArr.length; i++){
      CharArr[i].addEventListener("change", this.onChange.bind(this))

    }
    
    this.mode = 0;
    this.ToggleInputBoxes(false);

  }

  onChange(this,event){
      
    console.log(event)
    let coord = event.target.id.split("_")
    console.log(coord, this.board, this.QttyError)
    if(event.target.value.toUpperCase() == this.board[coord[0]][coord[1]]){
      console.log(true)
      event.target.style.backgroundColor = "#6bd793" //green 
      event.target.setAttribute('disabled', 'disabled');
      this.FilledIn +=1
      console.log(this.FilledIn)
      if(this.FilledIn == this.Total){
        console.log("IN")
        let crossword = document.getElementById('crossword')
        crossword.hidden = true
        let result = document.getElementById('result')
        result.hidden = false
        let clues = document.getElementById('Gameclues')
        clues.hidden = true
      }
    }else{
      console.log(false)
      event.target.style.backgroundColor = "#ff6961" //red
      this.QttyError += 1;
    }
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
      str += this.BoardCharToElement(this.board[i][j],i,j);
    }
    str += "</div>";
  }

  
  return str;
}

BoardCharToElement(c, x,y){
  var arr=(c)?['square','letter']:['square'];
  return this.EleStr('div',[{a:'class',v:arr}],c ,x,y);
}

EleStr(e,c,h, x,y){
  h = (h)?h:"";
  for(var i=0,s="<"+e+" id="+ x +"_"+y +" "; i<c.length; i++){
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

