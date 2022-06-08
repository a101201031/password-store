export interface UserModel {
  email: string;
  uid: string;
  user_name: string;
  password: string;
  old_password?: string;
  last_password_change: Date;
  hash_key: string;
  two_fact_auth_type?: string;
  created_at: Date;
}
