import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingScreenComponent } from '@shared/components/loading-screen/loading-screen.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { CognitoService } from '@shared/services/cognito/cognito.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoadingComponent, LoadingScreenComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private cognitoService = inject(CognitoService);
  private router = inject(Router);

  protected userName = signal<string | null>(null);
  protected loadingUser = signal(false);
  protected loadingLogout = signal(false);

  ngOnInit(): void {
    this.loadUser();
  }

  async loadUser() {
    this.loadingUser.set(true);
    try {
      const userAttributes = await this.cognitoService.getCurrentUser();

      const userDisplayName = userAttributes?.name || userAttributes?.email || 'Usuário';
      this.userName.set(userDisplayName);
    } catch (err) {
      console.error('Erro ao carregar usuário', err);
      this.userName.set(null);
    } finally {
      this.loadingUser.set(false);
    }
  }

  async signOut() {
    this.loadingLogout.set(true);
    try {
      await this.cognitoService.signOut();
      this.router.navigateByUrl('/auth/signin');
    } catch (err) {
      console.error('Erro durante o logout', err);
    } finally {
      this.loadingLogout.set(false);
    }
  }
}
