import { IsISO8601, IsNotEmpty } from 'class-validator';

export class CompleteWorkoutDto {
  @IsISO8601() // Logic: Validates that the date is in YYYY-MM-DD format as per PDF
  @IsNotEmpty()
  completedAt: string;
}