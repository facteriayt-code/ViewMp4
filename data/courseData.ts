import { DayLesson, Badge, MonthExam } from '../types';

export const BADGES_LIST: Badge[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Completed your very first English lesson!',
    icon: '🌟',
    requirement: 'Complete Day 1'
  },
  {
    id: 'streak_3',
    name: 'On Fire!',
    description: 'Maintained a 3-day learning streak.',
    icon: '🔥',
    requirement: '3 Day Streak'
  },
  {
    id: 'grammar_detective',
    name: 'Grammar Detective',
    description: 'Scored 100% on 5 grammar quizzes.',
    icon: '🔍',
    requirement: '5 Perfect Quizzes'
  },
  {
    id: 'vocab_titan',
    name: 'Word Titan',
    description: 'Mastered 50 new vocabulary collocations.',
    icon: '📚',
    requirement: 'Master 50 Words'
  },
  {
    id: 'month_1_master',
    name: 'Foundation Legend',
    description: 'Passed the Month 1 Comprehensive Mastery Exam!',
    icon: '🏆',
    requirement: 'Pass Month 1 Exam'
  },
  {
    id: 'month_2_master',
    name: 'Intermediate Scholar',
    description: 'Passed the Month 2 Conversational Mastery Exam!',
    icon: '🚀',
    requirement: 'Pass Month 2 Exam'
  },
  {
    id: 'month_3_master',
    name: 'Grand Master Linguist',
    description: 'Passed the Month 3 Advanced Subjunctive & Nuance Exam!',
    icon: '🎓',
    requirement: 'Pass Month 3 Exam'
  },
  {
    id: 'pro_linguist',
    name: 'Pro Linguist',
    description: 'Mastered Advanced Subjunctive & Passive Voice.',
    icon: '👑',
    requirement: 'Complete Pro Track'
  }
];

