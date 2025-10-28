import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header.component';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './main.component.html',
})
export class MainComponent {

}

