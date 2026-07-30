import { Injectable, computed, inject, signal } from '@angular/core';
import { Bouquet, BouquetService } from './bouquet.service';

// ngDevMode is a global Angular flag — true in dev builds, false in prod
declare const ngDevMode: boolean | undefined;

export interface QuizOption {
  id: string;
  label: string;
  icon: string;
  tags: string[];
  color?: string;
  maxPrice?: number;
  /** If set, option is only visible when Q1 recipient matches one of these IDs */
  showFor?: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  hint: string;
  gridCols: 2 | 3;
  options: QuizOption[];
}

export interface QuizResult {
  bouquet: Bouquet;
  score: number;
  matchStrength: 'strong' | 'medium' | 'weak';
  reason: string;
}

// ─── Bouquet tag derivation ───────────────────────────────────────────────────
// Bouquets in Firestore may have an empty tags[] field; we derive quiz-vocabulary
// tags from their structured fields (occasion, color, type) so scoring works even
// when the free-form tags array is unpopulated.

const OCCASION_TO_TAGS: Record<string, string[]> = {
  birthday:    ['birthday', 'bright', 'fun'],
  anniversary: ['anniversary', 'romantic', 'elegant'],
  justbecause: ['justbecause', 'gentle', 'fun'],
  sorry:       ['sorry', 'gentle'],
  thankyou:    ['thankyou', 'calm', 'gentle'],
  date:        ['date', 'romantic'],
  wedding:     ['anniversary', 'romantic', 'elegant'],
  graduation:  ['birthday', 'bright', 'thankyou'],
  baby:        ['gentle', 'fun'],
  support:     ['gentle', 'calm'],
};

const COLOR_TO_TAGS: Record<string, string[]> = {
  pink:     ['gentle', 'romantic'],
  red:      ['romantic', 'bright'],
  yellow:   ['bright', 'fun', 'birthday'],
  white:    ['calm', 'elegant', 'gentle'],
  purple:   ['calm', 'elegant'],
  green:    ['calm'],
  orange:   ['bright', 'fun'],
  teal:     ['calm', 'gentle'],
  blue:     ['calm'],
  burgundy: ['romantic', 'elegant'],
  lilac:    ['gentle', 'calm'],
  coral:    ['bright', 'fun'],
  mixed:    ['bright', 'fun'],
};

const TYPE_TO_TAGS: Record<string, string[]> = {
  roses:          ['romantic', 'elegant', 'anniversary'],
  tulips:         ['gentle', 'fun', 'birthday'],
  sunflowers:     ['bright', 'fun'],
  peonies:        ['gentle', 'romantic'],
  lavender:       ['calm', 'gentle'],
  chrysanthemums: ['calm'],
  orchids:        ['elegant', 'calm'],
  wildflowers:    ['fun', 'gentle'],
  gerberas:       ['bright', 'fun', 'birthday'],
  lilies:         ['gentle', 'elegant'],
  irises:         ['calm', 'elegant'],
  hydrangeas:     ['gentle', 'romantic'],
  carnations:     ['gentle', 'thankyou'],
  ranunculus:     ['romantic', 'gentle'],
  eustoma:        ['elegant', 'gentle'],
  eucalyptus:     ['calm'],
  mixed:          ['fun', 'bright'],
};

function getBouquetEffectiveTags(b: Bouquet): string[] {
  const tags = new Set<string>(b.tags ?? []);
  (OCCASION_TO_TAGS[b.occasion] ?? []).forEach((t) => tags.add(t));
  (COLOR_TO_TAGS[b.color]     ?? []).forEach((t) => tags.add(t));
  (TYPE_TO_TAGS[b.type]       ?? []).forEach((t) => tags.add(t));
  return [...tags];
}

// ─── Scoring weights ──────────────────────────────────────────────────────────

const QUESTION_WEIGHTS: Record<number, number> = {
  1: 1.5, // For whom
  2: 2.0, // Occasion — most important
  3: 1.0, // Personality
  4: 1.0, // Mood
  5: 0.8, // Color
  6: 0,   // Budget — handled via soft penalty
  7: 0.3, // Timing
};

// Short reason snippets used to build per-bouquet reason text
const SHORT_TAG_REASONS: Record<string, string> = {
  romantic:    'романтичний',
  anniversary: 'до річниці',
  birthday:    'святковий',
  gentle:      'ніжний',
  bright:      'яскравий',
  calm:        'елегантний',
  fun:         'піднімає настрій',
  sorry:       'примирливий',
  thankyou:    'вдячний',
  elegant:     'вишуканий',
  date:        'для побачення',
  justbecause: 'без особливого приводу',
};

