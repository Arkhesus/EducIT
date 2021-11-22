import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular';


interface Groups {
  name : string;
  categories : string[];
  answers : string[];
  answersCategories : string[];
}


@Component({
  selector: 'app-play-groups',
  templateUrl: './play-groups.component.html',
  styleUrls: ['./play-groups.component.scss'],
})
export class PlayGroupsComponent implements AfterViewInit {

  @Input() GameGroups : Groups;
  myTest = Array.from(Array(30).keys())
  contentScrollActive = true;

  dropzone = [];
  colors = [ '#ef7771', '#b7ebbb', '#85b6f0', '#f3f3a0', '#543b18']
  finished = false;


  @ViewChildren("dropzone", {read : ElementRef}) Listzone : QueryList<ElementRef>
  @ViewChildren('itemGame', {read : ElementRef}) items: QueryList<ElementRef>
  gestureArray : Gesture[] = [];
  ListDropZone = []

  QttyError : number = 0;
  QttyItems : number = 0;
  
  constructor(private gestCtrl : GestureController,  private changedetectorRef: ChangeDetectorRef) { }

  ngOnInit() { 
    this.dropzone = this.GameGroups.categories
  }

  ngAfterViewInit(){
    this.updateGestures();
  }
  
  updateGestures(){
    
    this.gestureArray.map(gesture => gesture.destroy());
    this.gestureArray = [];
  
    const arr = this.items.toArray()
    this.QttyItems = arr.length;
    console.log("////", this.QttyItems)
    this.ListDropZone = this.Listzone.toArray();

    for(let i = 0; i < arr.length; i++){
      const oneItem = arr[i]
      const drag = this.gestCtrl.create({
        el : oneItem.nativeElement,
        threshold : 1,
        gestureName : 'drag',
        onStart: ev => {
          oneItem.nativeElement.style.transition = '';
          oneItem.nativeElement.style.opacity = '0.8';
          oneItem.nativeElement.style.fontWeight = 'bold';
          this.contentScrollActive = false;
          this.changedetectorRef.detectChanges();
        },
        onMove : ev => {
          oneItem.nativeElement.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px)`;
          oneItem.nativeElement.style.zIndex = 11;
          this.checkDropzoneover(ev.currentX, ev.currentY);
        },
        onEnd: ev => {
          this.contentScrollActive = true;
          this.handleDrop(oneItem, ev.currentX, ev.currentY, i);
  
          for(let i = 0; i < this.ListDropZone.length; i ++){
  
            if(!this.isInZone(ev.currentX, ev.currentY, this.ListDropZone[i].nativeElement.getBoundingClientRect())){
            oneItem.nativeElement.style.transform = 'translate(0,0)'
          }
        }
        }
      });
      drag.enable();
      this.gestureArray.push(drag)
    }
    this.items.changes.subscribe( res => {
      if(this.gestureArray.length != this.items.length){
        this.updateGestures();
      }
    })
  }
  
  
  checkDropzoneover(x,y){
  
    for(let i = 0; i < this.ListDropZone.length; i++){
      if(this.isInZone(x,y, this.ListDropZone[i].nativeElement.getBoundingClientRect() )){
        this.ListDropZone[i].nativeElement.style.backgroundColor = this.colors[i]
      }else{
        this.ListDropZone[i].nativeElement.style.backgroundColor = 'white'
      }
    }
  }
  
  isInZone(x,y, dropzone){
    if(x < dropzone.left || x>= dropzone.right) {
      return false
    }
  
    if(y < dropzone.top || y >= dropzone.bottom) {
      return false
    }
  
    return true
  }
  
  handleDrop(item, endX, endY, index){
  
    let correct = false
  
  for(let i = 0; i < this.ListDropZone.length; i ++){
  
  
    if(this.isInZone(endX, endY, this.ListDropZone[i].nativeElement.getBoundingClientRect()) && this.GameGroups.answersCategories[index] == this.dropzone[i]){
      item.nativeElement.remove();
      this.QttyItems = this.QttyItems - 1
      console.log("....", this.QttyItems)
      if(this.QttyItems == 0){
        this.finished = true
      }
      correct = true;
    }
    this.ListDropZone[i].nativeElement.style.backgroundColor = 'white';
    this.ListDropZone[i].nativeElement.style.backgroundColor = 'white';
    this.changedetectorRef.detectChanges();
  }
  if(correct == false) {
      item.nativeElement.style.transition = '.2s ease-out';
      item.nativeElement.style.zIndex = 'inherit';
      item.nativeElement.style.transfom = 'translate(0px,0px)';
  
      item.nativeElement.style.opacity = '1';
      item.nativeElement.style.fontWeight = 'normal';

      this.QttyError += 1;
      console.log(this.QttyError)
      
    }

  }
  

}
