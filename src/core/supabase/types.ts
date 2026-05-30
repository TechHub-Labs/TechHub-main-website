// ─── Database type definitions (mirrors Supabase schema) ─────────────────────

export type Role = 'member' | 'executive' | 'super_admin';

export interface Profile {
  id: string;
  role: Role;
  email: string | null;
  created_at: string;
}

export interface Member {
  id: string;
  user_id: string | null;
  name: string | null;
  role_title: string | null;
  year: string | null;
  category: string[];
  quote: string | null;
  avatar_url: string | null;
  skills: string[];
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  projects: string[];
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Executive {
  id: string;
  user_id: string | null;
  name: string | null;
  role_title: string | null;
  category: string[];
  quote: string | null;
  avatar_url: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  tech: string[];
  status: string | null;
  category: string | null;
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  launch_date: string | null;
  in_development: boolean;
  created_at: string;
  updated_at: string;
}

// Supabase generated types shape
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      members: {
        Row: Member;
        Insert: Partial<Member>;
        Update: Partial<Member>;
      };
      executives: {
        Row: Executive;
        Insert: Partial<Executive>;
        Update: Partial<Executive>;
      };
      projects: {
        Row: Project;
        Insert: Partial<Project> & { title: string };
        Update: Partial<Project>;
      };
    };
  };
}
