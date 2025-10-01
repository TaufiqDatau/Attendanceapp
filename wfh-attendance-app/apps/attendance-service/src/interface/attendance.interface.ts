import { RowDataPacket } from "mysql2";

export interface AttendanceStatusRequest {
  id: number;
  date: Date;
}

export interface AttendanceStatusResponse {
  checkIn: string | null;
  checkOut: string | null;
}

export interface AttendanceHistoryAllRequest {
  page: number;
  limit: number;
}

export type RawAttendanceRecord = {
  user_id: number;
  full_name: string;
  email: string;
  attendance_date: string; // Or Date, depending on driver config
  checkin_time: string | null;
  checkin_object_name: string | null;
  checkout_time: string | null;
  checkout_object_name: string | null;
} & RowDataPacket;

// The request payload containing pagination info
export interface AttendanceHistoryAllRequest {
  page: number;
  limit: number;
}

export interface AttendanceHistoryUser {
  id: number,
  startDate: Date,
  endDate: Date
}

// The final, structured response object
export interface ApiResponse {
  data: Omit<RawAttendanceRecord, keyof RowDataPacket>[];
  totalItem: number;
  currentPage: number;
}
export type AttendanceStats = {
  total_attendance_days: number;
  total_leaves: number;
  total_incomplete_days: number;
} & RowDataPacket;