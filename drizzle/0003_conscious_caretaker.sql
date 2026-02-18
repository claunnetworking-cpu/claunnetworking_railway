CREATE TABLE `conversions` (
	`id` varchar(36) NOT NULL,
	`resourceType` enum('job','course','link') NOT NULL,
	`resourceId` varchar(36) NOT NULL,
	`sessionId` varchar(64),
	`referrer` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_events` (
	`id` varchar(36) NOT NULL,
	`eventType` enum('view','click','share','conversion') NOT NULL,
	`resourceType` enum('job','course','link') NOT NULL,
	`resourceId` varchar(36) NOT NULL,
	`sessionId` varchar(64),
	`referrer` text,
	`userAgent` text,
	`ipAddress` varchar(45),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_events_id` PRIMARY KEY(`id`)
);
