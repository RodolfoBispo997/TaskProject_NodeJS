import { ExecutionContext, Injectable, Scope } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequestContextService } from "../../services/request-context/request-context.service";
import { Observable } from "rxjs";

@Injectable({ scope: Scope.REQUEST })
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly requestContext: RequestContextService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = (await super.canActivate(context)) as boolean;

    if (isAuthenticated) {
      const request = context.switchToHttp().getRequest();

      this.requestContext.setUser(request.user);
    }

    return isAuthenticated;
  }
}
