export interface getAllUserRequest {
  page: number;
  limit: number;
}

export interface user {
  key: string;
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  birth_date?: string;
  birth_place?: string;
  full_address?: string;
  home_latitude?: number;
  home_longitude?: number;
  status: "active" | "inactive" | "suspended";
}
