export interface AttendanceStatusRequest {
  id: number;
  date: Date;
}

export interface AttendanceStatusResponse {
  checkIn: string | null;
  checkOut: string | null;
}
