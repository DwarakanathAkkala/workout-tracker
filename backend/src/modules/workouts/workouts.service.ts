import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private workoutRepository: Repository<Workout>,
  ) {}

  // Logic: Fetches all available workouts from the database.
  // We order them by ID so the list remains consistent for the user.
  async findAll(): Promise<Workout[]> {
    return this.workoutRepository.find({
      order: { id: 'ASC' },
    });
  }
}