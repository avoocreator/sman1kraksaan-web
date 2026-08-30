/**
 * API abstraction layer.
 *
 * These functions currently return mock data from `src/data/*`.
 * When the Hono + PostgreSQL + Drizzle backend is ready, replace the
 * function bodies below with `fetch()` calls to the REST API — the
 * function signatures and return shapes are designed to stay the same,
 * so components consuming these functions will not need to change.
 *
 * Example future implementation:
 *
 *   export async function getAchievements() {
 *     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/achievements`);
 *     return res.json() as Promise<Achievement[]>;
 *   }
 */

import { getAllAchievements, getAchievementBySlug } from "@/data/achievements";
import { getAllAlumni, getAlumnusBySlug } from "@/data/alumni";
import { getAllPartners, getPartnerBySlug } from "@/data/partners";
import { getAllCareerOpportunities, getCareerOpportunityBySlug } from "@/data/career";
import { getAllNews, getNewsBySlug } from "@/data/news";
import { getAllEvents, getEventBySlug } from "@/data/events";
import { getAllPrograms, getProgramBySlug } from "@/data/programs";
import { statistics } from "@/data/statistics";

export async function getAchievements() {
  return getAllAchievements();
}
export async function getAchievement(slug: string) {
  return getAchievementBySlug(slug);
}

export async function getAlumni() {
  return getAllAlumni();
}
export async function getAlumnus(slug: string) {
  return getAlumnusBySlug(slug);
}

export async function getPartners() {
  return getAllPartners();
}
export async function getPartner(slug: string) {
  return getPartnerBySlug(slug);
}

export async function getCareerOpportunities() {
  return getAllCareerOpportunities();
}
export async function getCareerOpportunity(slug: string) {
  return getCareerOpportunityBySlug(slug);
}

export async function getNews() {
  return getAllNews();
}
export async function getNewsArticle(slug: string) {
  return getNewsBySlug(slug);
}

export async function getEvents() {
  return getAllEvents();
}
export async function getEvent(slug: string) {
  return getEventBySlug(slug);
}

export async function getPrograms() {
  return getAllPrograms();
}
export async function getProgram(slug: string) {
  return getProgramBySlug(slug);
}

export async function getStatistics() {
  return statistics;
}
