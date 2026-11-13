import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FeatureHero } from '@/components/sections/features/FeatureHero/FeatureHero';
import { FeatureZPattern } from '@/components/sections/features/FeatureZPattern/FeatureZPattern';
import { FeatureCaseStudyBanner } from '@/components/sections/features/FeatureCaseStudyBanner/FeatureCaseStudyBanner';

const featureData: Record<string, any> = {
  'dynamic-menus': {
    hero: {
      title: 'Digital menus that adapt to your service.',
      description: 'Stop reprinting paper menus. Instantly update availability, pricing, and descriptions across all tables with a single click.',
      bullets: [
        'Instant updates without re-printing',
        'Hide out-of-stock items automatically',
        'Add dietary badges and allergen warnings'
      ]
    },
    zPattern: {
      headline: 'A menu that works as hard as your front of house.',
      blocks: [
        {
          title: 'Update everywhere, instantly.',
          description: 'Did the kitchen just run out of salmon? Mark it out of stock in the control tower, and it instantly disappears from every active menu in the restaurant.'
        },
        {
          title: 'Merchandise your best dishes.',
          description: 'Highlight chef specials and high-margin items. Use beautiful photography to make dishes irresistible.'
        }
      ]
    }
  },
  'table-ordering': {
    hero: {
      title: 'Table ordering that feels like hospitality.',
      description: 'Give diners the freedom to order and pay when they want, without losing the personal touch of your brand.',
      bullets: [
        'Login-less recognition for regulars',
        'Custom-branded interface',
        'Split bills and tipping built-in'
      ]
    },
    zPattern: {
      headline: 'The easiest way to capture every order.',
      blocks: [
        {
          title: 'No app downloads, no accounts.',
          description: 'Guests simply scan and order. Our intelligent system remembers regulars without forcing them to create an account.'
        },
        {
          title: 'Never miss a drink refill.',
          description: 'When guests can order at their own pace, average order value increases. Let them add that second round of drinks with zero friction.'
        }
      ]
    }
  },
  'waiter-app': {
    hero: {
      title: 'Supercharge your floor staff.',
      description: 'Equip your waiters with a blazingly fast mobile POS that keeps them on the floor and out of line at the terminal.',
      bullets: [
        'Take orders directly at the table',
        'Fire courses to the kitchen instantly',
        'Real-time table status'
      ]
    },
    zPattern: {
      headline: 'Fewer steps, faster service.',
      blocks: [
        {
          title: 'Fire orders without walking.',
          description: 'Waiters can send orders to the kitchen instantly from the table, reducing ticket times and keeping them focused on guests.'
        },
        {
          title: 'Total table visibility.',
          description: 'See which tables need attention, who is waiting for food, and who is ready to pay—all from a single screen.'
        }
      ]
    }
  },
  'analytics': {
    hero: {
      title: 'Get instant insights into your inventory health & expenses',
      description: 'Understand exactly what is selling, what is spoiling, and where your margins are hiding with real-time analytics.',
      bullets: [
        'Real-time sales tracking',
        'Automated inventory depletion',
        'Margin analysis by dish'
      ]
    },
    zPattern: {
      headline: 'Uncover new insights about your inventory.',
      blocks: [
        {
          title: 'You don\'t need to be a data scientist.',
          description: 'Our dashboards are designed for operators. See your most critical metrics at a glance without writing SQL or building complex reports.'
        },
        {
          title: 'Easily take actions or dive into the data.',
          description: 'Spot a trend? Drill down into specific days, shifts, or menu categories to understand exactly what is driving your numbers.'
        },
        {
          title: 'Segment insights by grading for more detail analysis.',
          description: 'Compare performance across different locations, staff members, or times of day to optimize your entire operation.'
        }
      ]
    }
  }
};

interface FeaturePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(featureData).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: FeaturePageProps): Metadata {
  const data = featureData[params.slug];
  if (!data) {
    return { title: 'Not Found' };
  }
  return {
    title: `${data.hero.title} - Plated Features`,
    description: data.hero.description,
  };
}

export default function FeaturePage({ params }: FeaturePageProps) {
  const data = featureData[params.slug];

  if (!data) {
    notFound();
  }

  return (
    <main className="flex flex-col font-sans w-full">
      <FeatureHero 
        title={data.hero.title}
        description={data.hero.description}
        bullets={data.hero.bullets}
      />
      <FeatureZPattern 
        headline={data.zPattern.headline}
        blocks={data.zPattern.blocks}
      />
      <FeatureCaseStudyBanner />
    </main>
  );
}
