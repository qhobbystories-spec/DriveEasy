export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO extends LoginDTO {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface BookingDTO {
  carId: string;
  pickupLocation: string;
  returnLocation: string;
  pickupDate: Date;
  returnDate: Date;
  pickupTime: string;
  returnTime: string;
  insurance: boolean;
  driverRequired: boolean;
  numberOfDrivers: number;
  specialRequest?: string;
}

export interface PaymentDTO {
  bookingId: string;
  amount: number;
  currency: string;
  method: string;
}

export interface ReviewDTO {
  carId: string;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface ContactDTO {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errors?: any[];
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
