import { AccountStatus } from '@/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
  })
  @IsNotEmpty({
    message: '표시 이름을 입력해주세요',
  })
  @Length(4, 12, {
    message: '표시 이름은 4~12자(영문 기준) 사이여야 합니다',
  })
  @Matches(/^[\w](?!.*?\.{2})[\w. ]{1,12}[\w]$/, {
    message:
      '표시 이름은 문자, 숫자, 단어 사이의 공백만 포함할 수 있으며 최대 12자까지 가능합니다.',
  })
  displayName?: string;

  @ApiProperty({
    required: false,
  })
  status?: AccountStatus;
}
