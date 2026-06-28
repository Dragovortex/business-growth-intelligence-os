import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  // Clean existing data
  await prisma.rule.deleteMany()

  const categories = [
    'Branding', 'Marketing', 'Sales', 'Pricing', 'Psychology',
    'Consumer Behavior', 'Negotiation', 'Product', 'UX', 'CRO',
    'Copywriting', 'Advertising', 'Social Media', 'Email Marketing', 'SEO',
  ]

  const expectedImpacts = [
    '+20-80% conversions', '+15-35% retention', 'Higher pricing power',
    'Lower CAC', 'Higher LTV', 'More referrals', 'Higher average order value',
    'Lower churn', 'Faster sales cycle', 'Higher trust', 'Improved customer satisfaction'
  ]

  const sourceTypes = [
    'Meta-analysis', 'Randomized studies', 'Field experiments',
    'Large A/B tests', 'Case studies', 'Expert consensus'
  ]

  const statuses = ['Verified', 'Draft', 'Pending']

  const actionVerbs = ['Implement', 'Add', 'Offer', 'Use', 'Create', 'Reduce', 'Display', 'Send', 'Optimize', 'Test', 'Leverage', 'Remove'];
  const tactics = [
    'a 14-day free trial', 'exit-intent popups', 'tiered pricing', 'personalized welcome emails',
    'one-click upsells', 'social proof and testimonials', 'checkout fields', 'annual billing options',
    'an affiliate program', 'scarcity (e.g., "Only 3 left")', 'urgency timers', 'money-back guarantees',
    'live chat support', 'gamified onboarding', 'referral loops', 'dynamic pricing', 'freemium plans'
  ];
  const contexts = [
    'on product pages', 'during checkout', 'in the onboarding flow', 'in cold emails',
    'on the pricing page', 'for high-ticket items', 'for SaaS products', 'in B2B sales',
    'post-purchase', 'for abandoned carts', 'in ad copy', 'for enterprise clients'
  ];

  const possibleCompanies = ['Apple', 'Amazon', 'Netflix', 'Stripe', 'HubSpot', 'Shopify', 'Airbnb', 'Notion', 'Linear', 'Spotify', 'Uber', 'Figma'];

  const rulesData = []

  for (let i = 1; i <= 5000; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    
    const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    const tactic = tactics[Math.floor(Math.random() * tactics.length)];
    const context = contexts[Math.floor(Math.random() * contexts.length)];
    
    const ruleText = `${verb} ${tactic} ${context}.`;
    
    // Pick 1-3 random companies
    const numCompanies = Math.floor(Math.random() * 3) + 1;
    const shuffledCompanies = [...possibleCompanies].sort(() => 0.5 - Math.random());
    const selectedCompanies = shuffledCompanies.slice(0, numCompanies);
    
    // Generate a note
    const notes = `Implementing this rule has been shown to dramatically alter user psychology in the ${category.toLowerCase()} space. By focusing on ${tactic}, companies naturally reduce friction and increase overall throughput, making it a staple strategy for top-tier tech organizations.`;

    rulesData.push({
      displayId: `RULE-${i.toString().padStart(6, '0')}`,
      category: category,
      subcategory: 'General',
      globalRank: i,
      categoryRank: Math.floor(Math.random() * 100) + 1,
      rule: ruleText,
      expectedImpact: expectedImpacts[Math.floor(Math.random() * expectedImpacts.length)],
      confidenceScore: Math.floor(Math.random() * 21) + 80, // 80-100
      evidenceCount: Math.floor(Math.random() * 500) + 1,
      tags: JSON.stringify([category.toLowerCase(), 'growth', 'business']),
      sourceType: sourceTypes[Math.floor(Math.random() * sourceTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      notes: notes,
      companies: JSON.stringify(selectedCompanies),
    })
  }

  // Insert in chunks of 1000 for SQLite limits
  for (let i = 0; i < rulesData.length; i += 1000) {
    const chunk = rulesData.slice(i, i + 1000)
    await prisma.rule.createMany({
      data: chunk,
    })
  }

  console.log('Seeding complete! Added 5,000 rules.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
