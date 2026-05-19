CREATE TABLE `campaign_alert_overrides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`campaignId` varchar(64) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`roasDropThreshold` varchar(10),
	`budgetAlertEnabled` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaign_alert_overrides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_notification_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`types` json,
	`roasDropThreshold` varchar(10) DEFAULT '2.0',
	`budgetExhaustedPercent` int DEFAULT 90,
	`frequency` varchar(20) DEFAULT 'immediate',
	`quietHoursEnabled` boolean NOT NULL DEFAULT false,
	`quietHoursStart` int DEFAULT 22,
	`quietHoursEnd` int DEFAULT 8,
	`digestHour` int DEFAULT 9,
	`weeklyReportEnabled` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_notification_settings_id` PRIMARY KEY(`id`)
);
