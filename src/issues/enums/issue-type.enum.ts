/**
 * Issue Type - Jira Issue Types
 *
 * Standard Jira issue types hierarchy:
 * - Epic: Large body of work that can be broken down into stories
 * - Story: User story with business value
 * - Task: A task that needs to be done
 * - Bug: A problem that needs to be fixed
 * - Subtask: A subtask of another issue
 */
export enum IssueType {
  EPIC = 'epic',
  STORY = 'story',
  TASK = 'task',
  BUG = 'bug',
  SUBTASK = 'subtask',
}
