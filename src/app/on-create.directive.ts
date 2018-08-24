import { Directive, Output, EventEmitter, Input, SimpleChange, OnInit } from '@angular/core';

@Directive({
  selector: '[appOnCreate]'
})



export class OnCreateDirective implements OnInit {

  @Output() OnCreateDirective: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }
  ngOnInit() {
    this.OnCreateDirective.emit('dummy');
  }

}
