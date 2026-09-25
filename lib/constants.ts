export const projectStatuses = ["Not Started", "In Progress", "Completed", "On Hold"];
export const taskStatuses = ["To Do", "In Progress", "Done", "Cancelled"];
export const taskPriorities = ["Low", "Medium", "High", "Critical"];

export const projectStatusOptions = projectStatuses.map((label, value) => ({ label, value }));
export const taskStatusOptions = taskStatuses.map((label, value) => ({ label, value }));
export const taskPriorityOptions = taskPriorities.map((label, value) => ({ label, value }));
