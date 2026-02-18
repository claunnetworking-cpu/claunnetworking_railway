CREATE TABLE `click_metrics` (
	`id` varchar(36) NOT NULL,
	`resourceType` enum('job','course','link') NOT NULL,
	`resourceId` varchar(36) NOT NULL,
	`clickType` enum('redirect','whatsapp') NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `click_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`institution` varchar(255) NOT NULL,
	`description` text,
	`link` text NOT NULL,
	`duration` varchar(100),
	`modality` enum('Online','Presencial','Híbrido') NOT NULL,
	`isFree` boolean DEFAULT false,
	`status` enum('ativo','inativo') DEFAULT 'ativo',
	`clicks` int DEFAULT 0,
	`whatsappShares` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`company` varchar(255) NOT NULL,
	`description` text,
	`link` text NOT NULL,
	`city` varchar(100),
	`state` varchar(2),
	`modality` enum('Presencial','Remoto','Híbrido') NOT NULL,
	`isPCD` boolean DEFAULT false,
	`category` enum('atendimento','assistente','gestão','saúde','telemarketing','vendas','operacional','tecnologia','marketing','finanças','administrativo','comercial'),
	`status` enum('ativa','inativa') DEFAULT 'ativa',
	`clicks` int DEFAULT 0,
	`whatsappShares` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shortened_links` (
	`id` varchar(36) NOT NULL,
	`originalUrl` text NOT NULL,
	`shortCode` varchar(20) NOT NULL,
	`alias` varchar(255),
	`clicks` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shortened_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `shortened_links_shortCode_unique` UNIQUE(`shortCode`)
);
