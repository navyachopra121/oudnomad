import { IsBoolean, IsOptional } from 'class-validator';

export class MockPayDto {
  @IsBoolean()
  @IsOptional()
  simulateFailure?: boolean = false;
}
