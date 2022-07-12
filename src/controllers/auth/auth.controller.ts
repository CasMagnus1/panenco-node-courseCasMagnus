import { Body, Representer, StatusCode } from "@panenco/papi";
import { JsonController, Post } from "routing-controllers";
import { LoginBody } from "../../contracts/auth.body";
import { AccessTokenView } from "../../contracts/auth.token";
import { login } from "./handlers/login.handlers";

@JsonController("/auth")
export class AuthController {
    @Post("/tokens")
    @Representer(AccessTokenView, StatusCode.ok)
    async loginUser(@Body() body: LoginBody) {
      return login(body);
    }
}