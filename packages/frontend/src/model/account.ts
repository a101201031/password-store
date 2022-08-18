export interface AccountModel {
  aid: string;
  gid: string;
  service_name: string;
  authentication: string | 'standalone';
  service_account: string;
  password: string;
  last_password_changed: Date;
  updated_at: Date;
  created_at: Date;
}
