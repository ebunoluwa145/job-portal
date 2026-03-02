CREATE TABLE `jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`location` text NOT NULL,
	`description` text NOT NULL,
	`salary` text,
	`category` text NOT NULL,
	`job_type` text NOT NULL,
	`link` text,
	`employee_id` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`employee_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
