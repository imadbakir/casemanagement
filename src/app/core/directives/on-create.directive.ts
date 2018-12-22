import { Directive, EventEmitter, OnInit, Output } from '@angular/core';

/**
 * Emit an event when Element is initilazed
 */
@Directive({
  selector: '[appOnCreate]'
})



export class OnCreateDirective implements OnInit {

  @Output() OnCreateDirective: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }
  /**
   * onInit Emit Event
   */
  ngOnInit() {
    this.OnCreateDirective.emit('dummy');
  }

}
