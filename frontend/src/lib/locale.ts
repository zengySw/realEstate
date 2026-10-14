import { cookies } from "next/headers";
import { normalizeLocale, type Locale } from "@/lib/i18n";
import { LOCALE_COOKIE } from "@/lib/constants";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  return normalizeLocale(jar.get(LOCALE_COOKIE)?.value);
}

export const FALLBACK_IMAGES = [
  "https://images.pexels.com/photos/7061662/pexels-photo-7061662.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
];

export function listingImage(image: string | undefined, index = 0): string {
  if (image) return image;
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}
