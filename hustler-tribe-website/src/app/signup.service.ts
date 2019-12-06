import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  signup_url = "http://167.172.176.47:3000/signup_user";

  constructor(private _http: HttpClient) { }

  signup(email, refcode, newsletter, privacypolicy, country) {
    return this._http.post<any>(this.signup_url, {
      email: email,
      refcode: refcode,
      newsletter: newsletter,
      privacypolicy: privacypolicy,
      country: country
    });
  }
}
