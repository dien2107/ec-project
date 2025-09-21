
// Base User interface - matching database schema
export interface User {
  user_id?: number;
  role_id?: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  is_active?: boolean;
  is_verify?: boolean;
  created_at?: string;
  updated_at?: string;
}

// For display purposes - simplified version
export interface UserDisplayInfo {
  username: string;
  email: string;
  full_name: string;
  phone: string;
  is_active?: boolean;
  is_verify?: boolean;
  created_at?: string;
}
export interface UserInfoViewProps extends UserDisplayInfo {
  onEdit: () => void;
}
 
export interface UserInfoEditProps extends UserDisplayInfo {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
  open: boolean;
}