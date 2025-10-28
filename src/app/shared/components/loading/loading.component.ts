import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  template: `<div
    class="{{
      size
    }} border-2 border-t-2 border-white border-solid rounded-full animate-spin border-t-blue-600"
  ></div>`,
})
export class LoadingComponent {
  @Input() size: string = 'w-4 h-4';
}
