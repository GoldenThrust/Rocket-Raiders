export interface User {
  username: string;
  email: string;
  image: string | null;
  rank: string;
  total_kills: number;
}

export interface UserState {
  isAuthenticated: boolean;
  user: any;
}
