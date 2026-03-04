import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Workout } from './workout.entity';

@Entity('user_workouts')
export class UserWorkout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  workout_id: number;

  @Index() // Logic: Indexing for performance as we will filter/sort by date frequently
  @Column({ type: 'timestamp' })
  completed_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Workout, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workout_id' })
  workout: Workout;
}