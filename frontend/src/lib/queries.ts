import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { favorites, listings, requests, users, type Listing } from "@/db/schema";
import type { SortOption } from "@/lib/taxonomy";

function parseJsonArray(value: unknown): string[] {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as string[];
    } catch {
      return [];
    }
  }
  return (value as string[]) ?? [];
}

function normalizeListing(row: Listing): Listing {
  return {
    ...row,
    images: parseJsonArray(row.images),
    features: parseJsonArray(row.features),
  };
}

export type ListingFilters = {
  q?: string;
  city?: string;
  type?: string;
  deal?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  minArea?: number;
  sort?: SortOption;
  userId?: number;
  featuredOnly?: boolean;
  limit?: number;
  excludeId?: number;
};

function buildConditions(filters: ListingFilters) {
  const conds = [];
  if (filters.q) {
    const like = `%${filters.q}%`;
    conds.push(
      or(
        ilike(listings.title, like),
        ilike(listings.titleRu, like),
        ilike(listings.city, like),
        ilike(listings.district, like),
        ilike(listings.address, like),
        ilike(listings.description, like),
      ),
    );
  }
  if (filters.city) conds.push(eq(listings.city, filters.city));
  if (filters.type) conds.push(eq(listings.propertyType, filters.type));
  if (filters.deal) conds.push(eq(listings.dealType, filters.deal));
  if (filters.status) conds.push(eq(listings.status, filters.status));
  if (filters.userId) conds.push(eq(listings.userId, filters.userId));
  if (filters.featuredOnly) conds.push(eq(listings.featured, 1));
  if (typeof filters.minPrice === "number" && !Number.isNaN(filters.minPrice))
    conds.push(gte(listings.price, filters.minPrice));
  if (typeof filters.maxPrice === "number" && !Number.isNaN(filters.maxPrice))
    conds.push(lte(listings.price, filters.maxPrice));
  if (typeof filters.rooms === "number" && !Number.isNaN(filters.rooms) && filters.rooms > 0)
    conds.push(gte(listings.rooms, filters.rooms));
  if (typeof filters.minArea === "number" && !Number.isNaN(filters.minArea) && filters.minArea > 0)
    conds.push(gte(listings.area, filters.minArea));
  if (filters.excludeId) conds.push(sql`${listings.id} <> ${filters.excludeId}`);
  return conds;
}

function orderBy(sort: SortOption | undefined) {
  switch (sort) {
    case "priceAsc":
      return [asc(listings.price)];
    case "priceDesc":
      return [desc(listings.price)];
    case "areaDesc":
      return [desc(listings.area)];
    default:
      return [desc(listings.createdAt)];
  }
}

export async function fetchListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const conds = buildConditions(filters);
  const query = db
    .select()
    .from(listings)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(...orderBy(filters.sort))
    .limit(filters.limit ?? 60);
  const rows = await query;
  return rows.map(normalizeListing);
}

export async function countListings(filters: ListingFilters = {}): Promise<number> {
  const conds = buildConditions(filters);
  const rows = await db
    .select({ value: sql<number>`CAST(count(*) AS UNSIGNED)` })
    .from(listings)
    .where(conds.length ? and(...conds) : undefined);
  return rows[0]?.value ?? 0;
}

export async function fetchListingById(id: number): Promise<Listing | null> {
  const rows = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
  return rows[0] ? normalizeListing(rows[0]) : null;
}

export async function fetchAgent(listingUserId: number) {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      phone: users.phone,
      email: users.email,
      city: users.city,
      bio: users.bio,
    })
    .from(users)
    .where(eq(users.id, listingUserId))
    .limit(1);
  return rows[0] ?? null;
}

export async function fetchFavoriteIds(userId: number | undefined): Promise<number[]> {
  if (!userId) return [];
  const rows = await db
    .select({ listingId: favorites.listingId })
    .from(favorites)
    .where(eq(favorites.userId, userId));
  return rows.map((r) => r.listingId);
}

