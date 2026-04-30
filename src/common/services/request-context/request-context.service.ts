import { Injectable, Scope } from "@nestjs/common";
import { User } from "../../../generated/prisma";

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private _user?: User;

  setUser(user: User): void {
    this._user = user;
  }

  getUser(): User {
    if (!this._user) {
      throw new Error("User not set in RequestContext");
    }
    return this._user;
  }

  getUserId(): string {
    if (!this._user) {
      throw new Error("User not set in RequestContext");
    }
    return this._user.id;
  }
}
