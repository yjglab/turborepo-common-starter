import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  NotContains,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDuplicationDTO {
  @IsString()
  email: string;
}

export class EmailConfirmationDTO {
  @IsEmail()
  email: string;

  @IsString()
  userInputCode: string;

  @IsString()
  confirmationCode: string;
}

export class RegisterLocalDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty({
    message: '이메일은 빈칸을 포함할 수 없습니다',
  })
  @IsEmail(
    {},
    {
      message: '이메일 형식이 아닙니다',
    },
  )
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty({
    message: '표시 이름을 입력해주세요',
  })
  @Length(3, 12, {
    message: '표시 이름은 3~12자(영문 기준) 사이여야 합니다',
  })
  @Matches(/^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{3,12}$/, {
    message:
      '표시 이름은 3~12자 이하의 영문, 숫자 또는 한글로 구성되어야 합니다',
  })
  displayName: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty({
    message: '비밀번호를 입력해주세요',
  })
  @NotContains(' ', {
    message: '비밀번호는 빈칸을 포함할 수 없습니다',
  })
  @Length(3, 14, {
    message: '비밀번호는 3~14자 사이여야 합니다.',
  })
  password: string;

  @IsString()
  position: string;
}

export class LoginLocalDto {
  @IsNotEmpty({
    message: '이메일은 빈칸을 포함할 수 없습니다',
  })
  @IsEmail(
    {},
    {
      message: '이메일 형식이 아닙니다',
    },
  )
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty({
    message: '비밀번호를 입력해주세요',
  })
  @NotContains(' ', {
    message: '비밀번호는 빈칸을 포함할 수 없습니다',
  })
  @Length(3, 14, {
    message: '비밀번호는 3~14자 사이여야 합니다.',
  })
  password: string;
}
