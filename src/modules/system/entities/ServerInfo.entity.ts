import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('server_info')
export class ServerInfo {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '9.4.0' })
  @Column({ type: 'varchar', length: 50 })
  version: string;

  @ApiProperty({ example: '940001' })
  @Column({ type: 'varchar', length: 50 })
  buildNumber: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @Column({ type: 'timestamp' })
  buildDate: Date;

  @ApiProperty({ example: 'https://mycompany.atlassian.net' })
  @Column({ type: 'varchar', length: 255 })
  baseUrl: string;

  @ApiProperty({ example: 'production' })
  @Column({ type: 'varchar', length: 50, default: 'production' })
  deploymentType: string;

  @ApiProperty({ example: 'My Company Jira' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  serverTitle?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
