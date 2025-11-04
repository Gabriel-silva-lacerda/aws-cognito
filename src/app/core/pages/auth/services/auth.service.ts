import { Injectable, signal, inject, computed } from '@angular/core';
import { CognitoService } from '@shared/services/cognito/cognito.service';
import { iUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cognitoService = inject(CognitoService);

  public user = signal<iUser | null>(null);
  public loading = signal(false);

  public async initialize() {
    this.loading.set(true);
    try {
      const cognitoUser = await this.cognitoService.getCurrentUser();
      const mappedUser: iUser = {
        id: cognitoUser.sub || '',
        email: cognitoUser.email || '',
        name: cognitoUser.name,
        email_verified: cognitoUser.email_verified,
      };

      this.user.set(mappedUser);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      this.user.set(null);
    } finally {
      this.loading.set(false);
    }
  }

}
