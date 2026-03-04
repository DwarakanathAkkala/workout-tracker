import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './entities/workout.entity';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { UserWorkout } from './entities/user-workout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, UserWorkout])],
  providers: [WorkoutsService],
  controllers: [WorkoutsController],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}