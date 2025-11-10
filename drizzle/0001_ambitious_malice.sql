CREATE TABLE IF NOT EXISTS "society" (
	"id" serial PRIMARY KEY NOT NULL,
	"country" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL,
	"society" varchar(150) NOT NULL,
	"building_name" varchar(150) NOT NULL,
	"block" varchar(50) NOT NULL
);
