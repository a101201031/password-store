import { HostTypes } from 'model';
export interface AccountTypes {
  host: HostTypes;
  account_id: string;
  password?: string;
  created_date: Date;
  last_change_date: Date;
  password_score: number;
}
