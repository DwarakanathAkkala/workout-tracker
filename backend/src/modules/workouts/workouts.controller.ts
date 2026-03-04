import { Controller, Get } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { Workout } from './entities/workout.entity';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get() // Logic: Responds to GET /api/workouts
  async findAll(): Promise<Workout[]> {
    return this.workoutsService.findAll();
  }
}