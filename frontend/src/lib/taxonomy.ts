import type { DictKey } from "@/lib/i18n";

export const PROPERTY_TYPES = ["apartment", "house", "cottage", "land", "commercial"] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const LISTING_STATUSES = ["active", "reserved", "sold"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const DEAL_TYPES = ["sale", "rent"] as const;
export type DealType = (typeof DEAL_TYPES)[number];

export const REQUEST_STATUSES = ["new", "contacted", "viewing", "offer", "closed"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const ROLES = ["buyer", "agent"] as const;

export function propertyTypeKey(value: string): DictKey {
  return `type.${value}` as DictKey;
}

export function listingStatusKey(value: string): DictKey {
  return `status.${value}` as DictKey;
}

export function dealTypeKey(value: string): DictKey {
  return `deal.${value}` as DictKey;
}

export function requestStatusKey(value: string): DictKey {
  return `reqStatus.${value}` as DictKey;
}

export function roleKey(value: string): DictKey {
  return `role.${value}` as DictKey;
}

export const FEATURES: { key: string; ua: string; ru: string; icon: string }[] = [
  { key: "balcony", ua: "Балкон / тераса", ru: "Балкон / терраса", icon: "🪟" },
  { key: "parking", ua: "Паркомісце", ru: "Парковочное место", icon: "🚗" },
  { key: "elevator", ua: "Ліфт", ru: "Лифт", icon: "🛗" },
  { key: "furniture", ua: "З меблями", ru: "С мебелью", icon: "🛋️" },
  { key: "newBuilding", ua: "Новобудова", ru: "Новостройка", icon: "🏗️" },
  { key: "garden", ua: "Сад / газон", ru: "Сад / газон", icon: "🌳" },
  { key: "fireplace", ua: "Камін", ru: "Камин", icon: "🔥" },
  { key: "pool", ua: "Басейн", ru: "Бассейн", icon: "🏊" },
  { key: "garage", ua: "Гараж", ru: "Гараж", icon: "🏘️" },
  { key: "security", ua: "Охорона", ru: "Охрана", icon: "🔐" },
  { key: "school", ua: "Школа поруч", ru: "Школа рядом", icon: "🏫" },
  { key: "metro", ua: "Метро поруч", ru: "Метро рядом", icon: "🚇" },
  { key: "seaView", ua: "Вид на море", ru: "Вид на море", icon: "🌊" },
  { key: "renovated", ua: "Свіжий ремонт", ru: "Свежий ремонт", icon: "🎨" },
  { key: "gas", ua: "Газ", ru: "Газ", icon: "🔥" },
  { key: "well", ua: "Свердловина", ru: "Скважина", icon: "💧" },
];

export const FEATURE_KEYS = FEATURES.map((f) => f.key);

export function featureLabel(key: string, locale: "ua" | "ru"): string {
  const found = FEATURES.find((f) => f.key === key);
  if (!found) return key;
  return locale === "ua" ? found.ua : found.ru;
}

export function featureIcon(key: string): string {
  return FEATURES.find((f) => f.key === key)?.icon ?? "•";
}

export const CITIES = [
  "Київ",
  "Львів",
  "Одеса",
  "Дніпро",
  "Харків",
  "Вінниця",
  "Ужгород",
  "Івано-Франківськ",
  "Буковель",
  "Конча-Заспа",
  "Ірпінь",
];

export const SORT_OPTIONS = ["newest", "priceAsc", "priceDesc", "areaDesc"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];