export async function fetchFavoriteListings(userId: number): Promise<Listing[]> {
  const ids = await fetchFavoriteIds(userId);
  if (ids.length === 0) return [];
  const rows = await db
    .select()
    .from(listings)
    .where(inArray(listings.id, ids))
    .orderBy(desc(listings.createdAt));
  return rows.map(normalizeListing);
}

export type RequestWithListing = {
  id: number;
  listingId: number | null;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  message: string;
  budget: number;
  preferredCity: string;
  status: string;
  viewingAt: Date | null;
  agentNote: string;
  createdAt: Date;
  updatedAt: Date;
  listingTitle: string | null;
  listingTitleRu: string | null;
  listingPrice: number | null;
  listingImages: string[] | null;
};

export async function fetchRequests(userId: number): Promise<RequestWithListing[]> {
  return db
    .select({
      id: requests.id,
      listingId: requests.listingId,
      clientName: requests.clientName,
      clientPhone: requests.clientPhone,
      clientEmail: requests.clientEmail,
      message: requests.message,
      budget: requests.budget,
      preferredCity: requests.preferredCity,
      status: requests.status,
      viewingAt: requests.viewingAt,
      agentNote: requests.agentNote,
      createdAt: requests.createdAt,
      updatedAt: requests.updatedAt,
      listingTitle: listings.title,
      listingTitleRu: listings.titleRu,
      listingPrice: listings.price,
      listingImages: listings.images,
    })
    .from(requests)
    .leftJoin(listings, eq(listings.id, requests.listingId))
    .where(eq(requests.userId, userId))
    .orderBy(desc(requests.createdAt));
}

export type DashboardStats = {
  total: number;
  active: number;
  sold: number;
  reserved: number;
  views: number;
  favorites: number;
  newRequests: number;
  totalRequests: number;
  avgPrice: number;
  pipeline: Record<string, number>;
};

export async function fetchDashboardStats(userId: number): Promise<DashboardStats> {
  const [listingAgg, favCount, requestRows] = await Promise.all([
    db
      .select({
        total: sql<number>`CAST(COUNT(*) AS UNSIGNED)`,
        active: sql<number>`CAST(SUM(CASE WHEN ${listings.status} = 'active' THEN 1 ELSE 0 END) AS UNSIGNED)`,
        sold: sql<number>`CAST(SUM(CASE WHEN ${listings.status} = 'sold' THEN 1 ELSE 0 END) AS UNSIGNED)`,
        reserved: sql<number>`CAST(SUM(CASE WHEN ${listings.status} = 'reserved' THEN 1 ELSE 0 END) AS UNSIGNED)`,
        views: sql<number>`CAST(COALESCE(SUM(${listings.views}), 0) AS UNSIGNED)`,
        avgPrice: sql<number>`CAST(COALESCE(AVG(${listings.price}), 0) AS UNSIGNED)`,
      })
      .from(listings)
      .where(eq(listings.userId, userId)),
    db
      .select({ value: sql<number>`CAST(COUNT(*) AS UNSIGNED)` })
      .from(favorites)
      .where(eq(favorites.userId, userId)),
    db
      .select({ status: requests.status, value: sql<number>`CAST(COUNT(*) AS UNSIGNED)` })
      .from(requests)
      .where(eq(requests.userId, userId))
      .groupBy(requests.status),
  ]);

  const pipeline: Record<string, number> = {
    new: 0,
    contacted: 0,
    viewing: 0,
    offer: 0,
    closed: 0,
  };
  let totalRequests = 0;
  for (const row of requestRows) {
    pipeline[row.status] = row.value;
    totalRequests += row.value;
  }

  const agg = listingAgg[0];
  return {
    total: agg?.total ?? 0,
    active: agg?.active ?? 0,
    sold: agg?.sold ?? 0,
    reserved: agg?.reserved ?? 0,
    views: agg?.views ?? 0,
    favorites: favCount[0]?.value ?? 0,
    newRequests: pipeline.new ?? 0,
    totalRequests,
    avgPrice: agg?.avgPrice ?? 0,
    pipeline,
  };
}
