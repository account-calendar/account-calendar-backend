import { Exclude } from 'class-transformer'
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsEmail()
  @IsNotEmpty()
  email: string

  @Exclude()
  @IsString()
  password: string

  @IsNumber()
  target_expense: number | null

  @IsDate()
  @IsNotEmpty()
  created_date: Date

  @IsDate()
  deleted_date: Date | null
}
