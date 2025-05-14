export interface Task {
  id?: string;
  title: string;
  description: string;
  isCompleted: boolean;
  ownerId: string;
  createdAt?: any;
  updatedAt?: any;
}