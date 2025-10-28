import { Component, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
// import { AuthService } from './auth.service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <h2>Sign Up</h2>
    <!-- <form (ngSubmit)="onSubmit()">
    <label>Email<br><input [(ngModel)]="email" name="email" required /></label><br>
    <label>Password<br><input [(ngModel)]="password" name="password" type="password" required /></label><br>
    <label>Nome (opcional)<br><input [(ngModel)]="name" name="name" /></label><br>
    <button type="submit">Criar conta</button>
    </form>
    <p *ngIf="auth.loading()">Carregando...</p>
    <p *ngIf="auth.error()">Erro: {{ auth.error() }}</p>
    <a routerLink="/confirm">Já tem código? Confirmar conta</a> -->
  `
  })
  export class SignUpComponent {
  email = '';
  password = '';
  name = '';

  // constructor(public auth: AuthService, private router: RouterModule) {}

  // onSubmit() {
  // this.auth.signUp(this.email, this.password, { name: this.name })
  // .then(() => {
  //   alert('Conta criada — verifique o e-mail e confirme o código');
  // })
  // .catch(err => {
  //   console.error(err);
  // });
  // }
}
