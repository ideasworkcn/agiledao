export interface WorkItem {
    id: string;
    title: string;
    description: string;
    date: string;
    hours: number;
    userId: string;
  }
  
  export interface User {
    id: string;
    email: string;
    password?: string;  // 添加可选密码字段
    name?: string;
    position?: string;
    role: 'Team Member' | 'Scrum Master' | 'Product Owner' | string;  // 允许其他字符串值
    created_at: string;
    status: 'Active' | 'Inactive';
    assigned_tasks?: Task[];  // 作为任务分配者
    member_tasks?: Task[];    // 作为任务执行者
  }
  
export interface Product {
    id: string;
    name: string;
    description: string;
    manager: string;
    start_date: string;
    due_date: string;
    status: string;
  }


export interface UserStory {
  id: string;
  number: number;
  name: string;
  importance: number;
  estimate: number;
  howtodemo: string;
  px: number;
  fzr: string;
  status: 'To Do' | 'In Progress' | 'Done';
  feature_id: string;
  product_id: string;
  feature?: Feature;
  tasks?: Task[];
  sprint_user_stories?: SprintUserStory[];
}

  export interface Sprint {
    id: string;
    product_id: string;
    name: string;
    goal: string;
    start_date: string;
    end_date: string;
    demo_date: string;
    estimate_velocity: number;
    actual_velocity: number;
    daily_standup: string;
    sprint_review: string;
    status: string;
    sprint_user_stories: SprintUserStory[];
  }

  export interface SprintUserStory {
    id: string;
    user_story_id: string;
    sprint_id: string;
    user_story?: UserStory;  
    sprint?: Sprint;         
  }

  
  export interface Feature {
    id: string;
    name: string;
    px: number;
    epic_id: string;
    userstories: UserStory[];
  }
  
  export interface Epic {
    id: string;
    product_id: string;
    name: string;
    px: number;
    features: Feature[];
  }

  export interface Task {
    id: string;
    name: string;
    description: string;
    product_id: string;
    user_story_id: string;
    sprint_id: string;
    member_id: string;
    assigner_id: string;
    px: number;
    estimated_hours: number;
    hours: number;
    start_time: string |null;
    end_time: string|null;
    create_time: string|null;
    status: "To Do" | "In Progress" | "Done";
    user_story?: UserStory;
    task_hours?: TaskHour[];
    assigner?: User;
    member?: User;
    
  }

  export interface TaskHour {
    id: string;
    note: string;
    product_id: string;
    sprint_id: string;
    task_id: string;
    member_id: string;
    create_time: string;
    hours: number;
    task?: Task;
  }

  export interface BurndownItem {
    date: string;
    remainingHours: number;
  }

  export interface WorkLoadItem {
    assigner:string,
    workload_hours:number
  }

  export interface VelocityItem{
    sprint_name:string,
    completed_story_points:number
  }

  export interface TaskHourTableItem {
    product: string;
    user_story: string;
    task: string;
    hours: number;
    note: string;
    create_time: string;
    user_id: string;
  }