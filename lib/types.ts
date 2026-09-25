export interface Tag {
  tagId: number;
  tagName: string;
  color?: string | null;
}

export interface Department {
  departmentId: number;
  departmentName: string;
  departmentDescription: string;
  isActive: boolean;
}

export interface DepartmentDetail extends Department {
  projects: Project[];
}

export interface Project {
  projectId: number;
  projectName: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  status: number;
  departmentId: number;
  departmentName: string;
  isActive: boolean;
  createdDate: string;
}

export interface ProjectDetail extends Project {
  tasks: Task[];
}

export interface Task {
  taskId: number;
  title: string;
  description?: string | null;
  status: number;
  priority: number;
  dueDate?: string | null;
  projectId: number;
  projectName: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string | null;
  tags: Tag[];
}

export interface TaskDetail extends Task {
  departmentId: number;
  departmentName: string;
}

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
};
