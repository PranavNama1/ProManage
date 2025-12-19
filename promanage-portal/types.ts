
export interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Client {
  id: string;
  name: string;
  description: string;
  designation: string;
  image: string;
}

export interface ContactResponse {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  email: string;
  createdAt: string;
}

export type AppView = 'landing' | 'admin';
