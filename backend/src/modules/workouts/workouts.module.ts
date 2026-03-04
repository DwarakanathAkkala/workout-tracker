import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './entities/workout.entity';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Workout])],
  providers: [WorkoutsService],
  controllers: [WorkoutsController],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}