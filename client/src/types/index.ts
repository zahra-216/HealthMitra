//client/src/types/index.ts
// =================================================================
// 1. UTILITY & GENERIC TYPES
// =================================================================

/**
 * Interface for a standard success/error API response body.
 * @template T The type of the main data payload.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Interface for a paginated API response wrapper.
 * @template T The type of the items in the response array.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =================================================================
// 2. USER/AUTH TYPES
// =================================================================

/**
 * Defines the structure of a complete User object.
 */
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  role: "user" | "admin";
  createdAt: Date | string;
}

export interface LoginCredentials {
  email: string;
  password: string; // make it required
  otp?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string; // ✅ changed from phoneNumber to phone
  role?: "patient" | "doctor" | "volunteer";
}

/**
 * Defines the structure of the data returned after a successful login or profile fetch.
 */
export interface AuthResponse {
  token: string;
  user: User;
}

// =================================================================
// 3. HEALTH RECORD TYPES
// =================================================================

// 1. ADD THE FILE ITEM INTERFACE
/**
 * Defines the structure for an individual file attachment.
 */
export interface FileItem {
  url: string;
  originalName: string;
  size: number;
  mimeType: string;
  ocrText?: string;
}

/**
 * Defines the complete structure of a Health Record object returned from the server.
 */
export interface HealthRecord {
  _id: string;
  userId: string;
  type?: string;
  recordType: "VITAL" | "LAB_RESULT" | "MEDICATION" | "APPOINTMENT" | "OTHER";
  title: string;
  description?: string;
  recordDate: Date | string;
  tags?: string[];
  hospital?: string; // Added this property
  doctorId?: string; // Added this property
  fileUrls?: string[]; // Used for file uploads (Cloudinary)
  metadata?: Record<string, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
  // 2. ADD THE FILES PROPERTY TO HealthRecord
  files?: FileItem[];
}

/**
 * Type used for data when creating a NEW health record (omits server-generated fields).
 */
export type CreateHealthRecordData = Omit<
  HealthRecord,
  "_id" | "userId" | "createdAt" | "updatedAt"
> & {
  // Allows files to be passed to the API
  files?: FileList;
  // Specific metadata for vital signs records
  vitalSigns?: VitalSigns;
};

/**
 * Defines the structure for a summary of the user's health data (e.g., for the Dashboard).
 */
export interface HealthSummary {
  totalRecords: number;
  lastRecordDate: Date | string;
  vitalsCount: number;
  labResultsCount: number;
  recentInsightsCount: number;
  // Add more summary fields as needed
}

/**
 * Defines the structure for basic vital signs data (likely used in ai.service.ts).
 */
export interface VitalSigns {
  bloodPressure?: string; // e.g., "120/80"
  heartRate?: number;
  bloodSugar?: number;
  // Add more vitals
}

/**
 * Defines the structure for health risk assessments.
 */
export interface HealthRiskAssessments {
  riskLevel: "low" | "medium" | "high" | "critical";
  details: string;
  // Add more assessment fields
}

// =================================================================
// 4. NOTIFICATION/REMINDER TYPES
// =================================================================

/**
 * Defines the structure for a Reminder object.
 */
export interface Reminder {
  _id: string;
  userId: string;
  title: string;
  time: Date | string;
  type: "medication" | "appointment" | "general";
  isCompleted: boolean;
  createdAt: Date | string;
}

/**
 * Type used for creating a new Reminder.
 */
export type CreateReminderData = Omit<
  Reminder,
  "_id" | "userId" | "createdAt" | "isCompleted"
>;

/**
 * Defines user preferences for receiving notifications.
 */
export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appNotifications: boolean;
  // Add other preferences
}
// =================================================================
// 5. AI INSIGHT TYPES (Already discussed)
// =================================================================

/**
 * Defines the complete structure of an AI Insight object.
 */
export interface AIInsight {
  _id: string;
  userId: string;
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  type:
    | "health_risk"
    | "trend_analysis"
    | "medication_alert"
    | "general_advice";
  confidence: number;
  recommendations: string[];
  dataUsed: Array<{ dataType: string; value: string; recordId: string }>;
  isRead: boolean;
  createdAt: Date | string;
}

// ⚠️ IMPORTANT: Export everything to make it available via '@/types'
export * from "./index";
