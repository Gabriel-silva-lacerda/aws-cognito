import { Injectable } from "@angular/core";
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  fetchUserAttributes,
  updateUserAttributes,
  resendSignUpCode
} from 'aws-amplify/auth';

@Injectable({ providedIn: 'root' })
export class CognitoService {
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
    return await signOut();
  }

  async getCurrentUser() {
    return await fetchUserAttributes();
  }

  async updateUser(attributes: Record<string, string>) {
    return await updateUserAttributes({ userAttributes: attributes });
  }
}
