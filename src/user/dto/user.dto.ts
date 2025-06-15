import { Exclude, Expose, Transform } from 'class-transformer'
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { format } from 'date-fns'

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose({ name: 'id' })
  userId: number

  @IsEmail()
  @IsNotEmpty()
  email: string

  @Exclude()
  @IsString()
  password: string

  @IsNumber()
  targetExpense: number | null

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  createdDate: Date

  @IsDate()
  @Transform(({ value }) => (value ? format(value, 'yyyy-MM-dd HH:mm:ss') : value))
  deletedDate: Date | null
}
