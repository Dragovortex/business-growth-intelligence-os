'use server'

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function getRules(params: {
  page?: number,
  limit?: number,
  search?: string,
  category?: string,
  minConfidence?: number,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
}) {
  const { page = 1, limit = 50, search, category, minConfidence, sortBy = 'globalRank', sortOrder = 'asc' } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.RuleWhereInput = {};

  if (search) {
    where.OR = [
      { rule: { contains: search } },
      { category: { contains: search } },
      { tags: { contains: search } },
      { companies: { contains: search } },
    ];
  }

  if (category && category !== 'All') {
    where.category = category;
  }

  if (minConfidence) {
    where.confidenceScore = { gte: minConfidence };
  }

  const orderBy: Prisma.RuleOrderByWithRelationInput = {
    [sortBy]: sortOrder,
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
  const totalRules = await prisma.rule.count();
  
  const avgConfidence = await prisma.rule.aggregate({
    _avg: {
      confidenceScore: true,
    },
  });

  const topCategories = await getCategories();

  return {
    totalRules,
    verifiedRules: totalRules, // Mocked for now, assuming all seed data is verified
    avgConfidence: avgConfidence._avg.confidenceScore || 0,
    topCategories: topCategories.slice(0, 5),
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
