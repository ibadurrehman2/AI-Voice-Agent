import { LoginResponse, User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';

// Simulate a network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const login = async (email: string): Promise<LoginResponse> => {
  await delay(800); // Simulate API call

  const user = MOCK_USERS.find((u) => u.email === email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Generate a fake JWT-like token
  const token = `ey...mock.token.${Date.now()}.${user.id}`;

  return {
    user,
    token,
  };
};

export const register = async (email: string, name: string): Promise<LoginResponse> => {
  await delay(1000); // Simulate API call
  
  // Create new user mock
  const newUser: User = {
    id: `u_${Date.now()}`,
    email,
    name,
    role: UserRole.ADMIN, // Creator is admin
    avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=random`
  };

  const token = `ey...mock.token.${Date.now()}.${newUser.id}`;

  return {
    user: newUser,
    token
  };
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await delay(1000);
  if (!email.includes('@')) {
     throw new Error("Invalid email address");
  }
  // Mock success regardless of email existence for security best practices (user enumeration prevention)
  return;
};

export const validateToken = async (token: string): Promise<User | null> => {
  await delay(400);
  if (!token) return null;
  // In a real app, verify signature. Here we just return the admin user if token exists for simplicity
  // or parse the mock token logic if we wanted to be fancy.
  return MOCK_USERS[0]; 
};