// ─── Questions ───────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Для кого букет?',
    hint: 'Обери того, кому даруєш',
    gridCols: 3,
    options: [
      { id: 'lover',     label: 'Коханій людині',    icon: 'favorite',         tags: ['romantic', 'anniversary'], color: '#ff4d8d' },
      { id: 'mom',       label: 'Мамі',               icon: 'self_improvement', tags: ['gentle', 'birthday'],      color: '#f472b6' },
      { id: 'friend',    label: 'Подрузі або другу',  icon: 'group',            tags: ['bright', 'fun'],           color: '#07b3a3' },
      { id: 'self',      label: 'Собі',               icon: 'spa',              tags: ['gentle', 'calm'],           color: '#9c81d3' },
      { id: 'colleague', label: 'Колезі',             icon: 'work',             tags: ['neutral', 'calm'],          color: '#6b7280' },
      { id: 'child',     label: 'Дитині',             icon: 'child_care',       tags: ['bright', 'fun'],            color: '#fbbf24' },
      { id: 'other',     label: 'Інше',               icon: 'more_horiz',       tags: [],                          color: '#94a3b8' },
    ],
  },
  {
    id: 2,
    question: 'Який привід?',
    hint: 'Що святкуємо або відзначаємо',
    gridCols: 3,
    options: [
      { id: 'birthday',    label: 'День народження', icon: 'cake',               tags: ['birthday', 'bright'],      color: '#fbbf24' },
      { id: 'anniversary', label: 'Річниця',          icon: 'favorite_border',    tags: ['anniversary', 'romantic'], color: '#ff4d8d' },
      { id: 'justbecause', label: 'Просто так',       icon: 'wb_sunny',           tags: ['justbecause', 'gentle'],   color: '#07b3a3' },
      { id: 'sorry',       label: 'Вибачення',        icon: 'healing',            tags: ['sorry', 'gentle'],         color: '#a78bfa', showFor: ['lover'] },
      { id: 'thankyou',    label: 'Подяка',            icon: 'volunteer_activism', tags: ['thankyou', 'calm'],        color: '#ec4899' },
      { id: 'date',        label: 'Перше побачення',  icon: 'local_florist',      tags: ['date', 'romantic'],        color: '#fb7185', showFor: ['lover'] },
      { id: 'other',       label: 'Інше',             icon: 'more_horiz',         tags: [],                          color: '#94a3b8' },
    ],
  },
  {
    id: 3,
    question: 'Який у неї або нього характер?',
    hint: 'Обери що найближче',
    gridCols: 2,
    options: [
      { id: 'gentle',  label: 'Ніжна і романтична', icon: 'filter_vintage', tags: ['gentle', 'romantic'], color: '#ff9cbf' },
      { id: 'bright',  label: 'Яскрава і весела',    icon: 'wb_sunny',      tags: ['bright', 'fun'],      color: '#ffd740' },
      { id: 'elegant', label: 'Спокійна і вишукана', icon: 'eco',           tags: ['calm', 'elegant'],    color: '#07b3a3' },
      { id: 'wild',    label: 'Непередбачувана',      icon: 'auto_awesome',  tags: ['bright', 'fun'],      color: '#ab47bc' },
    ],
  },
  {
    id: 4,
    question: 'Який настрій хочеш передати?',
    hint: 'Що має відчути людина коли отримає букет',
    gridCols: 2,
    options: [
      // Lover
      { id: 'love',       label: 'Я тебе люблю',           icon: 'favorite',                 tags: ['romantic', 'anniversary'],  color: '#ff4d8d', showFor: ['lover'] },
      { id: 'sunshine',   label: 'Ти моє сонце',            icon: 'light_mode',               tags: ['bright', 'fun'],            color: '#ffd740', showFor: ['lover'] },
      { id: 'sorry',      label: 'Вибач мене',              icon: 'sentiment_very_satisfied', tags: ['sorry', 'gentle'],          color: '#ce93d8', showFor: ['lover'] },
      // Mom
      { id: 'momLove',    label: 'Ти найкраща мама',        icon: 'self_improvement',         tags: ['gentle', 'birthday'],       color: '#f472b6', showFor: ['mom'] },
      // Friend
      { id: 'friendLove', label: 'Ти найкращий друг',       icon: 'group',                    tags: ['fun', 'bright'],            color: '#07b3a3', showFor: ['friend'] },
      // Self
      { id: 'selfCare',   label: 'Я це заслужила',           icon: 'spa',                      tags: ['gentle', 'calm'],           color: '#9c81d3', showFor: ['self'] },
      { id: 'selfCheer',  label: 'Підняти собі настрій',     icon: 'mood',                     tags: ['bright', 'fun'],            color: '#ffd740', showFor: ['self'] },
      // Colleague
      { id: 'colRespect', label: 'З поваги та вдячності',   icon: 'work',                     tags: ['thankyou', 'calm'],         color: '#6b7280', showFor: ['colleague'] },
      { id: 'colEvent',   label: 'З нагоди свята',           icon: 'event',                    tags: ['birthday', 'calm'],         color: '#07b3a3', showFor: ['colleague'] },
      // Child
      { id: 'childLove',  label: 'Ти мій скарб',            icon: 'child_care',               tags: ['fun', 'gentle'],            color: '#fbbf24', showFor: ['child'] },
      // Shared across several
      { id: 'proud',      label: 'Пишаюсь тобою',           icon: 'emoji_events',             tags: ['gentle', 'thankyou'],       color: '#fbbf24', showFor: ['mom', 'friend', 'colleague', 'child'] },
      { id: 'cheer',      label: 'Хочу тебе порадувати',    icon: 'wb_sunny',                 tags: ['bright', 'fun'],            color: '#ffd740', showFor: ['mom', 'friend', 'child', 'self'] },
      // Visible for all
      { id: 'gratitude',  label: 'Дякую що ти є',           icon: 'volunteer_activism',       tags: ['gentle', 'thankyou'],       color: '#07b3a3' },
    ],
  },
  {
    id: 5,
    question: 'Який колір тобі відгукується?',
    hint: 'Довіряй інтуїції',
    gridCols: 2,
    options: [
      { id: 'pink',   label: 'Рожевий і ніжний',        icon: 'circle',          tags: ['gentle', 'romantic'], color: '#ff9cbf' },
      { id: 'bright', label: 'Яскравий і різнобарвний',  icon: 'palette',         tags: ['bright', 'fun'],      color: '#ffd740' },
      { id: 'white',  label: 'Білий і чистий',           icon: 'brightness_high', tags: ['calm', 'elegant'],    color: '#94a3b8' },
      { id: 'yellow', label: 'Жовтий і сонячний',        icon: 'wb_sunny',        tags: ['fun', 'bright'],      color: '#ffce3f' },
    ],
  },
  {
    id: 6,
    question: 'Який бюджет?',
    hint: 'Гарний букет є в будь-якому бюджеті',
    gridCols: 2,
    options: [
      { id: 'budget',  label: 'До 900 грн',        icon: 'savings',                tags: [], maxPrice: 900,  color: '#07b3a3' },
      { id: 'mid',     label: '900 — 1500 грн',    icon: 'account_balance_wallet', tags: [], maxPrice: 1500, color: '#34d399' },
      { id: 'premium', label: '1500 — 2000 грн',   icon: 'star',                   tags: [], maxPrice: 2000, color: '#fbbf24' },
      { id: 'luxury',  label: 'Від 2000 грн',      icon: 'workspace_premium',      tags: [], maxPrice: 9999, color: '#ff4d8d' },
    ],
  },
  {
    id: 7,
    question: 'Коли потрібен букет?',
    hint: 'Щоб ми встигли підготувати все ідеально',
    gridCols: 3,
    options: [
      { id: 'today',    label: 'Сьогодні — терміново', icon: 'bolt',           tags: ['urgent'], color: '#ff4d8d' },
      { id: 'tomorrow', label: 'Завтра',                icon: 'today',          tags: [],         color: '#07b3a3' },
      { id: 'planned',  label: 'Планую заздалегідь',   icon: 'calendar_month', tags: [],         color: '#34d399' },
    ],
  },
];

