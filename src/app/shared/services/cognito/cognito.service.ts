import { Injectable } from "@angular/core";
import {
  signUp,
  confirmSignUp,
  resendSignUpCode,
  signIn,
  signOut,
  fetchUserAttributes,
  updateUserAttributes,
  resetPassword,
  confirmResetPassword,
  fetchAuthSession,
  AuthSession
} from 'aws-amplify/auth';

@Injectable({ providedIn: 'root' })
export class CognitoService {
  private cachedSession: AuthSession | null = null;

  async signUp(email: string, password: string, name?: string) {
    return await signUp({
      username: email,
      password,
      options: { userAttributes: { name } },
    });
  }

  async confirmSignUp(email: string, code: string) {
    return await confirmSignUp({ username: email, confirmationCode: code });
  }

  async resendSignUpCode(email: string) {
    return await resendSignUpCode({ username: email });
  }


  async signIn(email: string, password: string) {
    return await signIn({ username: email, password });
  }

  async signOut() {
    await signOut();
    this.cachedSession = null;
  }

  async getCurrentUser() {
    return await fetchUserAttributes();
  }

  async updateUser(attributes: Record<string, string>) {
    return await updateUserAttributes({ userAttributes: attributes });
  }

  async forgotPassword(email: string) {
    return await resetPassword({ username: email });
  }

  async confirmForgotPassword(email: string, code: string, newPassword: string) {
    return await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });
  }

  async getSession() {
    if (this.cachedSession) return this.cachedSession;
    try {
      const session = await fetchAuthSession();
      if (!session?.tokens?.idToken) return null;
      this.cachedSession = session;
      return session;
    } catch {
      return null;
    }
  }
}
