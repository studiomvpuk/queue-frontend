export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName?: string;
  email?: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF' | 'ADMIN';
  avatar?: string;
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  email?: string;
  slotDurationMin: number;
  maxQueueSize: number;
  walkInPercent: number;
  hoursOpen: string;
  hoursClose: string;
  ownerId: string;
  createdAt: string;
  priorityEnabled?: boolean;
  priorityPrice?: number;
  virtualEnabled?: boolean;
}

export interface Booking {
  id: string;
  code: string;
  locationId: string;
  userId: string | null;
  user?: { id: string; firstName: string; phone: string } | null;
  walkInName?: string | null;
  walkInPhone?: string | null;
  slotStart: string;
  slotEnd: string;
  status: 'PENDING' | 'CONFIRMED' | 'ARRIVED' | 'SERVING' | 'SERVED' | 'NO_SHOW' | 'CANCELLED';
  source: 'APP' | 'WEB' | 'USSD' | 'WALK_IN';
  position?: number;
  isPriority?: boolean;
  createdAt: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
  isNewUser: boolean;
}

export interface ApiResponse<T> {
  data: T;
  requestId: string;
  timestamp: string;
}

export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  requestId: string;
  timestamp: string;
}

export interface QueueUpdate {
  locationId: string;
  peopleInQueue: number;
  nowServingCode: string;
  bookings: Booking[];
}

export interface BookingUpdate {
  bookingId: string;
  status: string;
  position: number;
}

export interface PaymentInitResponse {
  authorizationUrl: string;
  reference: string;
}

export interface ApiClient {
  id: string;
  name: string;
  clientId: string;
  createdAt: string;
  scopes: string[];
}

export interface ApiClientCreateResponse {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}
