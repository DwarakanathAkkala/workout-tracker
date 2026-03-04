import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity';
import { UserWorkout } from './entities/user-workout.entity';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private workoutRepository: Repository<Workout>,
    @InjectRepository(UserWorkout)
    private userWorkoutRepository: Repository<UserWorkout>,
  ) {}

  async findAll(): Promise<Workout[]> {
    return this.workoutRepository.find({ order: { id: 'ASC' } });
  }

  async completeWorkout(userId: number, workoutId: number, completedAt: string) {
    const workout = await this.workoutRepository.findOne({ where: { id: workoutId } });
    if (!workout) throw new NotFoundException('Workout not found');

    const completion = this.userWorkoutRepository.create({
      user_id: userId,
      workout_id: workoutId,
      completed_at: new Date(completedAt),
    });

    await this.userWorkoutRepository.save(completion);
    
    // Logic: PDF requires returning the updated streak immediately
    return this.getStreak(userId);
  }

  async getStreak(userId: number) {
    // 1. Get all unique completion dates for user, ordered newest to oldest
    const completions = await this.userWorkoutRepository.createQueryBuilder('uw')
      .where('uw.user_id = :userId', { userId })
      .select('DISTINCT DATE(uw.completed_at)', 'date')
      .orderBy('date', 'DESC')
      .getRawMany();

    if (completions.length === 0) return { streak: 0, lastWorkoutDate: null };

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentDateToCheck = today;
    const lastWorkoutDate = completions[0].date;

    // Logic: If the last workout wasn't today or yesterday, the streak is already 0
    const lastDate = new Date(lastWorkoutDate);
    lastDate.setHours(0, 0, 0, 0);
    
    const diffInDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays > 1) return { streak: 0, lastWorkoutDate };

    // 2. Loop through unique dates and check if they are consecutive
    for (const record of completions) {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);

      // If the record matches our expected consecutive date, increment
      if (recordDate.getTime() === currentDateToCheck.getTime()) {
        streak++;
        currentDateToCheck.setDate(currentDateToCheck.getDate() - 1);
      } else if (recordDate.getTime() < currentDateToCheck.getTime()) {
        // If there's a gap, break the loop
        break;
      }
    }

    return { streak, lastWorkoutDate };
  }

  // Logic: Fetches all completed workouts for a specific user.
  // We join with the 'workouts' table to get the Title and Difficulty for the UI.
  async getHistory(userId: number) {
    return this.userWorkoutRepository.find({
      where: { user_id: userId },
      relations: ['workout'], // Why? So the UI can show the workout name, not just the ID.
      order: { completed_at: 'DESC' },
    });
  }


}