import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [NgClass],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class ToastContainerComponent {
  protected toastService = inject(ToastService);
  protected messages = this.toastService.messages;
}
