CREATE TABLE `whatsapp_analytics` (
	`id` varchar(36) NOT NULL,
	`shareToken` varchar(64) NOT NULL,
	`resourceType` enum('job','course') NOT NULL,
	`resourceId` varchar(36) NOT NULL,
	`totalShares` int DEFAULT 0,
	`totalClicks` int DEFAULT 0,
	`totalConversions` int DEFAULT 0,
	`conversionRate` varchar(10) DEFAULT '0',
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsapp_analytics_id` PRIMARY KEY(`id`),
	CONSTRAINT `whatsapp_analytics_shareToken_unique` UNIQUE(`shareToken`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_clicks` (
	`id` varchar(36) NOT NULL,
	`shareToken` varchar(64) NOT NULL,
	`sessionId` varchar(64),
	`userAgent` text,
	`ipAddress` varchar(45),
	`clickedAt` timestamp NOT NULL DEFAULT (now()),
	`converted` boolean DEFAULT false,
	CONSTRAINT `whatsapp_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_shares` (
	`id` varchar(36) NOT NULL,
	`shareToken` varchar(64) NOT NULL,
	`resourceType` enum('job','course') NOT NULL,
	`resourceId` varchar(36) NOT NULL,
	`userPhone` varchar(20),
	`sharedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`isActive` boolean DEFAULT true,
	CONSTRAINT `whatsapp_shares_id` PRIMARY KEY(`id`),
	CONSTRAINT `whatsapp_shares_shareToken_unique` UNIQUE(`shareToken`)
);
