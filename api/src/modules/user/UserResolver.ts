import {
  Arg,
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Ctx,
  Authorized,
  ObjectType,
  Field,
  FieldResolver,
  Root,
  createParamDecorator,
} from "type-graphql";
import { getRepository } from "typeorm";
import {
  User,
  createUserInput,
  createToken,
  Token,
  TokenEntity,
  LoginInput,
  LoginOutputUnion,
} from "../../entity/User";
import * as bcrypt from "bcrypt";
import { UserMeta } from "../../entity/UserMeta";

@Resolver((of) => User)
export class UserResolver {
  private saltRounds = 10;

  @Mutation(() => TokenEntity)
  async createUser(@Arg("data") newUserData: createUserInput): Promise<Token> {
    const new_user = User.create(newUserData);
    new_user.passwordHash = await this.getHash(newUserData.password);
    await new_user.save();

    const meta = new UserMeta();
    meta.user = new_user;
    await getRepository(UserMeta).save(meta);

    return await createToken(new_user.id);
  }

  async getHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  @Query((returns) => [LoginOutputUnion])
  async login(
    @Args() loginArgs: LoginInput
  ): Promise<Array<typeof LoginOutputUnion>> {
    let this_user: User | undefined;
    if (!!loginArgs.email && !!loginArgs.password) {
      this_user = await User.findOne({
        email: loginArgs.email,
      });
    } else {
      return [{ message: "Information were not fully given." }];
    }

    if (this_user === undefined || this_user.passwordHash === undefined) {
      return [{ message: "There is no user information." }];
    } else {
      let result: boolean = await this.compareHash(
        loginArgs.password,
        this_user.passwordHash
      );
      if (result === true) {
        return [await createToken(this_user.id)];
      } else {
        return [{ message: "login fails." }];
      }
    }
  }

  @Authorized(["ADMIN"])
  @Query((returns) => User)
  async getOneUser(@Arg("id") id: number): Promise<User | undefined> {
    return await User.findOneOrFail(id);
  }
}
