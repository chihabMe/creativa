ALTER TABLE "products" ADD COLUMN "sub_options" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "size_additions";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "frame_additions";