import { Component, forwardRef, Input, OnInit, Output, OnChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
/**
 * App Select Component
 */
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true },
  ]
})
export class SelectComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() bindValue;
  @Input() bindLabel;
  @Input() data = [];
  @Input() hideLoaded = false;
  @Input() placeholder;
  @Input() multiple;
  @Input() isAsync = false;
  @Input() attachSource = false;
  @Input() closeOnSelect = false;
  @Input() source$: Observable<any>;

  @Output() select: Subject<Object> = new Subject();
  selection;
  buffer = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  propagateChange: any = () => { };
  validateFn: any = () => { };
  constructor(public translate: TranslateService) {
  }


  emitSelection(event) {
    this.propagateChange(this.selection);
    this.select.next(event);
  }
  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {
    if (this.loading || this.data.length === this.buffer.length) {
      return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.buffer.length) {
      this.fetchMore();
    }
  }

  private fetchMore() {
    const len = this.buffer.length;
    const more = this.data.slice(len, this.bufferSize + len);
    this.buffer = this.data.concat(more);
  }
  writeValue(value) {
    if (value) {
      this.selection = value;
    }
  }
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  validate(c: FormControl) {
    return this.validateFn(c);
  }
  getFromSource() {
    this.source$.subscribe(data => {
      this.data = data;
      this.buffer = this.data.slice(0, this.bufferSize);
    });
  }
  ngOnChanges(changes): void {
    if (changes.source$ && changes.source$.currentValue && changes.source$.previousValue && !this.attachSource) {
      this.getFromSource();
    }
  }
  ngOnInit() {
    if (this.isAsync && !this.attachSource) {
      this.getFromSource();
    } else {
      this.buffer = this.data.slice(0, this.bufferSize);
    }
  }

}
