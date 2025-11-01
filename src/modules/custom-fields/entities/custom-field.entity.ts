import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('custom_field')
export class CustomField {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ name: 'field_type', length: 50 })
  fieldType: string; // text, number, date, select, multiselect, textarea, url, user, etc.

  @Column({ name: 'field_key', unique: true, length: 100 })
  fieldKey: string; // unique identifier for the field (e.g., custom_field_1)

  @Column({ name: 'default_value', type: 'text', nullable: true })
  defaultValue: string;

  @Column({ name: 'is_required', default: false })
  isRequired: boolean;

  @Column({ name: 'is_searchable', default: true })
  isSearchable: boolean;

  @Column({ name: 'options', type: 'simple-json', nullable: true })
  options: string[]; // For select/multiselect fields

  @Column({ name: 'validation_regex', length: 500, nullable: true })
  validationRegex: string;

  @Column({ name: 'context_projects', type: 'simple-array', nullable: true })
  contextProjects: string[]; // Project IDs where this field applies

  @Column({ name: 'context_issue_types', type: 'simple-array', nullable: true })
  contextIssueTypes: string[]; // Issue types where this field applies

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
