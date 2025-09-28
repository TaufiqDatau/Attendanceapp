-- Drop tables with foreign key dependencies first
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `app_settings`;
DROP TABLE IF EXISTS `leave_requests`;
DROP TABLE IF EXISTS `attendance`;
DROP TABLE IF EXISTS `auth`;

-- Drop the tables that were referenced by other tables
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;