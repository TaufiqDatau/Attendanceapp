/* Replace with your SQL commands */
CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50),
  `email` varchar(255) UNIQUE NOT NULL COMMENT 'Used for login and communication',
  `phone_number` varchar(20) UNIQUE,
  `birth_date` date,
  `birth_place` varchar(100),
  `full_address` text,
  `home_latitude` decimal(10,8) NOT NULL COMMENT 'Designated home latitude for location check',
  `home_longitude` decimal(11,8) NOT NULL COMMENT 'Designated home longitude for location check',
  `profile_picture_url` varchar(255),
  `status` ENUM ('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `auth` (
  `user_id` integer PRIMARY KEY COMMENT 'One-to-one relationship with users table',
  `password_hash` varchar(255) NOT NULL COMMENT 'NEVER store plain text passwords',
  `last_login_at` timestamp,
  `failed_login_attempts` integer DEFAULT 0,
  `is_locked` boolean DEFAULT false COMMENT 'Lock account after too many failed attempts',
  `password_reset_token` varchar(255),
  `password_reset_expires_at` timestamp,
  `refresh_token` text
);

CREATE TABLE `attendance` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer NOT NULL,
  `attendance_date` date NOT NULL COMMENT 'The specific date of the attendance record',
  `time` timestamp NOT NULL,
  `latitude` decimal(10,8) NOT NULL COMMENT 'Actual latitude at check-in for verification',
  `longitude` decimal(11,8) NOT NULL COMMENT 'Actual longitude at check-in for verification',
  `action` ENUM ('checkin', 'checkout', 'onLeave') NOT NULL COMMENT 'Mark the action',
  `notes` text COMMENT 'Optional notes from the user for the day',
  `created_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `roles` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50) UNIQUE NOT NULL COMMENT 'e.g., "Admin", "Manager", "Employee"',
  `description` text
);

CREATE TABLE `leave_requests` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text NOT NULL,
  `status` ENUM ('pending', 'approved', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
  `approved_by_user_id` integer COMMENT 'Manager/Admin who approved the request',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `app_settings` (
  `setting_key` varchar(100) PRIMARY KEY COMMENT 'e.g., "check_in_radius_meters"',
  `setting_value` varchar(255) NOT NULL COMMENT 'e.g., "20"',
  `description` text
);

CREATE TABLE `user_roles` (
  `user_id` integer NOT NULL,
  `role_id` integer NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`)
);

CREATE UNIQUE INDEX `attendance_index_0` ON `attendance` (`user_id`, `attendance_date`);

ALTER TABLE `auth` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `attendance` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_roles` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_roles` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `leave_requests` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `leave_requests` ADD FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`);

