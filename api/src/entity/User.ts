import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import {
  Field,
  InputType,
  ObjectType,
  ArgsType,
  AuthChecker,
  createUnionType,
} from "type-graphql";
import { Context } from "vm";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Base } from "./Base";
import { UserMeta } from "./UserMeta";
import passport from "passport";
import * as passportJWT from "passport-jwt";

@ObjectType()
@Entity()
export class User extends Base {
  @Field()
  @Column({ nullable: true })
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  password: string;

  @Field()
  @Column({ nullable: true })
  passwordHash?: string; //  @Column({ select: false })

  @OneToOne((type) => UserMeta, (user_meta) => user_meta.user, {
    cascade: true,
  })
  user_meta: UserMeta;
}

@ArgsType()
export class LoginInput implements Partial<User> {
  @Field((type) => String, { nullable: false })
  email: string;

  @Field((type) => String, { nullable: false })
  password: string;
}

interface ReturnMessages {
  message: string;
}

@ObjectType()
export class LoginFails implements ReturnMessages {
  @Field()
  message: string;
}

export const LoginOutputUnion = createUnionType({
  name: "LoginOutput", // the name of the GraphQL union
  types: () => [TokenEntity, LoginFails] as const, // function that returns tuple of object types classes
  resolveType: (value) => {
    // if value is array, this source comes off as single object
    if ("token" in value) {
      return TokenEntity; // we can return object type class (the one with `@ObjectType()`)
    }
    if ("message" in value) {
      return LoginFails; // or the schema name of the type as a string
    }
    return undefined;
  },
});

@InputType({ description: "Create New User Data" })
export class createUserInput implements Partial<User> {
  @Field((type) => String, { nullable: true })
  name: string;

  @Field((type) => String, { nullable: true })
  email: string;

  @Field((type) => String, { nullable: true })
  password: string;
}

export async function createToken(id: number): Promise<Token> {
  const expiresIn = 60 * 60;
  const secretOrKey = "secret";
  const user = { id };
  const token = jwt.sign(user, secretOrKey, { expiresIn });
  return { expires_in: new Date().getTime() + expiresIn * 1000, token };
}

export interface Token {
  expires_in: number;
  token: string;
}

@ObjectType()
export class TokenEntity implements Token {
  @Field((type) => Number)
  expires_in: number;
  @Field()
  token: string;
}

export const customAuthChecker: AuthChecker<Context> = (
  { root, args, context, info },
  roles
) => {
  // console.log(context);
  // here you can read user from context
  // and check his permission in db against `roles` argument
  // that comes from `@Authorized`, eg. ["ADMIN", "MODERATOR"]

  return true; // or false if access denied
};

passport.use(
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "secret",
    },
    (jwt_payload: any, done: any) => {
      User.findOne(jwt_payload.id)
        .then((user) => {
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        })
        .catch((err) => {
          return done(err, false);
        });
    }
  )
);

export const jwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (
      "operation-name" in req.headers &&
      req.headers["operation-name"] !== undefined &&
      typeof req.headers["operation-name"] === "string" &&
      ["SIGNIN", "LOGIN"].includes(req.headers["operation-name"])
    ) {
      return next();
    }
    if (err) {
      return res.status(401).end();
    }
    if (!user) {
      return res
        .status(401)
        .json({ errors: { message: info || "user unknown" } })
        .end();
    }

    req.user = user;
    return next();
  })(req, res, next);