export const MONTH_EXAMS: MonthExam[] = [
  {
    monthNumber: 1,
    title: 'Month 1 Comprehensive Foundation Exam',
    subtitle: 'Nouns, Articles, Basic Tenses, Subject-Verb Agreement & Prepositions',
    description: 'Test your mastery of Month 1 foundational concepts. Score 70%+ to earn your Month 1 Graduate Certificate & Badge!',
    passingScorePercent: 70,
    xpReward: 250,
    gemReward: 50,
    badgeId: 'month_1_master',
    questions: [
      {
        id: 'm1-q1',
        topicTag: 'Articles & Phonetics',
        question: 'Which sentence correctly uses indefinite articles based on spoken English phonetics?',
        options: [
          'She met a European investor for an hour.',
          'She met an European investor for a hour.',
          'She met European investor for an hour.',
          'She met a European investor for a hour.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '"European" starts with a consonant "Yoo" sound (/jʊər/), requiring "a". "Hour" starts with a silent "H" vowel sound (/aʊər/), requiring "an".'
      },
      {
        id: 'm1-q2',
        topicTag: 'Subject-Verb Agreement',
        question: 'Select the sentence with accurate subject-verb agreement:',
        options: [
          'Neither of the manager\'s solutions solves the problem.',
          'Neither of the manager\'s solutions solve the problem.',
          'Neither of the manager\'s solutions were solving the problem.',
          'Neither of the manager\'s solutions solving the problem.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '"Neither" is an indefinite singular pronoun when referring to options individually, taking the singular verb "solves".'
      },
      {
        id: 'm1-q3',
        topicTag: 'Present Simple vs Stative Verbs',
        question: 'Why is "I am wanting a cup of coffee" grammatically unnatural in standard English?',
        options: [
          'Because "want" is a stative verb describing a mental state, not a continuous physical action.',
          'Because "want" cannot be used in present time.',
          'Because "coffee" is uncountable.',
          'Because "cup" requires a plural verb.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Stative verbs (want, love, know, belong, prefer) express cognitive states and do not naturally take continuous -ing in standard grammar.'
      },
      {
        id: 'm1-q4',
        topicTag: 'Prepositions of Time & Location',
        question: 'Fill in the blanks: "The conference starts ___ 9:00 AM ___ Monday ___ July."',
        options: [
          'at / on / in',
          'in / at / on',
          'on / in / at',
          'at / in / on'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Preposition rule: "at" for specific exact clock times, "on" for days of the week, and "in" for months/seasons/years.'
      },
      {
        id: 'm1-q5',
        topicTag: 'Countable vs Uncountable Nouns',
        question: 'Identify the grammatically correct workplace sentence:',
        options: [
          'She gave me two pieces of advice regarding my career.',
          'She gave me two advices regarding my career.',
          'She gave me an advice regarding my career.',
          'She gave me many advices regarding my career.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '"Advice" is an uncountable abstract noun in English. To count it, we must use a quantifier counter like "pieces of advice".'
      }
    ]
  },
  {
    monthNumber: 2,
    title: 'Month 2 Intermediate Conversational Mastery Exam',
    subtitle: 'Present Perfect, Past Tenses, Conditionals, Modals & Relative Clauses',
    description: 'Demonstrate fluency in intermediate sentence structures, time relationships, and conditional logic.',
    passingScorePercent: 75,
    xpReward: 350,
    gemReward: 75,
    badgeId: 'month_2_master',
    questions: [
      {
        id: 'm2-q1',
        topicTag: 'Present Perfect vs Past Simple',
        question: 'Why do we say "I have lived in London for 3 years" vs "I lived in London for 3 years"?',
        options: [
          '"have lived" implies the action continues to the present moment; "lived" means you no longer live there.',
          '"have lived" is only used for past actions completed yesterday.',
          'There is no difference in meaning between the two.',
          '"lived" is future tense.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Present Perfect connects past to present (still living there now). Past Simple isolates the action in finished past time.'
      },
      {
        id: 'm2-q2',
        topicTag: 'Hypothetical Conditionals',
        question: 'Choose the correct Second Conditional sentence for imaginary present situations:',
        options: [
          'If I were you, I would take the offer immediately.',
          'If I am you, I will take the offer immediately.',
          'If I was you, I will took the offer immediately.',
          'If I would be you, I took the offer immediately.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Second conditional uses subjunctive "were" for all subjects (I/he/she/it) + "would + base verb" to express hypothetical present advice.'
      },
      {
        id: 'm2-q3',
        topicTag: 'Past Perfect Connection',
        question: 'Which sentence correctly shows an action completed BEFORE another past event?',
        options: [
          'When the train arrived, we had already bought our tickets.',
          'When the train arrived, we have already bought our tickets.',
          'When the train had arrived, we buy our tickets.',
          'When the train arrives, we had bought tickets.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Past Perfect ("had bought") establishes the earlier past action relative to the Past Simple action ("arrived").'
      },
      {
        id: 'm2-q4',
        topicTag: 'Modal Verbs for Regret',
        question: 'Expressing regret about a past mistake: "I failed the test because I didn\'t study."',
        options: [
          'I should have studied harder.',
          'I must study harder.',
          'I could study harder.',
          'I would study harder yesterday.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '"Should have + Past Participle (V3)" is used specifically to express advice or regret regarding past actions.'
      },
      {
        id: 'm2-q5',
        topicTag: 'Relative Pronouns',
        question: 'Choose the correct formal relative pronoun for the object of a clause:',
        options: [
          'The candidate whom we interviewed yesterday was selected.',
          'The candidate which we interviewed yesterday was selected.',
          'The candidate whose we interviewed yesterday was selected.',
          'The candidate where we interviewed yesterday was selected.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '"Whom" functions as the object pronoun for people ("we interviewed him/whom"), whereas "who" is the subject pronoun.'
      }
    ]
  },
  {
    monthNumber: 3,
    title: 'Month 3 Advanced Subjunctive & Pro Nuance Exam',
    subtitle: 'Advanced Subjunctive Mood, Passive Voice Diplomacy, Inversion & C1 Syntax',
    description: 'The ultimate assessment for C1/C2 mastery: prove your command over English nuance, diplomatic structures, and subjunctive forms.',
    passingScorePercent: 80,
    xpReward: 500,
    gemReward: 100,
    badgeId: 'month_3_master',
    questions: [
      {
        id: 'm3-q1',
        topicTag: 'Formal Subjunctive Mood',
        question: 'What is the correct subjunctive form in formal demand clauses?',
        options: [
          'The committee insisted that he be present at the hearing.',
          'The committee insisted that he is present at the hearing.',
          'The committee insisted that he was present at the hearing.',
          'The committee insisted that he has been present at the hearing.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Mandative subjunctive requires the base bare infinitive form of the verb ("be", NOT "is/was") after verbs of demand/insistence.'
      },
      {
        id: 'm3-q2',
        topicTag: 'Diplomatic Passive Voice',
        question: 'In executive business writing, why prefer "A mistake was made on the contract" over "You made a mistake"?',
        options: [
          'It shifts focus onto the contract issue while maintaining professional courtesy without personal accusations.',
          'It is shorter and easier to read.',
          'Because active voice is illegal in business documents.',
          'Because "made" is an adjective.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Passive voice de-emphasizes the personal agent ("you") to soften blame and focus objectively on resolution.'
      },
      {
        id: 'm3-q3',
        topicTag: 'Negative Inversion for Emphasis',
        question: 'Select the inverted sentence structure used for high-impact formal prose:',
        options: [
          'Not only did she pass the exam, but she also achieved the highest score.',
          'Not only she passed the exam, but she also achieved the highest score.',
          'Not only passed she the exam, but achieved the highest score.',
          'Not only she did pass the exam, but she achieved.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'When starting a sentence with negative expressions ("Not only", "Seldom", "Rarely"), auxiliary verb inversion (did + subject + base verb) is required.'
      },
      {
        id: 'm3-q4',
        topicTag: 'Mixed Conditionals',
        question: 'Which sentence connects a past cause to a current present state?',
        options: [
          'If I had accepted that job last year, I would be living in Paris today.',
          'If I accept that job last year, I am living in Paris today.',
          'If I would accept that job last year, I had lived in Paris today.',
          'If I accepted that job last year, I will live in Paris today.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Mixed conditional pairing: Past Perfect ("had accepted" = unreal past action) + "would + base verb" ("would be living" = present result).'
      },
      {
        id: 'm3-q5',
        topicTag: 'Nuanced Word Collocations',
        question: 'Select the most natural native collocation in executive discourse:',
        options: [
          'We must address the elephant in the room and make a compelling argument.',
          'We must speak the big animal in the room and do a strong talk.',
          'We must talk the heavy issue in the room and create a big reason.',
          'We must address the rhino in the room and take a heavy debate.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '"Elephant in the room" (obvious unmentioned problem) and "make a compelling argument" are fixed native idiomatic collocations.'
      }
    ]
  }
];

export const DAYS_CURRICULUM: DayLesson[] = [
  // --- MONTH 1: FOUNDATIONS & GRAMMAR BASICS (DAYS 1-30) ---
  {
    id: 'day-1',
    dayNumber: 1,
    monthNumber: 1,
    title: 'Nouns & Articles: The Magic of "A", "An", and "The"',
    category: 'grammar',
    level: 'beginner',
    description: 'Master when and why we use indefinite ("a/an") vs definite ("the") articles with nouns.',
    xpReward: 50,
    estimatedMinutes: 8,
    theory: {
      summary: 'Articles tell the listener whether we are talking about any general item or one specific, known item.',
      rules: [
        {
          rule: 'Use "a" before consonant SOUNDS, and "an" before vowel SOUNDS.',
          why: 'We use "an" purely for smooth spoken rhythm! Saying "a apple" creates an awkward pause ("a...apple"). "An apple" flows continuously.',
          example: 'an hour (silent h = vowel sound), a university (yoo sound = consonant sound)',
          wrongExample: 'a hour, an university'
        },
        {
          rule: 'Use "the" when both speaker and listener know WHICH specific thing is meant.',
          why: '"The" isolates a unique or previously mentioned noun so there is zero ambiguity.',
          example: 'I saw a dog. The dog was barking. ("a dog" introduces it; "the dog" specifies it)',
          wrongExample: 'I saw a dog. A dog was barking. (sounds like two different dogs)'
        },
        {
          rule: 'Do NOT use articles with general plural or uncountable nouns.',
          why: 'General categories exist as a concept, so adding "a" or "the" would incorrectly limit them to a specific set.',
          example: 'Water is essential for life. (General) / The water in this bottle is cold. (Specific)',
          wrongExample: 'The water is essential for life.'
        }
      ],
      wordExplanations: [
        { word: 'an apple', role: 'Indefinite Article + Singular Countable Noun', whyUsed: '"An" is used because "apple" starts with the vowel sound /æ/. It introduces one non-specific apple.' },
        { word: 'the sun', role: 'Definite Article + Unique Noun', whyUsed: '"The" is required because there is only one sun in our solar system; both speaker and listener know exactly which sun.' },
        { word: 'music', role: 'Uncountable Abstract Noun', whyUsed: 'No article is used here because "music" is an uncountable general concept.' }
      ],
      proTip: 'Focus on the SOUND, not the spelling letter! "An honest person" (silent H = /ɒ/ vowel sound).'
    },
    quiz: [
      {
        id: 'd1-q1',
        question: 'Choose the correct sentence for hiring an applicant:',
        sentenceContext: 'We need to hire ___ European specialist for this team.',
        options: ['a European specialist', 'an European specialist', 'the European specialist', 'European specialist'],
        correctAnswerIndex: 0,
        explanationWhy: '"European" begins with a consonant "Yoo" sound (/jʊər/ like "you"), so English phonetics requires "a", NOT "an"!',
        grammaticalRole: 'Indefinite Article before Consonant Sound'
      },
      {
        id: 'd1-q2',
        question: 'Why do we say "She is an honest woman" instead of "a honest woman"?',
        options: [
          'Because "honest" begins with a silent H, making the first spoken sound a vowel sound (/ɒ/).',
          'Because "woman" is a countable noun.',
          'Because "honest" is an adjective.',
          'It is a random rule with no phonetic reason.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'The letter "h" in "honest" is silent, so the word starts with the vowel sound /ɒ/. "An" prevents the awkward glottal stop of "a...honest".',
        grammaticalRole: 'Phonetic Vowel Sound Article Alignment'
      },
      {
        id: 'd1-q3',
        question: 'Which article fits best? "Please pass me ___ salt on the table."',
        options: ['the', 'a', 'an', 'zero article'],
        correctAnswerIndex: 0,
        explanationWhy: '"The" is used because both you and the listener can see the specific salt shaker on the table.',
        grammaticalRole: 'Definite Article for Contextually Specific Noun'
      }
    ],
    miniGame: {
      type: 'sentence_builder',
      title: 'Article & Noun Assembler',
      instructions: 'Tap the word blocks in correct order to form a grammatically accurate sentence!',
      sentenceBuilder: [
        {
          targetSentence: 'She ordered an apple and a cup of tea.',
          wordPool: ['She', 'ordered', 'an', 'apple', 'and', 'a', 'cup', 'of', 'tea.'],
          grammarBreakdown: '"an" is paired with "apple" (vowel sound), while "a" is paired with "cup" (consonant sound).'
        },
        {
          targetSentence: 'The sun shines brightly in the sky.',
          wordPool: ['The', 'sun', 'shines', 'brightly', 'in', 'the', 'sky.'],
          grammarBreakdown: '"The" is used for unique natural entities (the sun, the sky).'
        }
      ]
    }
  },
  {
    id: 'day-2',
    dayNumber: 2,
    monthNumber: 1,
    title: 'Subject-Verb Agreement: Matching Singulars & Plurals',
    category: 'grammar',
    level: 'beginner',
    description: 'Understand why verbs take "-s" in third-person singular and how collective nouns behave.',
    xpReward: 55,
    estimatedMinutes: 10,
    theory: {
      summary: 'A verb must match its subject in number: singular subjects take singular verbs, plural subjects take plural verbs.',
      rules: [
        {
          rule: 'In Present Simple, third-person singular (he/she/it) adds "-s" or "-es" to the verb.',
          why: 'Historical Germanic sound shifts preserved the "-s" suffix specifically to signal that one individual subject is performing a habitual state or action.',
          example: 'The dog barks. (Singular dog = barks) / Dogs bark. (Plural dogs = bark)',
          wrongExample: 'The dog bark. / Dogs barks.'
        },
        {
          rule: 'Phrases between subject and verb (like "along with", "as well as") do NOT change the subject.',
          why: 'The core subject remains singular; prepositional modifiers do not alter the grammatical head noun.',
          example: 'The captain, as well as the players, is excited. ("captain" is the true singular subject)',
          wrongExample: 'The captain, as well as the players, are excited.'
        },
        {
          rule: 'Indefinite pronouns like "everyone", "somebody", "each" take singular verbs.',
          why: 'These words refer to individuals ONE BY ONE, focusing on the singular entity within a group.',
          example: 'Everyone has a ticket.',
          wrongExample: 'Everyone have a ticket.'
        }
      ],
      wordExplanations: [
        { word: 'everyone has', role: 'Indefinite Pronoun + Singular Third-Person Verb', whyUsed: '"Everyone" considers all members individually, requiring singular "has".' },
        { word: 'neither... is', role: 'Correlative Conjunction + Singular Verb', whyUsed: 'When "neither/nor" joins singular nouns, the subject is strictly singular.' }
      ],
      proTip: 'Ignore words inside parentheses or commas when identifying the real subject!'
    },
    quiz: [
      {
        id: 'd2-q1',
        question: 'Choose the correct verb form:',
        sentenceContext: 'The box of chocolates ___ on the kitchen counter.',
        options: ['is', 'are', 'were', 'have been'],
        correctAnswerIndex: 0,
        explanationWhy: 'The real subject is "The box" (singular), not "chocolates" (prepositional phrase object). Singular subject = "is".',
        grammaticalRole: 'Singular Subject Agreement across Prepositional Phrase'
      },
      {
        id: 'd2-q2',
        question: 'Why is "Neither of the answers is correct" grammatically accurate?',
        options: [
          'Because "Neither" means "not one" (singular), so it requires the singular verb "is".',
          'Because "answers" is plural.',
          'Because "correct" is an adjective.',
          'It is an exception to English grammar.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '"Neither" literally means "not one single choice", making the grammatical core singular ("not one... is").',
        grammaticalRole: 'Singular Distributive Pronoun Subject'
      }
    ],
    miniGame: {
      type: 'mistake_detective',
      title: 'Subject-Verb Detective',
      instructions: 'Spot the mistake in subject-verb agreement and choose the corrected sentence!',
      mistakes: [
        {
          incorrectSentence: 'A list of new rules were posted on the bulletin board.',
          correctSentence: 'A list of new rules was posted on the bulletin board.',
          explanationWhy: 'The subject is "A list" (singular), so the verb must be "was", not "were".'
        },
        {
          incorrectSentence: 'Every student in the class have completed their assignment.',
          correctSentence: 'Every student in the class has completed their assignment.',
          explanationWhy: '"Every student" is singular and requires "has".'
        }
      ]
    }
  },
  {
    id: 'day-3',
    dayNumber: 3,
    monthNumber: 1,
    title: 'Present Simple vs. Present Continuous: State vs. Action',
    category: 'tenses',
    level: 'beginner',
    description: 'Learn why routine facts use Present Simple while ongoing actions use Present Continuous.',
    xpReward: 60,
    estimatedMinutes: 10,
    theory: {
      summary: 'Present Simple describes permanent facts and routines. Present Continuous (be + verb-ing) describes actions happening RIGHT NOW or temporarily.',
      rules: [
        {
          rule: 'Use Present Simple for habits, facts, and permanent truths.',
          why: 'Presents timeless state without bounding it to the current fleeting second.',
          example: 'Water freezes at 0°C. / I work at a hospital.',
          wrongExample: 'Water is freezing at 0°C.'
        },
        {
          rule: 'Use Present Continuous (be + -ing) for actions in progress at the time of speaking.',
          why: 'The "-ing" participle denotes incomplete duration currently in motion.',
          example: 'Look! It is raining outside.',
          wrongExample: 'Look! It rains outside.'
        },
        {
          rule: 'Stative verbs (know, want, believe, love, understand) are rarely used in continuous form.',
          why: 'States of mind or emotions are non-dynamic; they do not possess a physical starting and stopping movement.',
          example: 'I understand this rule.',
          wrongExample: 'I am understanding this rule.'
        }
      ],
      wordExplanations: [
        { word: 'is raining', role: 'Present Continuous (be + present participle)', whyUsed: 'Emphasizes an ongoing action taking place right now at this exact moment.' },
        { word: 'understands', role: 'Stative Verb in Present Simple', whyUsed: '"Understand" is a mental state, not an active physical motion, so continuous -ing is avoided.' }
      ],
      proTip: 'Look for time markers: "always/usually" = Present Simple; "now/at the moment/look!" = Present Continuous.'
    },
    quiz: [
      {
        id: 'd3-q1',
        question: 'Which sentence correctly expresses a permanent job routine?',
        options: [
          'She works as an software engineer in London.',
          'She works as a software engineer in London.',
          'She is working as a software engineer in London forever.',
          'She work as a software engineer in London.'
        ],
        correctAnswerIndex: 1,
        explanationWhy: 'A permanent career state uses Present Simple "works", plus indefinite article "a" before consonant sound "software".',
        grammaticalRole: 'Present Simple Permanent Habit/Fact'
      },
      {
        id: 'd3-q2',
        question: 'Why do native speakers say "I need help right now" instead of "I am needing help right now"?',
        options: [
          'Because "need" is a stative verb representing an internal mental requirement, not a physical process.',
          'Because "need" is a noun.',
          'Because "right now" forces past tense.',
          'Both forms mean the exact same thing with no difference.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Stative verbs express condition, possession, or emotion rather than action, so they take simple tense forms.',
        grammaticalRole: 'Stative Verb Non-Continuous Rule'
      }
    ],
    miniGame: {
      type: 'word_match',
      title: 'Stative vs. Dynamic Verbs Blitz',
      instructions: 'Match each verb to its correct category and usage explanation!',
      wordPairs: [
        { id: 'p1', word: 'Believe', definitionOrSynonym: 'Stative Verb (Mental State)', whyItMatters: 'Cannot use "-ing": "I believe you" (NOT "I am believing you").' },
        { id: 'p2', word: 'Run', definitionOrSynonym: 'Dynamic Action Verb', whyItMatters: 'Can use continuous: "He is running in the park right now."' },
        { id: 'p3', word: 'Own', definitionOrSynonym: 'Stative Verb (Possession)', whyItMatters: 'States ownership: "She owns a car" (NOT "She is owning a car").' }
      ]
    }
  },

  // --- DAY 15: PREPOSITIONS OF TIME & PLACE ---
  {
    id: 'day-15',
    dayNumber: 15,
    monthNumber: 1,
    title: 'Prepositions Pyramid: "In", "On", and "At" Decoded',
    category: 'grammar',
    level: 'intermediate',
    description: 'Learn the spatial and temporal pyramid rule for in, on, at so you never guess again.',
    xpReward: 70,
    estimatedMinutes: 12,
    theory: {
      summary: 'Think of "In, On, At" as a inverted pyramid from General (Broad) to Specific (Point).',
      rules: [
        {
          rule: 'IN = General / Large Enclosed Areas & Long Timeframes (Centuries, Years, Months, Countries, Cities).',
          why: '"In" signifies containment inside a broad boundary.',
          example: 'in 2026, in July, in Paris, in the room',
          wrongExample: 'on 2026, at Paris'
        },
        {
          rule: 'ON = More Specific / Surfaces & Days/Dates (Days of week, Specific dates, Streets, Avenues).',
          why: '"On" signifies physical contact with a surface or position on a calendar day.',
          example: 'on Monday, on July 15th, on Fifth Avenue, on the table',
          wrongExample: 'in Monday, at July 15th'
        },
        {
          rule: 'AT = Most Specific / Exact Time & Specific Addresses/Points.',
          why: '"At" targets a single pinpoint dot in space or time.',
          example: 'at 5:30 PM, at 742 Evergreen Terrace, at the entrance, at midnight',
          wrongExample: 'in 5:30 PM, on midnight'
        }
      ],
      wordExplanations: [
        { word: 'on Monday', role: 'Preposition of Specific Calendar Day', whyUsed: '"On" is required for specific named calendar days.' },
        { word: 'at 3 o\'clock', role: 'Preposition of Precise Clock Time', whyUsed: '"At" targets an exact pinpoint time on the clock.' }
      ],
      proTip: 'Pyramid Rule: IN (big/broad) ➔ ON (narrower/days) ➔ AT (exact spot/time)!'
    },
    quiz: [
      {
        id: 'd15-q1',
        question: 'Fill in the blank: "The international flight lands ___ 8:45 AM ___ Friday."',
        options: ['at / on', 'in / on', 'on / at', 'at / in'],
        correctAnswerIndex: 0,
        explanationWhy: '"at" is used for precise clock time (8:45 AM), while "on" is used for specific days of the week (Friday).',
        grammaticalRole: 'Prepositions of Time Precision'
      },
      {
        id: 'd15-q2',
        question: 'Why do we say "in the morning" but "at night"?',
        options: [
          '"The morning" is viewed as an extended time period (IN), whereas "night" is treated as an exact point/milestone (AT) in traditional idiom.',
          'It is a mistake made by native speakers.',
          'Because morning has 7 letters.',
          'There is no reason at all.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Historical idiom treats morning, afternoon, evening as enclosed duration blocks ("in"), while night is marked as a singular milestone ("at night").',
        grammaticalRole: 'Time Preposition Idiomatic Context'
      }
    ],
    miniGame: {
      type: 'sentence_builder',
      title: 'Preposition Pyramid Challenge',
      instructions: 'Build the correct sentence using in, on, or at!',
      sentenceBuilder: [
        {
          targetSentence: 'The meeting is at 10 AM on Monday in London.',
          wordPool: ['The', 'meeting', 'is', 'at', '10', 'AM', 'on', 'Monday', 'in', 'London.'],
          grammarBreakdown: 'at (exact time) ➔ on (day) ➔ in (city/country).'
        }
      ]
    }
  },

  // --- MONTH 2: TENSE MASTERY & CLAUSES (DAYS 31-60) ---
  {
    id: 'day-35',
    dayNumber: 35,
    monthNumber: 2,
    title: 'Present Perfect vs. Past Simple: Why Timeframe Changes Everything',
    category: 'tenses',
    level: 'intermediate',
    description: 'Discover why "I have visited Japan" vs "I visited Japan in 2020" carry completely different meanings.',
    xpReward: 80,
    estimatedMinutes: 12,
    theory: {
      summary: 'Past Simple is for FINISHED past time with a closed window. Present Perfect (have/has + V3) connects past experience to the PRESENT moment.',
      rules: [
        {
          rule: 'Use Past Simple when the time period is CLOSED (yesterday, in 2021, 5 minutes ago).',
          why: 'The past timestamp locks the event inside completed history; it has no direct connection to current time.',
          example: 'I lost my keys yesterday. (Time specified and finished)',
          wrongExample: 'I have lost my keys yesterday.'
        },
        {
          rule: 'Use Present Perfect (have/has + past participle) when the time period is OPEN or experience matters NOW.',
          why: 'Auxiliary verb "have" anchors the action to your current life state.',
          example: 'I have lost my keys! (And I still don\'t have them right now!)',
          wrongExample: 'I lost my keys and I still have no keys.'
        },
        {
          rule: 'Never use specific past time words (yesterday, ago, last year) with Present Perfect.',
          why: 'Present Perfect cannot coexist with closed past timestamps because "have" demands an open present window.',
          example: 'She has lived here since 2018. (Still lives here!)',
          wrongExample: 'She has lived here in 2018.'
        }
      ],
      wordExplanations: [
        { word: 'have visited', role: 'Present Perfect (have + V3)', whyUsed: 'Emphasizes life experience up to the present moment without specifying a closed past date.' },
        { word: 'visited', role: 'Past Simple', whyUsed: 'Refers to a specific completed trip in a closed past timeframe.' }
      ],
      proTip: 'If you mention WHEN (e.g. "at 4 PM"), use Past Simple! If you focus on RESULT or EXPERIENCE, use Present Perfect.'
    },
    quiz: [
      {
        id: 'd35-q1',
        question: 'Which sentence is grammatically correct?',
        options: [
          'I have seen that movie last night.',
          'I saw that movie last night.',
          'I have saw that movie last night.',
          'I see that movie last night.'
        ],
        correctAnswerIndex: 1,
        explanationWhy: '"last night" is a closed past timeframe, so you MUST use Past Simple "saw", NOT Present Perfect.',
        grammaticalRole: 'Past Simple with Closed Past Time Anchor'
      },
      {
        id: 'd35-q2',
        question: 'Why does a doctor ask "Have you taken your medicine today?" instead of "Did you take your medicine today?"',
        options: [
          'Because "today" is an unfinished time window, so Present Perfect asks about completion up to this moment.',
          'Because doctors always use passive voice.',
          'Because "medicine" is uncountable.',
          'There is no difference in meaning.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '"Today" is still ongoing (open time), so Present Perfect "Have you taken" checks if the action has been accomplished within the active timeframe.',
        grammaticalRole: 'Present Perfect in Unfinished Time Window'
      }
    ],
    miniGame: {
      type: 'mistake_detective',
      title: 'Tense Window Detective',
      instructions: 'Fix the tense errors between closed and open timeframes!',
      mistakes: [
        {
          incorrectSentence: 'I have visited Paris three years ago.',
          correctSentence: 'I visited Paris three years ago.',
          explanationWhy: '"three years ago" is a closed past marker, so Past Simple "visited" is required.'
        },
        {
          incorrectSentence: 'She lived in Rome since 2020 and still lives there.',
          correctSentence: 'She has lived in Rome since 2020.',
          explanationWhy: 'Action starting in the past and continuing to present requires Present Perfect "has lived".'
        }
      ]
    }
  },

  // --- MONTH 3: PRO SYNTAX, CONDITIONALS & NUANCE (DAYS 61-90) ---
  {
    id: 'day-65',
    dayNumber: 65,
    monthNumber: 3,
    title: 'Conditionals Mastery: Zero, 1st, 2nd & 3rd Hypotheticals',
    category: 'pro_syntax',
    level: 'pro',
    description: 'Master real vs unreal conditions and understand why "If I were you" uses the subjunctive mood.',
    xpReward: 100,
    estimatedMinutes: 15,
    theory: {
      summary: 'Conditionals express cause-and-effect across real facts, future possibilities, hypothetical scenarios, and past regrets.',
      rules: [
        {
          rule: 'Zero Conditional (If + Present, Present) = Scientific Facts / Universal Laws.',
          why: 'Expresses direct automatic cause and effect without doubt.',
          example: 'If you heat ice, it melts.',
          wrongExample: 'If you heat ice, it will melt tomorrow.'
        },
        {
          rule: '1st Conditional (If + Present, Will + Verb) = Real Future Possibility.',
          why: 'Sets a realistic condition that triggers a future result.',
          example: 'If it rains tomorrow, we will stay indoors.',
          wrongExample: 'If it will rain tomorrow, we stay indoors.'
        },
        {
          rule: '2nd Conditional (If + Past Simple, Would + Verb) = Unreal Present/Hypothetical.',
          why: 'Uses past tense distance ("if I had...") to signal mental distance from reality.',
          example: 'If I won the lottery, I would buy a house.',
          wrongExample: 'If I win the lottery yesterday, I bought a house.'
        },
        {
          rule: 'Subjunctive "Were": Say "If I WERE you" (not "was").',
          why: 'English subjunctive mood replaces "was" with "were" for all subjects to clearly signal complete unreality.',
          example: 'If I were president, I would change the law.',
          wrongExample: 'If I was president...'
        }
      ],
      wordExplanations: [
        { word: 'If I were', role: 'Subjunctive Mood Past Unreality', whyUsed: '"Were" is used regardless of singular "I" to mark a purely hypothetical advice scenario.' },
        { word: 'would buy', role: 'Modal Conditional Result', whyUsed: '"Would" expresses the contingent hypothetical consequence.' }
      ],
      proTip: 'The further back in tense you go (Present ➔ Past ➔ Past Perfect), the further away from reality the condition is!'
    },
    quiz: [
      {
        id: 'd65-q1',
        question: 'Choose the grammatically accurate 2nd Conditional sentence:',
        options: [
          'If I were you, I would accept the job offer immediately.',
          'If I was you, I will accept the job offer immediately.',
          'If I am you, I would accept the job offer immediately.',
          'If I had been you, I accept the job offer.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '2nd Conditional for hypothetical advice uses subjunctive "were" + modal "would accept".',
        grammaticalRole: 'Second Conditional Subjunctive Advice'
      },
      {
        id: 'd65-q2',
        question: 'Why do we say "If I had studied harder, I would have passed the exam"?',
        options: [
          'Because it is a 3rd Conditional expressing a past regret that can no longer be changed (Past Perfect + Would have V3).',
          'Because the exam is happening tomorrow.',
          'Because "had" is mandatory in all if-clauses.',
          'It is Present Simple.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '3rd Conditional reflects on an unchangeable past regret. "Had studied" (Past Perfect) sets the past condition, "would have passed" gives the missed past outcome.',
        grammaticalRole: 'Third Conditional Unreal Past Regret'
      }
    ],
    miniGame: {
      type: 'sentence_builder',
      title: 'Pro Conditional Architect',
      instructions: 'Construct the subjunctive condition statement!',
      sentenceBuilder: [
        {
          targetSentence: 'If I were the CEO, I would invest in innovation.',
          wordPool: ['If', 'I', 'were', 'the', 'CEO,', 'I', 'would', 'invest', 'in', 'innovation.'],
          grammarBreakdown: 'Subjunctive "were" signals unreal hypothetical state.'
        }
      ]
    }
  },

  // --- DAY 75: PASSIVE VOICE & DIPLOMATIC EXPRESSION ---
  {
    id: 'day-75',
    dayNumber: 75,
    monthNumber: 3,
    title: 'Passive Voice & Nuance: Why Focus Matters in Writing',
    category: 'pro_syntax',
    level: 'pro',
    description: 'Learn why scientific reports, journalism, and diplomatic communication prefer passive structures.',
    xpReward: 100,
    estimatedMinutes: 14,
    theory: {
      summary: 'Active Voice (Subject + Verb + Object) highlights WHO did it. Passive Voice (Object + Be + V3) highlights WHAT happened.',
      rules: [
        {
          rule: 'Use Passive Voice when the action or object is MORE important than the performer.',
          why: 'Shifts sentence focus to the receiver of the action.',
          example: 'The vaccine was discovered in 1928. (Focus is on vaccine, not the specific lab team)',
          wrongExample: 'A lab team discovered the vaccine in 1928 when we care about the vaccine.'
        },
        {
          rule: 'Use Passive Voice for diplomatic or polite communication when assigning blame is harsh.',
          why: 'Omits the subject agent to keep focus objective and professional.',
          example: 'A mistake was made on the invoice. (Polite & professional) vs "You made a mistake!" (Accusatory)',
          wrongExample: 'You messed up the invoice.'
        }
      ],
      wordExplanations: [
        { word: 'was built', role: 'Passive Voice Past Simple (Be + V3)', whyUsed: 'Directs full attention to the landmark building rather than unknown ancient workers.' }
      ],
      proTip: 'In corporate reports and research papers, passive voice provides objective, unbiased tone!'
    },
    quiz: [
      {
        id: 'd75-q1',
        question: 'Which sentence is the most diplomatic and professional corporate response?',
        options: [
          'An error was identified in the financial report and has been corrected.',
          'John made a stupid error in the financial report.',
          'We error the financial report yesterday.',
          'Financial report errs.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Passive voice ("was identified", "has been corrected") politely addresses the issue without personal finger-pointing.',
        grammaticalRole: 'Passive Voice for Diplomatic Professional Tone'
      }
    ],
    miniGame: {
      type: 'word_match',
      title: 'Active to Passive Transformer',
      instructions: 'Match active sentences to their professional passive equivalents!',
      wordPairs: [
        { id: 'pv1', word: 'Active: "The team completed the project."', definitionOrSynonym: 'Passive: "The project was completed by the team."', whyItMatters: 'Shifts emphasis onto "The project".' },
        { id: 'pv2', word: 'Active: "Someone stole my bike."', definitionOrSynonym: 'Passive: "My bike was stolen."', whyItMatters: 'Agent is unknown, so "was stolen" is cleaner.' }
      ]
    }
  },

  // --- DAY 4: QUESTION FORMATION & INDIRECT QUESTIONS ---
  {
    id: 'day-4',
    dayNumber: 4,
    monthNumber: 1,
    title: 'Question Formation & Polite Indirect Questions',
    category: 'conversation',
    level: 'beginner',
    description: 'Learn direct auxiliary inversion (Do/Does/Is) and polite indirect questions ("Could you tell me where...") for natural English conversation.',
    xpReward: 60,
    estimatedMinutes: 9,
    theory: {
      summary: 'Direct questions invert auxiliary verbs with subjects (Is she / Does he). Polite indirect questions embed a question inside a statement, restoring normal Subject-Verb order!',
      rules: [
        {
          rule: 'Direct Questions invert subject and auxiliary verb (e.g. "Where is the station?").',
          why: 'The auxiliary verb moves ahead of the subject to signal an active inquiry to the listener.',
          example: 'Where does she live? / Are you ready?',
          wrongExample: 'Where she lives? / You are ready?'
        },
        {
          rule: 'Indirect Questions maintain standard Subject + Verb order after introductory polite phrases.',
          why: 'Phrases like "Could you tell me..." already carry the question marker, so the inner clause functions as a noun statement.',
          example: 'Could you tell me where the station is? (NOT "where is the station")',
          wrongExample: 'Could you tell me where is the station?'
        },
        {
          rule: 'Use "if" or "whether" for Indirect Yes/No questions.',
          why: 'Functions as a conditional connector when no question word (where/what/why) exists.',
          example: 'Do you know if the store is open?',
          wrongExample: 'Do you know is the store open?'
        }
      ],
      wordExplanations: [
        { word: 'Could you tell me', role: 'Polite Introductory Question Frame', whyUsed: 'Softens the inquiry for professional and everyday polite social interaction.' },
        { word: 'where the bank is', role: 'Embedded Indirect Noun Clause', whyUsed: 'Follows normal Subject ("the bank") + Verb ("is") order without double inversion.' }
      ],
      proTip: 'In workplace emails and speaking with strangers, indirect questions ("I was wondering if...") sound significantly more courteous!'
    },
    quiz: [
      {
        id: 'd4-q1',
        question: 'Select the polite, grammatically accurate indirect question:',
        options: [
          'Could you tell me where the train station is?',
          'Could you tell me where is the train station?',
          'Could you tell me where does the train station be?',
          'Where the train station is could you tell me?'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'In indirect questions starting with "Could you tell me...", the embedded clause restores normal Subject + Verb order ("the train station is").',
        grammaticalRole: 'Embedded Indirect Question Word Order'
      },
      {
        id: 'd4-q2',
        question: 'How do you turn "Does he speak Spanish?" into a polite indirect question?',
        options: [
          'Do you know if he speaks Spanish?',
          'Do you know does he speak Spanish?',
          'Do you know speaks he Spanish?',
          'Do you know he speaks Spanish?'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Yes/No questions convert to indirect questions using "if" or "whether" followed by standard subject-verb agreement ("he speaks").',
        grammaticalRole: 'Indirect Question with Conditional "If"'
      }
    ],
    miniGame: {
      type: 'sentence_builder',
      title: 'Polite Question Re-orderer',
      instructions: 'Arrange the words to form a polite indirect question!',
      sentenceBuilder: [
        {
          targetSentence: 'Could you tell me what time the meeting starts?',
          wordPool: ['Could', 'you', 'tell', 'me', 'what', 'time', 'the', 'meeting', 'starts?'],
          grammarBreakdown: 'Indirect question phrase + Subject ("the meeting") + Verb ("starts").'
        }
      ]
    }
  },

  // --- DAY 12: COUNTABLE VS UNCOUNTABLE NOUNS & QUANTIFIERS ---
  {
    id: 'day-12',
    dayNumber: 12,
    monthNumber: 1,
    title: 'Quantifiers: Many vs Much, Few vs A Few, Some vs Any',
    category: 'grammar',
    level: 'intermediate',
    description: 'Master countable vs uncountable nouns and choose the exact right quantifier for speaking with confidence.',
    xpReward: 65,
    estimatedMinutes: 10,
    theory: {
      summary: 'Countable items take "many/few" and plural forms. Uncountable concepts (water, advice, information) take "much/little" and singular verbs!',
      rules: [
        {
          rule: 'Use "Many" with Countable Plurals and "Much" with Uncountable Nouns.',
          why: 'Countables can be separated into units (books, apples); uncountables are measured as continuous mass (time, money, advice).',
          example: 'I have many ideas. / We don\'t have much time.',
          wrongExample: 'I have much ideas. / We don\'t have many time.'
        },
        {
          rule: '"A few" and "A little" mean SOME (positive tone). "Few" and "Little" mean HARDLY ANY (negative tone).',
          why: 'The article "a" adds a positive connotation of presence, whereas omitting "a" emphasizes scarcity.',
          example: 'I have a few friends here (Good, I\'m happy!) vs I have few friends here (Sad, I\'m lonely).',
          wrongExample: 'I have a few money.'
        },
        {
          rule: 'Words like "advice", "information", "furniture", "equipment" are ALWAYS uncountable in English.',
          why: 'English conceptualizes them as abstract aggregates; to count them, use "a piece of advice/information".',
          example: 'He gave me two pieces of useful advice.',
          wrongExample: 'He gave me two useful advices.'
        }
      ],
      wordExplanations: [
        { word: 'a piece of advice', role: 'Partitive Measure Noun + Uncountable Noun', whyUsed: '"Advice" cannot be pluralized with "-s", so "a piece of" creates a countable unit.' },
        { word: 'a few options', role: 'Quantifier + Plural Countable Noun', whyUsed: '"A few" indicates a positive small quantity of countable options.' }
      ],
      proTip: 'Never add "-s" to "information", "advices", or "equipments"! They stay singular in form.'
    },
    quiz: [
      {
        id: 'd12-q1',
        question: 'Select the correct sentence regarding workplace updates:',
        options: [
          'She provided me with a lot of valuable information.',
          'She provided me with many valuable informations.',
          'She provided me with a valuable informations.',
          'She provided me with few valuable information.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '"Information" is uncountable and cannot end in "-s". "A lot of" works smoothly with both countable and uncountable nouns.',
        grammaticalRole: 'Uncountable Noun Quantifier Alignment'
      }
    ],
    miniGame: {
      type: 'word_match',
      title: 'Quantifier & Noun Pairings',
      instructions: 'Match each quantifier with its accurate noun category!',
      wordPairs: [
        { id: 'q1', word: 'Many / A few', definitionOrSynonym: 'Countable Plural Nouns (books, days, ideas)', whyItMatters: 'Used only for distinct unit items.' },
        { id: 'q2', word: 'Much / A little', definitionOrSynonym: 'Uncountable Nouns (water, money, patience)', whyItMatters: 'Used for continuous non-unit items.' }
      ]
    }
  },

  // --- DAY 25: GERUNDS VS INFINITIVES ---
  {
    id: 'day-25',
    dayNumber: 25,
    monthNumber: 1,
    title: 'Gerunds vs Infinitives: "Doing" vs "To Do"',
    category: 'grammar',
    level: 'intermediate',
    description: 'Understand when verbs are followed by -ing (gerund) or "to + verb" (infinitive) and master subtle meaning shifts.',
    xpReward: 70,
    estimatedMinutes: 11,
    theory: {
      summary: 'Some verbs require gerunds (enjoy, finish, consider, avoid), while others require infinitives (decide, hope, plan, refuse). Prepositions ALWAYS take gerunds!',
      rules: [
        {
          rule: 'Verbs of enjoyment or avoidance take Gerunds (-ing): enjoy, avoid, suggest, practice, finish.',
          why: 'Gerunds act as verbal nouns, representing the activity as a whole concept.',
          example: 'I enjoy swimming in the morning. / She suggested trying a new approach.',
          wrongExample: 'I enjoy to swim. / She suggested to try.'
        },
        {
          rule: 'Verbs of future intention take Infinitives (to + verb): decide, hope, promise, plan, refuse.',
          why: 'The particle "to" acts as a directional pointer toward a future objective or decision.',
          example: 'We decided to launch the project. / I hope to see you soon.',
          wrongExample: 'We decided launching the project.'
        },
        {
          rule: 'ALL prepositions (about, of, in, for, without) MUST be followed by a Gerund (-ing).',
          why: 'Prepositions connect to noun phrases, and gerunds are the noun form of verbs.',
          example: 'Thank you for helping me. / She is interested in learning English.',
          wrongExample: 'Thank you for to help me.'
        }
      ],
      wordExplanations: [
        { word: 'interested in learning', role: 'Preposition + Gerund Verbal Noun', whyUsed: 'The preposition "in" requires the gerund form "learning".' },
        { word: 'decided to go', role: 'Verb of Intention + Full Infinitive', whyUsed: '"Decided" looks forward to a future choice, requiring "to go".' }
      ],
      proTip: 'Notice the meaning shift: "I stopped smoking" (quit the habit) vs "I stopped to smoke" (paused walking in order to smoke)!'
    },
    quiz: [
      {
        id: 'd25-q1',
        question: 'Choose the sentence with correct gerund/infinitive usage:',
        options: [
          'She suggested taking a short break before starting the next module.',
          'She suggested to take a short break before starting the next module.',
          'She suggested take a short break before starting the next module.',
          'She suggested to taking a short break.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'The verb "suggest" is followed by a gerund (-ing) when directly introducing an action ("suggested taking").',
        grammaticalRole: 'Gerund Pattern after Verb "Suggest"'
      }
    ],
    miniGame: {
      type: 'sentence_builder',
      title: 'Verb Pattern Builder',
      instructions: 'Build the correct gerund/infinitive sentence structure!',
      sentenceBuilder: [
        {
          targetSentence: 'They agreed to finalize the agreement without delaying.',
          wordPool: ['They', 'agreed', 'to', 'finalize', 'the', 'agreement', 'without', 'delaying.'],
          grammarBreakdown: '"Agreed" takes infinitive ("to finalize"); "without" takes gerund ("delaying").'
        }
      ]
    }
  },

  // --- DAY 30: REPORTED SPEECH & WORKPLACE COMMUNICATION ---
  {
    id: 'day-30',
    dayNumber: 30,
    monthNumber: 1,
    title: 'Reported / Indirect Speech: Professional Reporting',
    category: 'conversation',
    level: 'intermediate',
    description: 'Learn how to accurately report what someone said, shift tenses appropriately, and communicate effectively in meetings.',
    xpReward: 75,
    estimatedMinutes: 12,
    theory: {
      summary: 'When reporting past statements, present tenses step back one frame into the past (Present Simple ➔ Past Simple, Present Perfect ➔ Past Perfect).',
      rules: [
        {
          rule: 'Backshift Tenses when reporting past statements: Present Simple ➔ Past Simple.',
          why: 'Because the original statement happened in the past, the verb tense shifts back to align with past reporting time.',
          example: 'Direct: "I work at Google." ➔ Reported: He said he worked at Google.',
          wrongExample: 'He said he works at Google (if reporting past completed fact).'
        },
        {
          rule: 'Modals shift back: "will" ➔ "would", "can" ➔ "could", "may" ➔ "might".',
          why: 'Reflects past possibility or intention relative to the reporting time.',
          example: 'Direct: "I will call you." ➔ Reported: She said she would call me.',
          wrongExample: 'She said she will call me yesterday.'
        },
        {
          rule: 'Use reporting verbs like "explained", "confirmed", "mentioned", "advised" for professional tone.',
          why: 'Replaces generic "said" with expressive business nuance.',
          example: 'The manager confirmed that the deadline had been extended.',
          wrongExample: 'The manager said us that the deadline extended.'
        }
      ],
      wordExplanations: [
        { word: 'confirmed that', role: 'Professional Reporting Verb + Conjunction', whyUsed: 'Adds precise executive clarity to reported statements.' },
        { word: 'would attend', role: 'Backshifted Modal (will ➔ would)', whyUsed: 'Shifts future modal "will" back to match past reporting verb "confirmed".' }
      ],
      proTip: 'Use "tell + person" (He told me) but "say + that" (He said that)! Never say "He said me".'
    },
    quiz: [
      {
        id: 'd30-q1',
        question: 'How do you accurately report: "I have finished the report" in a past meeting summary?',
        options: [
          'She mentioned that she had finished the report.',
          'She mentioned that she has finished the report.',
          'She mentioned that she finishes the report.',
          'She mentioned that she finish the report.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Present Perfect ("have finished") backshifts to Past Perfect ("had finished") when reported with past reporting verb "mentioned".',
        grammaticalRole: 'Backshift Tense Shift in Indirect Speech'
      }
    ],
    miniGame: {
      type: 'sentence_builder',
      title: 'Reported Speech Converter',
      instructions: 'Construct the backshifted reported speech statement!',
      sentenceBuilder: [
        {
          targetSentence: 'The client confirmed that they would review the proposal.',
          wordPool: ['The', 'client', 'confirmed', 'that', 'they', 'would', 'review', 'the', 'proposal.'],
          grammarBreakdown: 'Past reporting verb "confirmed" + backshifted modal "would review".'
        }
      ]
    }
  },

  // --- DAY 45: PAST CONTINUOUS & PAST PERFECT ---
  {
    id: 'day-45',
    dayNumber: 45,
    monthNumber: 2,
    title: 'Past Continuous & Past Perfect: Connecting Past Timelines',
    category: 'grammar',
    level: 'intermediate',
    description: 'Master interrupting past actions (Was doing when...) and prior past events (Had done before...).',
    xpReward: 80,
    estimatedMinutes: 12,
    theory: {
      summary: 'Past Continuous (was/were + -ing) describes background actions in progress. Past Perfect (had + V3) marks an event that finished BEFORE another past event happened!',
      rules: [
        {
          rule: 'Past Continuous + Past Simple: Use "was/were -ing" for an ongoing background action interrupted by "Past Simple".',
          why: 'Contrasts a continuous duration state with a sudden point event.',
          example: 'I was presenting the slide when the power went out.',
          wrongExample: 'I presented the slide when the power was going out.'
        },
        {
          rule: 'Past Perfect (had + V3) establishes the "earlier past" relative to another past moment.',
          why: 'Clarifies chronological priority so listeners know which event occurred first.',
          example: 'When I arrived at the station, the train had already left. (Train left FIRST)',
          wrongExample: 'When I arrived at the station, the train left (sounds like simultaneous).'
        }
      ],
      wordExplanations: [
        { word: 'was presenting', role: 'Past Continuous Ongoing Background Action', whyUsed: 'Shows an ongoing action in progress in the past.' },
        { word: 'had already left', role: 'Past Perfect Earlier Completed Action', whyUsed: 'Proves the train departed before the speaker arrived.' }
      ],
      proTip: 'Think of Past Perfect as the "Past of the Past"! It anchors time chronology.'
    },
    quiz: [
      {
        id: 'd45-q1',
        question: 'Select the sentence showing clear chronological order of past actions:',
        options: [
          'By the time the meeting started, she had prepared all the documents.',
          'By the time the meeting started, she prepares all the documents.',
          'By the time the meeting was starting, she prepares all documents.',
          'By the time the meeting started, she has prepared.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '"By the time..." sets a past deadline; the prior completed action requires Past Perfect ("had prepared").',
        grammaticalRole: 'Past Perfect Prior Time Sequence'
      }
    ],
    miniGame: {
      type: 'sentence_builder',
      title: 'Past Sequence Architect',
      instructions: 'Arrange the sentence to show correct past sequence!',
      sentenceBuilder: [
        {
          targetSentence: 'He was writing an email when the alarm rang.',
          wordPool: ['He', 'was', 'writing', 'an', 'email', 'when', 'the', 'alarm', 'rang.'],
          grammarBreakdown: 'Background Past Continuous interrupted by Past Simple "rang".'
        }
      ]
    }
  },

  // --- DAY 55: FUTURE EXPRESSIONS & INTENTIONS ---
  {
    id: 'day-55',
    dayNumber: 55,
    monthNumber: 2,
    title: 'Future Nuances: Will vs Going To vs Present Continuous',
    category: 'conversation',
    level: 'intermediate',
    description: 'Differentiate instant decisions ("I will"), prior intentions ("I am going to"), and scheduled arrangements ("I am meeting").',
    xpReward: 85,
    estimatedMinutes: 10,
    theory: {
      summary: 'English has no single "future tense". We select future structures based on certainty, pre-planning, and scheduling!',
      rules: [
        {
          rule: 'Use "Will" for spontaneous instant decisions, promises, or predictions without immediate physical evidence.',
          why: 'Expresses immediate willpower or mental projection made at the moment of speaking.',
          example: 'The phone is ringing — I will answer it! / I think it will rain tomorrow.',
          wrongExample: 'The phone is ringing — I am going to answer it (sounds pre-planned).'
        },
        {
          rule: 'Use "Be going to" for prior decisions, intentions, or predictions based on current visual evidence.',
          why: 'Connects current real-world intention/evidence to an upcoming result.',
          example: 'Look at those dark clouds! It is going to rain. / I am going to study abroad next year.',
          wrongExample: 'Look at dark clouds! It will rain.'
        },
        {
          rule: 'Use Present Continuous for fixed personal appointments with a specific time and place.',
          why: 'The arrangement is so finalized it behaves like a present scheduled reality.',
          example: 'I am seeing the doctor tomorrow at 3 PM.',
          wrongExample: 'I will see doctor tomorrow at 3 PM (sounds vague/unplanned).'
        }
      ],
      wordExplanations: [
        { word: 'am meeting', role: 'Present Continuous for Fixed Future Arrangement', whyUsed: 'Confirms a time and location have already been booked.' },
        { word: 'will help', role: 'Spontaneous Volitional Modal Choice', whyUsed: 'Offers help instantly at the moment of request.' }
      ],
      proTip: 'For formal schedules (flights, train timetables), use Present Simple: "The flight departs at 8:00 AM"!'
    },
    quiz: [
      {
        id: 'd55-q1',
        question: 'You notice dark heavy clouds in the sky. Which prediction is most natural?',
        options: [
          'Look at those black clouds! It is going to rain soon.',
          'Look at those black clouds! It will be rain soon.',
          'Look at those black clouds! It rains soon.',
          'Look at those black clouds! It is rain.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Predictions based on present physical evidence (black clouds) naturally use "be going to".',
        grammaticalRole: 'Future Intent based on Present Visual Evidence'
      }
    ],
    miniGame: {
      type: 'word_match',
      title: 'Future Structure Matcher',
      instructions: 'Match each future scenario with its optimal English structure!',
      wordPairs: [
        { id: 'f1', word: 'Will + Base Verb', definitionOrSynonym: 'Spontaneous offers & instant decisions ("I\'ll grab the door")', whyItMatters: 'Decided at the moment of speech.' },
        { id: 'f2', word: 'Be Going To', definitionOrSynonym: 'Prior intentions & evidence-based predictions', whyItMatters: 'Decided prior to the conversation.' },
        { id: 'f3', word: 'Present Continuous', definitionOrSynonym: 'Fixed booked appointments ("Meeting client at 2 PM")', whyItMatters: 'Confirmed in calendar.' }
      ]
    }
  },

  // --- DAY 70: ADVANCED INVERSION & EMPHATIC GRAMMAR ---
  {
    id: 'day-70',
    dayNumber: 70,
    monthNumber: 3,
    title: 'Advanced Inversion & Emphatic C1 Writing',
    category: 'pro_syntax',
    level: 'pro',
    description: 'Master negative adverbial inversion ("Not only did she...", "Rarely have I...") for high-impact executive prose.',
    xpReward: 95,
    estimatedMinutes: 14,
    theory: {
      summary: 'When a sentence opens with a restrictive or negative adverb (Rarely, Seldom, Hardly, Not only), auxiliary verb inversion is required for dramatic emphasis!',
      rules: [
        {
          rule: 'Negative Adverb Inversion: Negative Word + Auxiliary Verb + Subject + Main Verb.',
          why: 'Fronting the negative modifier creates rhetorical weight, triggering question word-order for high contrast.',
          example: 'Not only did he pass the exam, but he also scored the highest grade.',
          wrongExample: 'Not only he passed the exam, but he also scored.'
        },
        {
          rule: 'Use "Hardly / Scarcely... when" or "No sooner... than" for rapid successive actions.',
          why: 'Highlights near-instantaneous sequence of events in narrative or executive summaries.',
          example: 'Hardly had the meeting started when the CEO arrived.',
          wrongExample: 'Hardly the meeting had started when...'
        }
      ],
      wordExplanations: [
        { word: 'Not only did she', role: 'Emphatic Negative Fronting + Auxiliary Inversion', whyUsed: 'Elevates formal academic and executive prose style.' }
      ],
      proTip: 'Inversion elevates your writing from standard B2 to sophisticated C1/C2 eloquence!'
    },
    quiz: [
      {
        id: 'd70-q1',
        question: 'Select the correctly inverted C1 level sentence:',
        options: [
          'Rarely have I seen such dedication to excellence.',
          'Rarely I have seen such dedication to excellence.',
          'Rarely I saw such dedication to excellence.',
          'Rarely saw I such dedication.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Starting with restrictive adverb "Rarely" triggers auxiliary verb inversion ("have I seen").',
        grammaticalRole: 'Negative Adverbial Fronting Inversion'
      }
    ],
    miniGame: {
      type: 'sentence_builder',
      title: 'Emphatic Inversion Architect',
      instructions: 'Construct the inverted high-impact sentence!',
      sentenceBuilder: [
        {
          targetSentence: 'Never had we witnessed such incredible innovation.',
          wordPool: ['Never', 'had', 'we', 'witnessed', 'such', 'incredible', 'innovation.'],
          grammarBreakdown: 'Negative adverb "Never" + auxiliary "had" + subject "we".'
        }
      ]
    }
  },

  // --- DAY 80: SPOKEN ENGLISH CONNECTED SPEECH & INTONATION ---
  {
    id: 'day-80',
    dayNumber: 80,
    monthNumber: 3,
    title: 'Connected Speech, Reductions & Native Rhythm',
    category: 'conversation',
    level: 'pro',
    description: 'Understand how native speakers link words, use weak forms ("gonna", "wanna", "coulda"), and master sentence stress.',
    xpReward: 95,
    estimatedMinutes: 13,
    theory: {
      summary: 'English is a stress-timed language. Content words (nouns, main verbs) are stressed, while function words (prepositions, pronouns) shrink into weak neutral vowel sounds (/ə/ schwa)!',
      rules: [
        {
          rule: 'Consonant-to-Vowel Linking: End consonant merges smoothly into starting vowel of next word.',
          why: 'Prevents abrupt stops and allows effortless vocal resonance during fast spoken English.',
          example: 'An apple ➔ "A-napple" / Check it out ➔ "Che-ki-tout".',
          wrongExample: 'Pronouncing "Check - it - out" with robotic pauses between each word.'
        },
        {
          rule: 'Weak Forms & Reductions: Function words shorten in relaxed native speech.',
          why: 'Allows speakers to glide quickly between heavily stressed content keywords.',
          example: 'Going to ➔ "Gonna" / Want to ➔ "Wanna" / Could have ➔ "Coulda".',
          wrongExample: 'Stressing every single function word equally.'
        },
        {
          rule: 'Intonation & Pitch: Rising pitch signals open questions / politeness; falling pitch signals confidence / statements.',
          why: 'Pitch contours communicate emotion, authority, and diplomatic courtesy.',
          example: 'Would you like some coffee? (Rising pitch at end signals friendly warmth).',
          wrongExample: 'Flat robotic monotone pitch.'
        }
      ],
      wordExplanations: [
        { word: 'check it out', role: 'C-to-V Linked Phonetic Chain', whyUsed: 'Glides phonetically as /tʃek.ɪ.taʊt/ without pauses.' },
        { word: 'gonna', role: 'Colloquial Spoken Phonetic Reduction', whyUsed: 'Natural spoken shorthand for "going to" in fluid conversation.' }
      ],
      proTip: 'Listening to native rhythm isn\'t about speaking fast — it\'s about giving extra time to STRESSED words!'
    },
    quiz: [
      {
        id: 'd80-q1',
        question: 'Why do native speakers say "an-apple" as if it were one word ("a-napple")?',
        options: [
          'Because of consonant-to-vowel linking, which creates smooth vocal flow in connected speech.',
          'Because "an" is a verb.',
          'Because apple is spelled with two P\'s.',
          'It is a grammar error made by native speakers.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: 'Consonant-to-vowel linking bridges the final consonant of "an" to the opening vowel of "apple" for seamless pronunciation.',
        grammaticalRole: 'Phonetic Liaison in Connected Speech'
      }
    ],
    miniGame: {
      type: 'word_match',
      title: 'Connected Speech Decoder',
      instructions: 'Match formal written forms to their natural spoken reductions!',
      wordPairs: [
        { id: 'cs1', word: 'Going to / Want to', definitionOrSynonym: 'Spoken Reductions: "Gonna" / "Wanna"', whyItMatters: 'Used in natural conversational flow.' },
        { id: 'cs2', word: 'Should have / Could have', definitionOrSynonym: 'Spoken Reductions: "Shoulda" / "Coulda"', whyItMatters: 'Weakens auxiliary "have" to a neutral schwa.' }
      ]
    }
  },

  // --- DAY 90: EXECUTIVE FLUENCY & DIPLOMATIC HEDGING ---
  {
    id: 'day-90',
    dayNumber: 90,
    monthNumber: 3,
    title: 'Executive Fluency: Diplomatic Hedging & Native Nuance',
    category: 'pro_syntax',
    level: 'pro',
    description: 'Master professional discourse markers, polite hedging phrases ("It would appear that..."), and executive leadership communication.',
    xpReward: 120,
    estimatedMinutes: 15,
    theory: {
      summary: 'Executive English fluency requires hedging — using strategic modal verbs and softeners to present arguments persuasively without sounding confrontational or rigid.',
      rules: [
        {
          rule: 'Use Hedging Softeners to sound polite, professional, and objective in executive discussions.',
          why: 'Absolute claims ("This strategy is wrong") sound aggressive; hedged claims ("It seems this strategy may present risks") invite collaborative discussion.',
          example: 'It appears that we might need to adjust the timeline.',
          wrongExample: 'You messed up the timeline.'
        },
        {
          rule: 'Use Sophisticated Discourse Markers to guide listener attention: "Furthermore", "Having said that", "Consequently".',
          why: 'Establishes clear logical relationships between complex business arguments.',
          example: 'The data is promising. Having said that, we must proceed with caution.',
          wrongExample: 'The data is good. But but we must be careful.'
        }
      ],
      wordExplanations: [
        { word: 'It appears that', role: 'Executive Hedging Frame', whyUsed: 'Presents observations objectively without personal bias.' },
        { word: 'Having said that', role: 'Concessive Discourse Transition', whyUsed: 'Balances an optimistic point with necessary pragmatic caution.' }
      ],
      proTip: 'In executive meetings, phrasing recommendations with "I would suggest exploring..." achieves immediate buy-in!'
    },
    quiz: [
      {
        id: 'd90-q1',
        question: 'Which option represents the most sophisticated and persuasive executive recommendation?',
        options: [
          'It would seem advisable to reallocate a portion of the budget toward strategic marketing.',
          'We must give all money to marketing right now.',
          'Marketing is better so do it.',
          'You should give budget to marketing.'
        ],
        correctAnswerIndex: 0,
        explanationWhy: '"It would seem advisable to..." uses diplomatic hedging to present a well-reasoned, professional recommendation.',
        grammaticalRole: 'Executive Hedging & Persuasive Nuance'
      }
    ],
    miniGame: {
      type: 'sentence_builder',
      title: 'Executive Fluency Architect',
      instructions: 'Construct the sophisticated executive proposal!',
      sentenceBuilder: [
        {
          targetSentence: 'I would suggest that we thoroughly evaluate all potential risks.',
          wordPool: ['I', 'would', 'suggest', 'that', 'we', 'thoroughly', 'evaluate', 'all', 'potential', 'risks.'],
          grammarBreakdown: 'Diplomatic hedging frame "I would suggest that..." + subjunctive evaluation clause.'
        }
      ]
    }
  }
];