// ─── Service ──────────────────────────────────────────────────────────────────

type Direction = 'next' | 'prev';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly bouquetService = inject(BouquetService);

  readonly questions = QUIZ_QUESTIONS;

  readonly currentStep = signal(0);
  readonly answers     = signal<(QuizOption | null)[]>(new Array(QUIZ_QUESTIONS.length).fill(null));
  readonly showResult  = signal(false);
  readonly direction   = signal<Direction>('next');

  readonly currentQuestion = computed(() => this.questions[this.currentStep()]);

  /** Options filtered by Q1 recipient answer (hides showFor-restricted options) */
  readonly currentFilteredQuestion = computed(() => {
    const q = this.currentQuestion();
    const recipientId = this.answers()[0]?.id;
    const options = q.options.filter(
      (o) => !o.showFor || !recipientId || o.showFor.includes(recipientId),
    );
    return { ...q, options };
  });

  readonly currentAnswer   = computed(() => this.answers()[this.currentStep()]);
  readonly isFirstQuestion = computed(() => this.currentStep() === 0);
  readonly isLastQuestion  = computed(() => this.currentStep() === this.questions.length - 1);

  readonly progress = computed(() => {
    if (this.showResult()) return 100;
    return (this.answers().filter((a) => a !== null).length / this.questions.length) * 100;
  });

  /** Select option and advance to next question after 400ms animation window */
  selectOption(option: QuizOption): void {
    this.direction.set('next');
    this.answers.update((arr) => {
      const next = [...arr];
      next[this.currentStep()] = option;
      return next;
    });
    setTimeout(() => {
      if (this.isLastQuestion()) {
        this.showResult.set(true);
      } else {
        this.currentStep.update((s) => s + 1);
      }
    }, 400);
  }

  /** Save answer without advancing — used for the "other" option so user can type */
  selectOnly(option: QuizOption): void {
    this.answers.update((arr) => {
      const next = [...arr];
      next[this.currentStep()] = option;
      return next;
    });
  }

  /** Manually advance from current step (called after user types in "other" field) */
  advanceFromCurrent(): void {
    this.direction.set('next');
    setTimeout(() => {
      if (this.isLastQuestion()) {
        this.showResult.set(true);
      } else {
        this.currentStep.update((s) => s + 1);
      }
    }, 0);
  }

  goBack(): void {
    this.direction.set('prev');
    if (this.showResult()) {
      this.showResult.set(false);
      return;
    }
    if (this.currentStep() > 0) {
      this.currentStep.update((s) => s - 1);
    }
  }

  goToQuestion(stepIndex: number): void {
    this.direction.set('prev');
    this.showResult.set(false);
    this.currentStep.set(stepIndex);
  }

  restart(): void {
    this.currentStep.set(0);
    this.answers.set(new Array(this.questions.length).fill(null));
    this.showResult.set(false);
    this.direction.set('next');
  }

  getResult(): QuizResult[] {
    const answers = this.answers();
    const maxPrice = answers.find((a) => a?.maxPrice !== undefined)?.maxPrice ?? 9999;

    // Build weighted tag map; skip "other" answers (no tags → no contribution)
    const tagWeights: Record<string, number> = {};
    answers.forEach((answer, i) => {
      if (!answer || answer.id === 'other' || answer.tags.length === 0) return;
      const weight = QUESTION_WEIGHTS[i + 1] ?? 1;
      answer.tags.forEach((tag) => {
        tagWeights[tag] = (tagWeights[tag] || 0) + weight;
      });
    });

    const totalWeight = Object.values(tagWeights).reduce((s, w) => s + w, 0);

    const scored = this.bouquetService
      .getAll()
      .map((b) => {
        // Derive effective tags from bouquet structured fields
        // (Firestore bouquets often have tags[] = [] — this ensures scoring always works)
        const effectiveTags = getBouquetEffectiveTags(b);
        let score = effectiveTags.reduce((sum, tag) => sum + (tagWeights[tag] || 0), 0);

        // Soft budget penalty proportional to excess
        if (b.price > maxPrice) {
          const excessRatio = (b.price - maxPrice) / maxPrice;
          score = Math.max(0, score - excessRatio * 5);
        }

        return { bouquet: b, score, effectiveTags };
      })
      .sort((a, b) => b.score - a.score);

    // Dev-only logging to verify scoring reacts to answers
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      console.group('%c[Quiz] Scoring debug', 'color:#ff4d8d;font-weight:bold');
      console.log('Tag weights:', { ...tagWeights });
      scored.slice(0, 6).forEach(({ bouquet, score, effectiveTags }) => {
        console.log(
          `${score.toFixed(1).padStart(5)} — ${bouquet.name}`,
          '\n   tags:', effectiveTags.join(', '),
        );
      });
      console.groupEnd();
    }

    return scored.slice(0, 3).map(({ bouquet, score, effectiveTags }) => {
      const matchRatio = totalWeight > 0 ? score / totalWeight : 0;
      const matchStrength: QuizResult['matchStrength'] =
        matchRatio >= 0.45 ? 'strong' : matchRatio >= 0.2 ? 'medium' : 'weak';

      // Build reason from top 2 matched tags specific to this bouquet
      const snippets = effectiveTags
        .filter((t) => (tagWeights[t] || 0) > 0)
        .sort((a, b) => (tagWeights[b] || 0) - (tagWeights[a] || 0))
        .slice(0, 2)
        .map((t) => SHORT_TAG_REASONS[t])
        .filter((r): r is string => Boolean(r));

      snippets.push(bouquet.price <= maxPrice ? 'в межах бюджету' : 'трохи поза бюджетом');

      return { bouquet, score, matchStrength, reason: snippets.join(' · ') };
    });
  }
}
