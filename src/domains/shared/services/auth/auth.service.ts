import { HttpBackend } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

export type Model = {
  username: string;
  password: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {


  login(model: Model) {

  };

  private readonly http = inject(HttpBackend);
}
