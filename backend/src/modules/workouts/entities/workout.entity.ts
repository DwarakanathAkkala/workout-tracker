import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum WorkoutDifficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  duration_minutes: number;

  @Column({
    type: 'enum',
    enum: WorkoutDifficulty,
    default: WorkoutDifficulty.BEGINNER,
  })
  difficulty: WorkoutDifficulty;

  @CreateDateColumn()
  created_at: Date;
}