import { Component, OnInit } from '@angular/core';
import { keepUnstableUntilFirst } from '@angular/fire';

function Word (text, row, col, vertical) {
  text = text;
  row = row;
  col = col;
  vertical = vertical;
}

@Component({
  selector: 'app-new-crossword',
  templateUrl: './new-crossword.component.html',
  styleUrls: ['./new-crossword.component.scss'],
})


export class NewCrosswordComponent implements OnInit {

  words = [
    'redemption',
    'school',
    // 'forrest',
    // 'remember',
    // 'private',
    // 'knight',
    // 'father',
    // 'fiction',
    // 'fight'
 ]

 placed = {}
 grid : Array<Array<string>> = [];

  constructor( ) { 
    this.OrderByLength(this.words)
    this.createEmptyGrid();
    
    let copyGrid = JSON.parse(JSON.stringify(this.grid))
    let succeeded = false
    while (succeeded == false){
      this.words.forEach(word => {
        if(this.words.indexOf(word) == 0){
          copyGrid = this.addWord(word, "horizontal", 0,0,copyGrid)
  
        }else{
  
          //get Intersect
  
          let intersections = this.getIntersect(word, copyGrid)
  
          let keys = Object.keys(intersections)
          console.log(keys)
  
          keys.forEach(key => {
            if(intersections[key].length != 0){
              console.log("I'm in")
              intersections[key].forEach(intersect => {
                console.log(intersect)
              
                if(this.addWord(word, "horizontal", intersect[0],intersect[1],copyGrid )!= false){
                  copyGrid = this.addWord(word, "horizontal", intersect[0],intersect[1],copyGrid)
                }
  
            });
  
            }
          });
  
  
        }
      });

      
      succeeded = true;
    }
    
  }



  ngOnInit() {


    
  }


  OrderByLength( list) {

    const byLength = (a,b) => b.length - a.length
    const sorted = [...list].sort(byLength)
    console.log(sorted)

  }

  createEmptyGrid () {
    for ( let i = 0; i < (this.words[0].length) * 2; i++){
      this.grid.push([])
      for ( let j = 0; j < (this.words[0].length) * 2 ; j++){
        this.grid[i].push("")
      }
    }
  }


  addWord(word, direction="horizontal", intersectX = 0, intersectY = 0, grid){
    console.log(intersectX, intersectY)
    console.log("Received", grid)
    let gridCopy = JSON.parse(JSON.stringify(grid))

    if(direction == "horizontal"){

      let row = intersectX
      let col = intersectY

      for(let letter = 0; letter < word.length; letter++ ){
        if( grid[row][col] == ""){
          gridCopy[row][col] = word[letter]
          
        }else{
          console.log(false)
          return false
        }

        col++;

      }

      gridCopy[row][col] = "/"
      console.log("result", gridCopy)

      //Checker si le tableau est altéré

      // console.log("TRY",gridCopy)
      // console.log(this.grid)
      // console.log(grid[0].indexOf("r"))
    }

    return gridCopy
  }


  getIntersect(word, grid){

    console.log("INT", grid)
    let intersections = {}
    for(let letter = 0; letter < word.length; letter ++){
      intersections[word[letter]] = []
      for(let row = 0; row < grid.length; row++){
        let index = grid[row].indexOf(word[letter])
        if(index != -1){
          intersections[word[letter]].push([row, index])
        }
      }
    }

    console.log("result", intersections)

    return(intersections)

  }
}