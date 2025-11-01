import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Issue } from '../../issues/entities/issue.entity';
import { CustomField } from './custom-field.entity';

@Entity('custom_field_value')
@Unique(['issueId', 'customFieldId'])
export class CustomFieldValue {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'issue_id', type: 'bigint' })
  issueId: string;

  @ManyToOne(() => Issue)
  @JoinColumn({ name: 'issue_id' })
  issue: Issue;

  @Column({ name: 'custom_field_id', type: 'bigint' })
  customFieldId: string;

  @ManyToOne(() => CustomField)
  @JoinColumn({ name: 'custom_field_id' })
  customField: CustomField;

  @Column({ name: 'value', type: 'text', nullable: true })
  value: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
