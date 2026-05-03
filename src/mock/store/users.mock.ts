import { UserRole, UserStatus } from "@/types/admin";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  lastActive: string;
  totalBookings: number;
  totalListings: number;
  suspendReason?: string;
  isVerified: boolean;
  avatar?: string;
}

const statuses: UserStatus[] = ["active", "suspended", "pending_verify", "banned"];

function pickStatus(i: number): UserStatus {
  if (i < 30) return "active";
  if (i < 40) return "suspended";
  if (i < 47) return "pending_verify";
  return "banned";
}

export const mockUsers: MockUser[] = Array.from({ length: 50 }, (_, i) => ({
  id: `usr_${String(i + 1).padStart(3, "0")}`,
  name: [
    "Aarav Shah", "Priya Mehta", "Rahul Gupta", "Sneha Patel", "Vikram Singh",
    "Divya Nair", "Rohit Verma", "Ananya Krishnan", "Arjun Reddy", "Kavya Rao",
    "Nitin Kumar", "Anjali Sharma", "Suresh Iyer", "Pooja Agarwal", "Manish Tiwari",
    "Riya Joshi", "Siddharth Das", "Meera Pillai", "Amit Pandey", "Neha Dubey",
    "Varun Mishra", "Swathi Nambiar", "Kartik Bansal", "Shreya Bhatt", "Aditya Saxena",
    "Pallavi Soni", "Gaurav Malhotra", "Tanvi Kulkarni", "Deepak Choudhary", "Simran Kaur",
    "Rajesh Nair", "Sunita Yadav", "Harish Menon", "Isha Kapoor", "Pavan Kumar",
    "Lakshmi Ganesh", "Mohit Aggarwal", "Shweta Patil", "Vijay Rajan", "Geeta Desai",
    "Chirag Thakkar", "Rekha Srinivasan", "Nikhil Bose", "Farida Khan", "Sameer Wagh",
    "Bindiya Jain", "Dhruv Mathur", "Nandita Rao", "Saurabh Chandra", "Usha Pillai",
  ][i],
  email: `user${i + 1}@example.com`,
  phone: `+91 ${9000000000 + i}`,
  role: i < 45 ? "user" : "admin",
  status: pickStatus(i),
  joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  totalBookings: Math.floor(Math.random() * 50),
  totalListings: Math.floor(Math.random() * 20),
  suspendReason: pickStatus(i) === "suspended" ? "Violation of rental policy" : undefined,
  isVerified: Math.random() > 0.3,
}));
