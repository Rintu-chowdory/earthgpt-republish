CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` varchar(16) NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `earthquakes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(64) NOT NULL,
	`latitude` varchar(32) NOT NULL,
	`longitude` varchar(32) NOT NULL,
	`magnitude` varchar(16) NOT NULL,
	`depth` varchar(16),
	`place` text,
	`time` varchar(32) NOT NULL,
	`tsunami` int DEFAULT 0,
	`type` varchar(32),
	`fetchedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `earthquakes_id` PRIMARY KEY(`id`),
	CONSTRAINT `earthquakes_externalId_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
CREATE TABLE `wildfires` (
	`id` int AUTO_INCREMENT NOT NULL,
	`latitude` varchar(32) NOT NULL,
	`longitude` varchar(32) NOT NULL,
	`brightness` varchar(32),
	`confidence` varchar(32),
	`acqDate` varchar(16) NOT NULL,
	`acqTime` varchar(8) NOT NULL,
	`satellite` varchar(32),
	`frp` varchar(32),
	`daynight` varchar(8),
	`source` varchar(32) NOT NULL,
	`fetchedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wildfires_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chatMessages` ADD CONSTRAINT `chatMessages_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;