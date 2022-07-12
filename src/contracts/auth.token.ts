import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNumber, IsString, Length } from 'class-validator';

// For safety we'll exclude everything from being transormed by placing a @Exclude() decorator on the class declaration
@Exclude()
export class AccessTokenView {

  @Expose()
  // We can start adding validation decorators that specify exactly what we expect from the object we will be validating
  @IsString()
  public token: string;

  @Expose()
  @IsNumber()
  public expiresIn: string;
}