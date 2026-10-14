import {
  index,
  int,
  json,
  mysqlTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone").default("").notNull(),
  role: text("role").default("buyer").notNull(), // buyer | agent
  city: text("city").default("").notNull(),
  bio: text("bio").default("").notNull(),
  locale: text("locale").default("ua").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [uniqueIndex("users_email_unique").on(table.email)]);

export const sessions = mysqlTable("sessions", {
  token: text("token").primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const listings = mysqlTable("listings", {
  id: serial("id").primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  titleRu: text("title_ru").default("").notNull(),
  description: text("description").default("").notNull(),
  descriptionRu: text("description_ru").default("").notNull(),
  propertyType: text("property_type").default("apartment").notNull(), // apartment | house | cottage | land | commercial
  status: text("status").default("active").notNull(), // active | reserved | sold
  dealType: text("deal_type").default("sale").notNull(), // sale | rent
  price: int("price").notNull(), // UAH
  city: text("city").notNull(),
  district: text("district").default("").notNull(),
  address: text("address").default("").notNull(),
  area: int("area").default(0).notNull(),
  rooms: int("rooms").default(0).notNull(),
  bedrooms: int("bedrooms").default(0).notNull(),
  bathrooms: int("bathrooms").default(0).notNull(),
  floor: int("floor").default(0).notNull(),
  totalFloors: int("total_floors").default(0).notNull(),
  landArea: int("land_area").default(0).notNull(),
  yearBuilt: int("year_built").default(0).notNull(),
  features: json("features").$type<string[]>().notNull().default([]),
  images: json("images").$type<string[]>().notNull().default([]),
  contactName: text("contact_name").default("").notNull(),
  contactPhone: text("contact_phone").default("").notNull(),
  featured: int("featured").default(0).notNull(),
  views: int("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("listings_user_idx").on(table.userId),
  index("listings_city_idx").on(table.city),
]);

export const requests = mysqlTable("requests", {
  id: serial("id").primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  listingId: int("listing_id").references(() => listings.id, {
    onDelete: "set null",
  }),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  clientEmail: text("client_email").default("").notNull(),
  message: text("message").default("").notNull(),
  budget: int("budget").default(0).notNull(),
  preferredCity: text("preferred_city").default("").notNull(),
  status: text("status").default("new").notNull(), // new | contacted | viewing | offer | closed
  viewingAt: timestamp("viewing_at"),
  agentNote: text("agent_note").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [index("requests_user_idx").on(table.userId)]);

export const favorites = mysqlTable("favorites", {
  id: serial("id").primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  listingId: int("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [uniqueIndex("favorites_user_listing_unique").on(table.userId, table.listingId)]);

export type User = typeof users.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type RequestRow = typeof requests.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;