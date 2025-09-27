// client/src/types/index.js

// =================================================================
// 1. UTILITY & GENERIC TYPES
// =================================================================

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {T} data
 */

/**
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {T[]} items
 * @property {number} total
 * @property {number} page
 * @property {number} limit
 * @property {number} totalPages
 */

// =================================================================
// 2. USER/AUTH TYPES
// =================================================================

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} [phoneNumber]
 * @property {string} [profilePictureUrl]
 * @property {"user"|"admin"} role
 * @property {Date|string} createdAt
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 * @property {string} [otp]
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} password
 * @property {string} phone
 * @property {"patient"|"doctor"|"volunteer"} [role]
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {User} user
 */

// =================================================================
// 3. HEALTH RECORD TYPES
// =================================================================

/**
 * @typedef {Object} HealthRecord
 * @property {string} _id
 * @property {string} userId
 * @property {"VITAL"|"LAB_RESULT"|"MEDICATION"|"APPOINTMENT"|"OTHER"} recordType
 * @property {string} title
 * @property {string} [description]
 * @property {Date|string} recordDate
 * @property {string[]} [tags]
 * @property {string} [hospital]
 * @property {string} [doctorId]
 * @property {string[]} [fileUrls]
 * @property {Object} [metadata]
 * @property {Date|string} createdAt
 * @property {Date|string} updatedAt
 */

/**
 * @typedef {Object} CreateHealthRecordData
 * @property {"VITAL"|"LAB_RESULT"|"MEDICATION"|"APPOINTMENT"|"OTHER"} recordType
 * @property {string} title
 * @property {string} [description]
 * @property {Date|string} recordDate
 * @property {string[]} [tags]
 * @property {string} [hospital]
 * @property {string} [doctorId]
 * @property {string[]} [fileUrls]
 * @property {Object} [metadata]
 * @property {FileList} [files]
 * @property {VitalSigns} [vitalSigns]
 */

/**
 * @typedef {Object} HealthSummary
 * @property {number} totalRecords
 * @property {Date|string} lastRecordDate
 * @property {number} vitalsCount
 * @property {number} labResultsCount
 * @property {number} recentInsightsCount
 */

/**
 * @typedef {Object} VitalSigns
 * @property {string} [bloodPressure]
 * @property {number} [heartRate]
 * @property {number} [bloodSugar]
 */

/**
 * @typedef {Object} HealthRiskAssessments
 * @property {"low"|"medium"|"high"|"critical"} riskLevel
 * @property {string} details
 */

// =================================================================
// 4. NOTIFICATION/REMINDER TYPES
// =================================================================

/**
 * @typedef {Object} Reminder
 * @property {string} _id
 * @property {string} userId
 * @property {string} title
 * @property {Date|string} time
 * @property {"medication"|"appointment"|"general"} type
 * @property {boolean} isCompleted
 * @property {Date|string} createdAt
 */

/**
 * @typedef {Object} CreateReminderData
 * @property {string} title
 * @property {Date|string} time
 * @property {"medication"|"appointment"|"general"} type
 */

/**
 * @typedef {Object} NotificationPreferences
 * @property {boolean} emailNotifications
 * @property {boolean} smsNotifications
 * @property {boolean} appNotifications
 */

// =================================================================
// 5. AI INSIGHT TYPES
// =================================================================

/**
 * @typedef {Object} AIInsight
 * @property {string} _id
 * @property {string} userId
 * @property {string} title
 * @property {string} message
 * @property {"low"|"medium"|"high"|"critical"} severity
 * @property {"health_risk"|"trend_analysis"|"medication_alert"|"general_advice"} type
 * @property {number} confidence
 * @property {string[]} recommendations
 * @property {Array<{dataType: string, value: string, recordId: string}>} dataUsed
 * @property {boolean} isRead
 * @property {Date|string} createdAt
 */

// Since these are types only, we don’t need to export anything at runtime.
module.exports = {};
