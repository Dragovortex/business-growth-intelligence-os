'use server'

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

// Whitelist of fields the UI is allowed to sort by. Prevents an arbitrary
// `sortBy` value from reaching Prisma (which would throw an unhandled error).
const SORTABLE_FIELDS = new Set([
  'globalRank',
  'categoryRank',
  'confidenceScore',
  'evidenceCount',
  'expectedImpact',
  'category',
  'dateAdded',
  'displayId',
])

const MAX_LIMIT = 200

export async function getRules(params: {
  page?: number,
  limit?: number,
  search?: string,
  category?: string,
  minConfidence?: number,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
}) {
  const {
    page: rawPage = 1,
    limit: rawLimit = 50,
    search,
    category,
    minConfidence,
    sortBy = 'globalRank',
    sortOrder = 'asc',
  } = params;

  // Defensive clamping so bad client input can't crash the query.
  const page = Math.max(1, Math.floor(rawPage) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(rawLimit) || 50));
  const skip = (page - 1) * limit;

  const where: Prisma.RuleWhereInput = {};

  const q = search?.trim();
  if (q) {
    // Postgres `contains` is case-sensitive by default (unlike SQLite), so we
    // must opt into insensitive matching or lowercase searches return nothing.
    where.OR = [
      { rule: { contains: q, mode: 'insensitive' } },
      { category: { contains: q, mode: 'insensitive' } },
      { subcategory: { contains: q, mode: 'insensitive' } },
      { expectedImpact: { contains: q, mode: 'insensitive' } },
      { tags: { contains: q, mode: 'insensitive' } },
      { companies: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (category && category !== 'All') {
    where.category = category;
  }

  if (minConfidence) {
    where.confidenceScore = { gte: minConfidence };
  }

  const safeSortBy = SORTABLE_FIELDS.has(sortBy) ? sortBy : 'globalRank';
  const safeSortOrder: 'asc' | 'desc' = sortOrder === 'desc' ? 'desc' : 'asc';

  const orderBy: Prisma.RuleOrderByWithRelationInput = {
    [safeSortBy]: safeSortOrder,
  };

  const [rules, total] = await Promise.all([
    prisma.rule.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
    prisma.rule.count({ where }),
  ]);

  return {
    rules,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getCategories() {
  const categories = await prisma.rule.groupBy({
    by: ['category'],
    _count: {
      category: true,
    },
    orderBy: {
      _count: {
        category: 'desc',
      },
    },
  });

  return categories.map(c => ({
    name: c.category,
    count: c._count.category,
  }));
}

export async function getDashboardStats() {
  const [totalRules, verifiedRules, avgConfidence, categories, topRules] = await Promise.all([
    prisma.rule.count(),
    prisma.rule.count({ where: { status: 'Verified' } }),
    prisma.rule.aggregate({ _avg: { confidenceScore: true } }),
    getCategories(),
    prisma.rule.findMany({ orderBy: { globalRank: 'asc' }, take: 6 }),
  ]);

  return {
    totalRules,
    verifiedRules,
    avgConfidence: avgConfidence._avg.confidenceScore || 0,
    totalCategories: categories.length,
    topCategories: categories.slice(0, 5),
    topRules,
  };
}

export async function getRulesByIds(displayIds: string[]) {
  if (!displayIds || displayIds.length === 0) return [];

  return await prisma.rule.findMany({
    where: {
      displayId: { in: displayIds },
    },
    orderBy: { globalRank: 'asc' },
  });
}

export async function getAllRules() {
  return prisma.rule.findMany({ orderBy: { globalRank: 'asc' } });
}

export async function getRankings(category?: string) {
  const where: Prisma.RuleWhereInput =
    category && category !== 'All' ? { category } : {};

  const [topRules, categories, totalRanked] = await Promise.all([
    prisma.rule.findMany({
      where,
      orderBy: { globalRank: 'asc' },
      take: 100,
    }),
    getCategories(),
    prisma.rule.count({ where }),
  ]);

  return { topRules, categories, totalRanked };
}

export async function getEvidenceStats() {
  const [bySourceRaw, totals, topEvidenced, totalRules] = await Promise.all([
    prisma.rule.groupBy({
      by: ['sourceType'],
      _count: { sourceType: true },
      _avg: { evidenceCount: true, confidenceScore: true },
    }),
    prisma.rule.aggregate({ _sum: { evidenceCount: true } }),
    prisma.rule.findMany({ orderBy: { evidenceCount: 'desc' }, take: 8 }),
    prisma.rule.count(),
  ]);

  const bySource = bySourceRaw
    .map(s => ({
      sourceType: s.sourceType,
      count: s._count.sourceType,
      avgEvidence: Math.round(s._avg.evidenceCount || 0),
      avgConfidence: Math.round(s._avg.confidenceScore || 0),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalEvidence: totals._sum.evidenceCount || 0,
    totalRules,
    sourceTypeCount: bySource.length,
    bySource,
    topEvidenced,
  };
}
