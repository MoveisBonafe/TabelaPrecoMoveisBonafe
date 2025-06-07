import { z } from "zod";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  serial,
  integer,
  numeric,
  boolean,
} from "drizzle-orm/pg-core";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  active: z.boolean(),
  productCount: z.number(),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  basePrice: z.number(),
  discount: z.number(),
  finalPrice: z.number(),
  priceAVista: z.number(), // Preço à vista (base para cálculos)
  price30: z.number(), // À vista + 2%
  price30_60: z.number(), // À vista + 4%
  price30_60_90: z.number(), // À vista + 6%
  price30_60_90_120: z.number(), // À vista + 8%
  image: z.string(), // Imagem principal (para compatibilidade)
  images: z.array(z.string()).default([]), // Array de múltiplas imagens
  specifications: z.array(z.string()).optional(),
  active: z.boolean(),
  fixedPrice: z.boolean().default(false), // Se true, preço não é alterado pelo multiplicador
  createdAt: z.date(),
});

export const insertProductSchema = productSchema.omit({ id: true, createdAt: true, finalPrice: true, price30: true, price30_60: true, price30_60_90: true, price30_60_90_120: true });
export const insertCategorySchema = categorySchema.omit({ id: true, productCount: true });

// Database tables
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description").default(""),
  icon: varchar("icon", { length: 100 }).default(""),
  color: varchar("color", { length: 50 }).default(""),
  active: boolean("active").default(true),
  productCount: integer("product_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").default(""),
  category: varchar("category", { length: 255 }).notNull(),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 5, scale: 2 }).default("0"),
  finalPrice: numeric("final_price", { precision: 10, scale: 2 }).notNull(),
  priceAVista: numeric("price_a_vista", { precision: 10, scale: 2 }).notNull(),
  price30: numeric("price_30", { precision: 10, scale: 2 }).notNull(),
  price30_60: numeric("price_30_60", { precision: 10, scale: 2 }).notNull(),
  price30_60_90: numeric("price_30_60_90", { precision: 10, scale: 2 }).notNull(),
  price30_60_90_120: numeric("price_30_60_90_120", { precision: 10, scale: 2 }).notNull(),
  image: text("image").default(""),
  images: jsonb("images").default([]),
  specifications: jsonb("specifications").default([]),
  active: boolean("active").default(true),
  fixedPrice: boolean("fixed_price").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  passwordHash: z.string(),
  name: z.string(),
  role: z.string(),
  active: z.boolean(),
  priceMultiplier: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const promotionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  discountPercentage: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.boolean(),
  applicableProducts: z.array(z.string()).default([]),
  createdAt: z.string(),
});

export const priceSettingSchema = z.object({
  id: z.string(),
  tableName: z.string(),
  percentage: z.number(),
  active: z.boolean(),
  createdAt: z.string(),
});

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertPromotionSchema = promotionSchema.omit({ id: true, createdAt: true });
export const insertPriceSettingSchema = priceSettingSchema.omit({ id: true, createdAt: true });

// Database tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").default(""),
  discountPercentage: numeric("discount_percentage", { precision: 5, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  active: boolean("active").default(true),
  applicableProducts: jsonb("applicable_products").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const priceSettings = pgTable("price_settings", {
  id: serial("id").primaryKey(),
  tableName: varchar("table_name", { length: 255 }).notNull(),
  percentage: numeric("percentage", { precision: 5, scale: 2 }).notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;
export type User = z.infer<typeof userSchema>;
export type Promotion = z.infer<typeof promotionSchema>;
export type PriceSetting = z.infer<typeof priceSettingSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type InsertPriceSetting = z.infer<typeof insertPriceSettingSchema>;
