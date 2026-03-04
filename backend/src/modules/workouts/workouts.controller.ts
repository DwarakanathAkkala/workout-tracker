import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { Workout } from './entities/workout.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompleteWorkoutDto } from './dto/complete-workout.dto';

@Controller()
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  // 1. Get All Workouts
  @Get('workouts')
  async findAll(): Promise<Workout[]> {
    return this.workoutsService.findAll();
  }

  // 2. Complete a Workout
  @UseGuards(JwtAuthGuard) // Logic: Protects this route. Only logged-in users can record data.
  @Post('users/:userId/workouts/:workoutId/complete')
  async completeWorkout(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('workoutId', ParseIntPipe) workoutId: number,
    @Body() dto: CompleteWorkoutDto,
  ) {
    return this.workoutsService.completeWorkout(userId, workoutId, dto.completedAt);
  }

  // 3. Get User Streak
  @UseGuards(JwtAuthGuard)
  @Get('users/:userId/streak')
  async getStreak(@Param('userId', ParseIntPipe) userId: number) {
    return this.workoutsService.getStreak(userId);
  }

  // 4. Get User Workout History
  @UseGuards(JwtAuthGuard)
  @Get('users/:userId/workout-history')
  async getHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.workoutsService.getHistory(userId);
  }
}