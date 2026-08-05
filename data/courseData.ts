import { DayLesson, MonthExam } from '../types';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement?: string;
  unlockedAt?: string;
  category?: 'streak' | 'accuracy' | 'completion' | 'mastery';
}

export const BADGES_LIST: Badge[] = [
  {
    "id": "first_step",
    "name": "First Step",
    "description": "Completed your very first English lesson!",
    "icon": "🌟",
    "requirement": "Complete Day 1"
  },
  {
    "id": "streak_3",
    "name": "On Fire!",
    "description": "Maintained a 3-day learning streak.",
    "icon": "🔥",
    "requirement": "3 Day Streak"
  },
  {
    "id": "grammar_detective",
    "name": "Grammar Detective",
    "description": "Scored 100% on 5 grammar quizzes.",
    "icon": "🔍",
    "requirement": "5 Perfect Quizzes"
  },
  {
    "id": "vocab_titan",
    "name": "Word Titan",
    "description": "Mastered 50 new vocabulary collocations.",
    "icon": "📚",
    "requirement": "Master 50 Words"
  },
  {
    "id": "month_1_master",
    "name": "Foundation Legend",
    "description": "Passed the Month 1 Comprehensive Mastery Exam!",
    "icon": "🏆",
    "requirement": "Pass Month 1 Exam"
  },
  {
    "id": "month_2_master",
    "name": "Intermediate Scholar",
    "description": "Passed the Month 2 Conversational Mastery Exam!",
    "icon": "🚀",
    "requirement": "Pass Month 2 Exam"
  },
  {
    "id": "month_3_master",
    "name": "Grand Master Linguist",
    "description": "Passed the Month 3 Advanced Subjunctive & Nuance Exam!",
    "icon": "🎓",
    "requirement": "Pass Month 3 Exam"
  },
  {
    "id": "pro_linguist",
    "name": "Pro Linguist",
    "description": "Mastered Advanced Subjunctive & Passive Voice.",
    "icon": "👑",
    "requirement": "Complete Pro Track"
  }
];

export const MONTH_EXAMS: MonthExam[] = [
  {
    "monthNumber": 1,
    "title": "Month 1 Comprehensive Foundation Exam",
    "subtitle": "Nouns, Articles, Basic Tenses, Subject-Verb Agreement & Prepositions",
    "description": "Test your mastery of Month 1 foundational concepts. Score 70%+ to earn your Month 1 Graduate Certificate & Badge!",
    "passingScorePercent": 70,
    "xpReward": 250,
    "gemReward": 50,
    "badgeId": "month_1_master",
    "questions": [
      {
        "id": "m1-q1",
        "topicTag": "Articles & Phonetics",
        "question": "Which sentence correctly uses indefinite articles based on spoken English phonetics?",
        "options": [
          "She met a European investor for an hour.",
          "She met an European investor for a hour.",
          "She met European investor for an hour.",
          "She met a European investor for a hour."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "\"European\" starts with a consonant \"Yoo\" sound (/jʊər/), requiring \"a\". \"Hour\" starts with a silent \"H\" vowel sound (/aʊər/), requiring \"an\"."
      },
      {
        "id": "m1-q2",
        "topicTag": "Subject-Verb Agreement",
        "question": "Select the sentence with accurate subject-verb agreement:",
        "options": [
          "Neither the manager nor the employees were informed about the change.",
          "Neither the manager nor the employees was informed about the change.",
          "Neither the manager or the employees is informed about the change.",
          "Neither the manager nor employees has been informed."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "In 'neither... nor' structures, the verb agrees with the closer subject ('employees', which is plural)."
      },
      {
        "id": "m1-q3",
        "topicTag": "Countable vs Uncountable",
        "question": "Which choice correctly quantifies an uncountable noun?",
        "options": [
          "He gave me three valuable pieces of advice.",
          "He gave me three valuable advices.",
          "He gave me three advice items.",
          "He gave me three valuable piece of advices."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "'Advice' is uncountable in English. To make it countable, use 'pieces of advice'."
      },
      {
        "id": "m1-q4",
        "topicTag": "Prepositions of Time",
        "question": "Choose the correct preposition combo: 'The meeting is ___ Monday ___ 9:00 AM ___ the morning.'",
        "options": [
          "on / at / in",
          "in / at / on",
          "at / on / in",
          "on / in / at"
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "Days take 'on' (on Monday), specific times take 'at' (at 9:00 AM), and periods of the day take 'in' (in the morning)."
      },
      {
        "id": "m1-q5",
        "topicTag": "Present Tenses",
        "question": "Why do we say 'Water boils at 100°C' using Present Simple instead of Present Continuous?",
        "options": [
          "Because it is a permanent universal scientific fact, not a temporary ongoing event.",
          "Because 'boils' sounds shorter.",
          "Because Present Continuous cannot be used with liquids.",
          "There is no grammatical difference."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "Present Simple expresses timeless truths, scientific facts, and permanent generalities."
      }
    ]
  },
  {
    "monthNumber": 2,
    "title": "Month 2 Conversational & Narrative Mastery Exam",
    "subtitle": "Past Tenses, Future Forms, Modals, Passive Voice & Relative Clauses",
    "description": "Evaluate your intermediate English prowess. Score 70%+ to unlock Month 2 Certification!",
    "passingScorePercent": 70,
    "xpReward": 350,
    "gemReward": 75,
    "badgeId": "month_2_master",
    "questions": [
      {
        "id": "m2-q1",
        "topicTag": "Past Tense Contrast",
        "question": "Which sentence correctly relates two past events where one happened before the other?",
        "options": [
          "When we arrived at the cinema, the movie had already started.",
          "When we arrived at the cinema, the movie already started.",
          "When we had arrived at the cinema, the movie started.",
          "When we arrive at the cinema, the movie had started."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The Past Perfect ('had already started') denotes the earlier past event before another past event ('we arrived')."
      },
      {
        "id": "m2-q2",
        "topicTag": "Future Expressions",
        "question": "What is the key nuance difference between 'I will call you' and 'I am going to call you'?",
        "options": [
          "'Will' represents a spontaneous decision made right now, while 'going to' represents a pre-planned intention.",
          "'Will' is for the past, 'going to' is for the future.",
          "'Going to' is strictly formal writing, 'will' is slang.",
          "They are completely identical in every pragmatic context."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "'Will' signals an instant/spontaneous decision, whereas 'be going to' indicates a prior decision or plan."
      },
      {
        "id": "m2-q3",
        "topicTag": "Past Modals of Deduction",
        "question": "Which modal expresses a strong logical deduction about a past event?",
        "options": [
          "She must have missed her train because her car broke down.",
          "She should have missed her train.",
          "She can miss her train yesterday.",
          "She ought to miss her train."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "'Must have + past participle' expresses near-certain deduction about a past situation based on evidence."
      },
      {
        "id": "m2-q4",
        "topicTag": "Passive Voice Nuance",
        "question": "Why use 'The new policy was approved yesterday' in business reports?",
        "options": [
          "To emphasize the outcome/action rather than focusing on who performed the approval.",
          "Because active voice is illegal in business writing.",
          "Because the subject is secret.",
          "To make the sentence longer."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "Passive voice shifts focus to the action or patient when the actor is obvious, unimportant, or secondary."
      },
      {
        "id": "m2-q5",
        "topicTag": "Relative Clauses",
        "question": "Which clause requires commas around it?",
        "options": [
          "My brother, who lives in Tokyo, is a software engineer.",
          "The car that I bought last week broke down.",
          "Students who study hard pass their exams.",
          "The house which has a red door is mine."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "Non-defining relative clauses provide extra non-essential information and must be set off with commas."
      }
    ]
  },
  {
    "monthNumber": 3,
    "title": "Month 3 C1/C2 Advanced Subjunctive, Inversion & Nuance Exam",
    "subtitle": "Hypotheticals, Inversion, Subjunctive Mood, Diplomatic Hedging & Connected Speech",
    "description": "The ultimate C1/C2 C-Suite Executive Masterclass Exam. Test your fluency, nuance, and rhetoric!",
    "passingScorePercent": 75,
    "xpReward": 500,
    "gemReward": 100,
    "badgeId": "month_3_master",
    "questions": [
      {
        "id": "m3-q1",
        "topicTag": "Inversion",
        "question": "Choose the correct inverted sentence after a negative adverbial:",
        "options": [
          "Seldom have I witnessed such exceptional leadership.",
          "Seldom I have witnessed such exceptional leadership.",
          "Seldom witness I such exceptional leadership.",
          "Seldom have witnessed I such exceptional leadership."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "When a negative adverb ('Seldom') opens a sentence for emphasis, auxiliary verb precedes the subject ('have I witnessed')."
      },
      {
        "id": "m3-q2",
        "topicTag": "Subjunctive Mood",
        "question": "Which sentence accurately uses the bare subjunctive mood for formal proposals?",
        "options": [
          "The board insisted that the project be launched immediately.",
          "The board insisted that the project is launched immediately.",
          "The board insisted that the project was launched immediately.",
          "The board insisted that the project should to be launched."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "In formal mandative clauses following 'insist that', English requires the base form ('be'), regardless of subject or tense."
      },
      {
        "id": "m3-q3",
        "topicTag": "Mixed Conditionals",
        "question": "Select the sentence connecting a past unreal action with a present unreal result:",
        "options": [
          "If I had taken that job in London, I would be living there today.",
          "If I took that job in London, I will be living there today.",
          "If I had taken that job in London, I had lived there today.",
          "If I have taken that job in London, I would live there today."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "'If + past perfect' (past condition) + 'would + base verb' (present outcome) forms a mixed conditional."
      },
      {
        "id": "m3-q4",
        "topicTag": "Diplomatic Hedging",
        "question": "How do executive communicators soften direct criticism politely?",
        "options": [
          "It would appear that there might be a slight discrepancy in these budget calculations.",
          "Your budget calculations are completely wrong.",
          "You made a mistake in the calculations.",
          "Fix this budget error now."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "Modal verbs ('would', 'might') and soft qualifiers ('appear', 'slight discrepancy') reduce hostility in professional dialogue."
      },
      {
        "id": "m3-q5",
        "topicTag": "Connected Speech & Assimilation",
        "question": "In fast native speech, why does 'ten boys' sound like 'tem boys'?",
        "options": [
          "Because the alveolar /n/ assimilates to the bilabial /m/ under the influence of the upcoming bilabial /b/.",
          "Because speaker forgot how to pronounce ten.",
          "Because 'tem' is the plural form of ten.",
          "It is a grammar mistake made by non-natives."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "Regressive place assimilation allows native speakers to preserve fluid articulatory efficiency in rapid speech."
      }
    ]
  }
];

export const DAYS_CURRICULUM: DayLesson[] = [
  {
    "id": "day-1",
    "dayNumber": 1,
    "monthNumber": 1,
    "title": "Nouns & Articles: The Magic of \"A\", \"An\", and \"The\"",
    "category": "grammar",
    "level": "beginner",
    "description": "Master indefinite and definite articles based on phonetic sound rules and specific context.",
    "xpReward": 55,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Articles function as noun markers. \"A\" and \"an\" introduce non-specific singular countable items, while \"the\" points to a specific item known to both speaker and listener.",
      "rules": [
        {
          "rule": "Use \"a\" before consonant SOUNDS, and \"an\" before vowel SOUNDS (regardless of spelling).",
          "why": "English phonetics avoids glottal stops between adjacent vowel sounds to preserve vocal flow.",
          "example": "A university (/j/), An hour (/aʊ/), A cat, An apple.",
          "wrongExample": "An university, A hour."
        },
        {
          "rule": "Use \"the\" when both speaker and listener know exactly which specific object is being referred to.",
          "why": "\"The\" signals uniquely identified or previously mentioned context.",
          "example": "Pass me the salt on the table. (The specific salt on that table).",
          "wrongExample": "Pass me a salt on a table."
        }
      ],
      "wordExplanations": [
        {
          "word": "a European",
          "role": "Indefinite Article + Consonant Sound",
          "whyUsed": "Starts with /j/ consonant sound."
        },
        {
          "word": "an umbrella",
          "role": "Indefinite Article + Vowel Sound",
          "whyUsed": "Starts with /ʌ/ vowel sound."
        }
      ],
      "proTip": "Focus on spoken sound, not written letters! \"An hour\" uses \"an\" because the \"h\" is silent."
    },
    "quiz": [
      {
        "id": "d1-q1",
        "question": "Which sentence uses articles correctly?",
        "options": [
          "It took an hour to reach a university.",
          "It took a hour to reach an university.",
          "It took an hour to reach an university.",
          "It took a hour to reach a university."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "\"Hour\" starts with a vowel sound /aʊər/, so it takes \"an\". \"University\" starts with a consonant sound /jʊ/ so it takes \"a\".",
        "grammaticalRole": "Phonetic Article Agreement"
      },
      {
        "id": "d1-q2",
        "question": "Why do we say \"the Sun\" instead of \"a Sun\"?",
        "options": [
          "Because there is only one unique Sun in our context.",
          "Because Sun starts with a capital letter.",
          "Because Sun is an uncountable liquid.",
          "Because \"a\" is forbidden with nature."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "\"The\" is used for unique natural entities known to all listeners.",
        "grammaticalRole": "Definite Article for Unique Entities"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Article Architect",
      "instructions": "Assemble the blocks in correct order!",
      "sentenceBuilder": [
        {
          "targetSentence": "She brought an apple and a sandwich for lunch.",
          "wordPool": [
            "She",
            "brought",
            "an",
            "apple",
            "and",
            "a",
            "sandwich",
            "for",
            "lunch."
          ],
          "grammarBreakdown": "\"An\" is used before vowel sound \"apple\", \"a\" before consonant sound \"sandwich\"."
        }
      ]
    }
  },
  {
    "id": "day-2",
    "dayNumber": 2,
    "monthNumber": 1,
    "title": "Subject-Verb Agreement: Matching Singulars & Plurals",
    "category": "grammar",
    "level": "beginner",
    "description": "Learn why singular subjects take singular verbs with -s, while plural subjects do not.",
    "xpReward": 60,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "A verb must always match its subject in number. Singular subjects take third-person singular verbs (ends in -s in present tense), whereas plural subjects take base verb forms.",
      "rules": [
        {
          "rule": "He / She / It / Singular Noun takes verb + s/es in Present Simple.",
          "why": "English inflectional morphology marks third-person singular subjects explicitly.",
          "example": "The dog barks loudly every morning.",
          "wrongExample": "The dog bark loudly every morning."
        },
        {
          "rule": "Phrases between subject and verb (e.g. \"along with\", \"as well as\") do not change the subject number.",
          "why": "The head noun determines subject number, not prepositions or modifiers.",
          "example": "The manager, along with her assistants, is attending.",
          "wrongExample": "The manager, along with her assistants, are attending."
        }
      ],
      "wordExplanations": [
        {
          "word": "The dog barks",
          "role": "Singular Subject + Singular Verb",
          "whyUsed": "Singular noun requires -s verb suffix."
        },
        {
          "word": "They bark",
          "role": "Plural Subject + Plural Verb",
          "whyUsed": "Plural subject requires base verb form."
        }
      ],
      "proTip": "Ignore words in prepositional phrases between the subject and the verb to find the true subject!"
    },
    "quiz": [
      {
        "id": "d2-q1",
        "question": "Select the correct sentence:",
        "options": [
          "A box of fresh apples sits on the counter.",
          "A box of fresh apples sit on the counter.",
          "A box of fresh apples sitting on the counter.",
          "A box of fresh apples are sitting on the counter."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The subject is \"a box\" (singular), not \"apples\". Singular subject requires singular verb \"sits\".",
        "grammaticalRole": "Head Noun Subject-Verb Agreement"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Agreement Builder",
      "instructions": "Match the subject and verb correctly!",
      "sentenceBuilder": [
        {
          "targetSentence": "The captain of the team speaks clearly.",
          "wordPool": [
            "The",
            "captain",
            "of",
            "the",
            "team",
            "speaks",
            "clearly."
          ],
          "grammarBreakdown": "Head noun \"captain\" is singular, so it takes \"speaks\"."
        }
      ]
    }
  },
  {
    "id": "day-3",
    "dayNumber": 3,
    "monthNumber": 1,
    "title": "Present Simple vs. Present Continuous: State vs. Action",
    "category": "tenses",
    "level": "beginner",
    "description": "Understand when to use permanent simple present facts vs temporary continuous actions.",
    "xpReward": 65,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Present Simple describes general truths, habits, and permanent states. Present Continuous (is/am/are + verb-ing) describes temporary actions happening right now.",
      "rules": [
        {
          "rule": "Use Present Simple for daily habits and universal facts.",
          "why": "Simple tense views the action as a complete, permanent fact or routine.",
          "example": "She works in London. / Water boils at 100°C.",
          "wrongExample": "She is working in London permanently."
        },
        {
          "rule": "Use Present Continuous for temporary actions in progress right now.",
          "why": "Continuous aspect views the action as an ongoing, incomplete process.",
          "example": "She is working on a special project this week.",
          "wrongExample": "She works on a special project right now."
        }
      ],
      "wordExplanations": [
        {
          "word": "works",
          "role": "Present Simple",
          "whyUsed": "Permanent employment fact."
        },
        {
          "word": "is working",
          "role": "Present Continuous",
          "whyUsed": "Temporary current activity."
        }
      ],
      "proTip": "Stative verbs like \"know\", \"love\", \"understand\" are rarely used in continuous tenses!"
    },
    "quiz": [
      {
        "id": "d3-q1",
        "question": "Why do we say \"I understand\" instead of \"I am understanding\"?",
        "options": [
          "Because \"understand\" is a stative verb representing a state of mind, not a physical process.",
          "Because \"understand\" is too long for -ing.",
          "Because continuous verbs require two objects.",
          "There is no reason."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "Stative verbs express mental states and do not take continuous aspect.",
        "grammaticalRole": "Stative Verb Rule"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Tense Architect",
      "instructions": "Build the sentence correctly!",
      "sentenceBuilder": [
        {
          "targetSentence": "He usually drinks tea but today he is drinking coffee.",
          "wordPool": [
            "He",
            "usually",
            "drinks",
            "tea",
            "but",
            "today",
            "he",
            "is",
            "drinking",
            "coffee."
          ],
          "grammarBreakdown": "\"Drinks\" for usual habit; \"is drinking\" for today's exception."
        }
      ]
    }
  },
  {
    "id": "day-4",
    "dayNumber": 4,
    "monthNumber": 1,
    "title": "Question Formation & Polite Indirect Questions",
    "category": "grammar",
    "level": "beginner",
    "description": "Learn inverted direct questions (Auxiliary + Subject + Verb) and polite indirect questions.",
    "xpReward": 70,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Direct questions invert auxiliary verbs with subjects (Where do you live?). Indirect questions embed questions inside polite phrases and preserve normal statement word order (Could you tell me where you live?).",
      "rules": [
        {
          "rule": "Direct questions follow ASI / QUASI: (Question Word) + Auxiliary + Subject + Main Verb.",
          "why": "Auxiliary inversion signals an interrogative sentence in English.",
          "example": "Where do you work? / Can she help us?",
          "wrongExample": "Where you work? / Can help she us?"
        },
        {
          "rule": "Indirect questions after \"Could you tell me...\" use standard statement order: Subject + Verb.",
          "why": "The main clause is already polite; embedding the question removes double inversion.",
          "example": "Could you tell me where the station is?",
          "wrongExample": "Could you tell me where is the station?"
        }
      ],
      "wordExplanations": [
        {
          "word": "Where do you",
          "role": "Auxiliary Inversion",
          "whyUsed": "Direct question format."
        },
        {
          "word": "where the station is",
          "role": "Embedded Statement Order",
          "whyUsed": "Indirect question format."
        }
      ],
      "proTip": "In polite indirect questions, DO NOT use \"do/does/did\" auxiliary verbs!"
    },
    "quiz": [
      {
        "id": "d4-q1",
        "question": "Which sentence is polite and grammatically correct for professional inquiries?",
        "options": [
          "Could you tell me what time the meeting starts?",
          "Could you tell me what time does the meeting start?",
          "Could you tell me what time starts the meeting?",
          "What time starts the meeting?"
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "Indirect questions require statement order (subject \"the meeting\" + verb \"starts\") without auxiliary \"does\".",
        "grammaticalRole": "Indirect Question Word Order"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Indirect Question Builder",
      "instructions": "Construct a polite indirect question!",
      "sentenceBuilder": [
        {
          "targetSentence": "Do you know where the bank is located?",
          "wordPool": [
            "Do",
            "you",
            "know",
            "where",
            "the",
            "bank",
            "is",
            "located?"
          ],
          "grammarBreakdown": "Maintains statement order \"the bank is located\" inside indirect frame."
        }
      ]
    }
  },
  {
    "id": "day-5",
    "dayNumber": 5,
    "monthNumber": 1,
    "title": "Countable vs. Uncountable Nouns & Quantifiers: \"Much\", \"Many\", \"Some\", \"Any\"",
    "category": "grammar",
    "level": "beginner",
    "description": "Master quantifying physical items, abstract mass concepts, and making polite requests with \"some\" and \"any\".",
    "xpReward": 50,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Countable nouns refer to individual items that can be counted (one apple, two apples). Uncountable nouns represent mass substances, concepts, or liquids (water, advice, money) that cannot be directly pluralized.",
      "rules": [
        {
          "rule": "Use \"many\", \"few\", or \"a few\" with Countable Plural Nouns; use \"much\", \"little\", or \"a little\" with Uncountable Nouns.",
          "why": "Countable items exist as discrete units. Uncountable items exist as a continuous mass.",
          "example": "How many books did you buy? / How much water is left in the bottle?",
          "wrongExample": "How much books did you buy? / How many water is left?"
        },
        {
          "rule": "Use \"some\" in positive statements and polite offers/requests; use \"any\" in negative statements and open questions.",
          "why": "\"Some\" assumes a positive quantity; \"any\" checks for or asserts zero existence.",
          "example": "I have some news! / Would you like some coffee? / I don't have any questions.",
          "wrongExample": "I don't have some questions. / Would you like any coffee?"
        }
      ],
      "wordExplanations": [
        {
          "word": "many chairs",
          "role": "Quantifier + Countable Plural",
          "whyUsed": "Countable items."
        },
        {
          "word": "much information",
          "role": "Quantifier + Uncountable Abstract",
          "whyUsed": "Uncountable abstract noun."
        }
      ],
      "proTip": "In casual English, \"a lot of\" works with BOTH countable and uncountable nouns!"
    },
    "quiz": [
      {
        "id": "d5-q1",
        "question": "Which sentence correctly asks about quantity?",
        "options": [
          "How many pieces of luggage did you bring on the trip?",
          "How many luggages did you bring on the trip?",
          "How much luggages did you bring on the trip?",
          "How many piece of luggage did you bring?"
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "\"Luggage\" is uncountable. To count individual items, say \"pieces of luggage\".",
        "grammaticalRole": "Countable Quantifier with Mass Noun"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Quantifier Architect",
      "instructions": "Arrange the word blocks!",
      "sentenceBuilder": [
        {
          "targetSentence": "She gave me three useful pieces of advice.",
          "wordPool": [
            "She",
            "gave",
            "me",
            "three",
            "useful",
            "pieces",
            "of",
            "advice."
          ],
          "grammarBreakdown": "\"Advice\" is uncountable, so \"pieces of advice\" is used to count three items."
        }
      ]
    }
  },
  {
    "id": "day-6",
    "dayNumber": 6,
    "monthNumber": 1,
    "title": "Personal, Possessive & Reflexive Pronouns (I, Me, My, Mine, Myself)",
    "category": "grammar",
    "level": "beginner",
    "description": "Master subject pronouns, object pronouns, possessive adjectives, and reflexive self-referencing forms.",
    "xpReward": 55,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Pronouns replace nouns to avoid repetition. Subject pronouns perform actions (I, He), object pronouns receive actions (me, him), possessive adjectives modify nouns (my book), possessive pronouns stand alone (mine), and reflexives emphasize or reflect the subject (myself).",
      "rules": [
        {
          "rule": "Use subject pronouns before verbs and object pronouns after verbs or prepositions.",
          "why": "Syntactic case alignment dictates nominative for subjects and accusative for objects.",
          "example": "She spoke to him yesterday. / I gave her my phone number.",
          "wrongExample": "Her spoke to he yesterday."
        }
      ],
      "wordExplanations": [
        {
          "word": "myself",
          "role": "Reflexive Pronoun",
          "whyUsed": "Used when the subject and object are the exact same entity."
        }
      ],
      "proTip": "Pro Tip Day 6: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d6-q1",
        "question": "Which sentence demonstrates correct Day 6 English usage?",
        "options": [
          "She spoke to him yesterday.",
          "Her spoke to he yesterday.",
          "Option 3 with grammatical error on Day 6.",
          "Option 4 with wrong verb tense on Day 6."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 6.",
        "grammaticalRole": "Target Structure for Day 6"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 6 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "She spoke to him yesterday.",
          "wordPool": [
            "She",
            "spoke",
            "to",
            "him",
            "yesterday"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 6."
        }
      ]
    }
  },
  {
    "id": "day-7",
    "dayNumber": 7,
    "monthNumber": 1,
    "title": "Demonstratives & Determiners (This, That, These, Those, Each, Every)",
    "category": "grammar",
    "level": "beginner",
    "description": "Learn relative distance pointing words and distributive determiners.",
    "xpReward": 60,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Demonstratives point to near or far singular and plural items. \"Each\" focuses on individual members of a group, while \"every\" considers all members collectively.",
      "rules": [
        {
          "rule": "Use \"this/these\" for near items; use \"that/those\" for distant items in time or space.",
          "why": "Demonstratives encode spatial and temporal proximity.",
          "example": "This idea here is great, but those proposals over there need work.",
          "wrongExample": "These idea here is great."
        }
      ],
      "wordExplanations": [
        {
          "word": "Each student",
          "role": "Distributive Determiner + Singular Noun",
          "whyUsed": "\"Each\" considers students individually and takes singular verb."
        }
      ],
      "proTip": "Pro Tip Day 7: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d7-q1",
        "question": "Which sentence demonstrates correct Day 7 English usage?",
        "options": [
          "This idea here is great, but those proposals over there need work.",
          "These idea here is great.",
          "Option 3 with grammatical error on Day 7.",
          "Option 4 with wrong verb tense on Day 7."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 7.",
        "grammaticalRole": "Target Structure for Day 7"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 7 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "This idea here is great, but those proposals over there need work.",
          "wordPool": [
            "This",
            "idea",
            "here",
            "is",
            "great",
            "but",
            "those",
            "proposals",
            "over",
            "there",
            "need",
            "work"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 7."
        }
      ]
    }
  },
  {
    "id": "day-8",
    "dayNumber": 8,
    "monthNumber": 1,
    "title": "Adjectives vs. Adverbs: Describing Nouns vs. Actions",
    "category": "grammar",
    "level": "beginner",
    "description": "Differentiate words modifying nouns from words modifying verbs, adjectives, or entire clauses.",
    "xpReward": 65,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Adjectives modify nouns and pronouns (a quick decision). Adverbs modify verbs, adjectives, or other adverbs (decided quickly).",
      "rules": [
        {
          "rule": "Use adjectives after linking verbs (look, sound, smell, feel, seem) rather than adverbs.",
          "why": "Linking verbs connect the subject to a subject complement adjective describing its state.",
          "example": "The soup smells delicious (adjective). / She sang beautifully (adverb).",
          "wrongExample": "The soup smells deliciously."
        }
      ],
      "wordExplanations": [
        {
          "word": "quick vs quickly",
          "role": "Adjective vs Adverb",
          "whyUsed": "Adjectives modify nouns; adverbs modify verb actions."
        }
      ],
      "proTip": "Pro Tip Day 8: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d8-q1",
        "question": "Which sentence demonstrates correct Day 8 English usage?",
        "options": [
          "The soup smells delicious (adjective).",
          "The soup smells deliciously.",
          "Option 3 with grammatical error on Day 8.",
          "Option 4 with wrong verb tense on Day 8."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 8.",
        "grammaticalRole": "Target Structure for Day 8"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 8 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "The soup smells delicious (adjective).",
          "wordPool": [
            "The",
            "soup",
            "smells",
            "delicious",
            "(adjective)"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 8."
        }
      ]
    }
  },
  {
    "id": "day-9",
    "dayNumber": 9,
    "monthNumber": 1,
    "title": "Comparative & Superlative Adjectives (Faster, More Efficient, The Best)",
    "category": "grammar",
    "level": "beginner",
    "description": "Form regular and irregular comparative and superlative structures accurately.",
    "xpReward": 70,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Comparatives compare two entities (ends in -er or uses \"more\"). Superlatives compare three or more entities (ends in -est or uses \"most\") and take \"the\".",
      "rules": [
        {
          "rule": "One-syllable adjectives take -er/-est; adjectives with 3+ syllables take more/most.",
          "why": "English morphological simplicity preserves speech cadence.",
          "example": "This model is faster and more efficient than the old one.",
          "wrongExample": "This model is more faster than the old one."
        }
      ],
      "wordExplanations": [
        {
          "word": "the most efficient",
          "role": "Superlative Form",
          "whyUsed": "Multi-syllable adjective modified by \"the most\" for highest degree."
        }
      ],
      "proTip": "Pro Tip Day 9: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d9-q1",
        "question": "Which sentence demonstrates correct Day 9 English usage?",
        "options": [
          "This model is faster and more efficient than the old one.",
          "This model is more faster than the old one.",
          "Option 3 with grammatical error on Day 9.",
          "Option 4 with wrong verb tense on Day 9."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 9.",
        "grammaticalRole": "Target Structure for Day 9"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 9 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "This model is faster and more efficient than the old one.",
          "wordPool": [
            "This",
            "model",
            "is",
            "faster",
            "and",
            "more",
            "efficient",
            "than",
            "the",
            "old",
            "one"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 9."
        }
      ]
    }
  },
  {
    "id": "day-10",
    "dayNumber": 10,
    "monthNumber": 1,
    "title": "Essential Daily Routines & Common Action Verbs Vocabulary",
    "category": "vocabulary",
    "level": "beginner",
    "description": "Build fluency describing daily schedules, habits, and work routines.",
    "xpReward": 50,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Describing daily routines requires collocations like \"wake up\", \"commute to work\", \"review documents\", and \"catch up on emails\".",
      "rules": [
        {
          "rule": "Use Present Simple with time prepositions (at 7 AM, in the morning) to recount routines.",
          "why": "Habitual actions call for timeless present simple aspect.",
          "example": "I usually commute to work by train at 8:00 AM.",
          "wrongExample": "I am commuting to work every day at 8:00 AM."
        }
      ],
      "wordExplanations": [
        {
          "word": "commute",
          "role": "Action Verb / Collocation",
          "whyUsed": "Refers to traveling regularly between home and work."
        }
      ],
      "proTip": "Pro Tip Day 10: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d10-q1",
        "question": "Which sentence demonstrates correct Day 10 English usage?",
        "options": [
          "I usually commute to work by train at 8:00 AM.",
          "I am commuting to work every day at 8:00 AM.",
          "Option 3 with grammatical error on Day 10.",
          "Option 4 with wrong verb tense on Day 10."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 10.",
        "grammaticalRole": "Target Structure for Day 10"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 10 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "I usually commute to work by train at 8:00 AM.",
          "wordPool": [
            "I",
            "usually",
            "commute",
            "to",
            "work",
            "by",
            "train",
            "at",
            "8:00",
            "AM"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 10."
        }
      ]
    }
  },
  {
    "id": "day-11",
    "dayNumber": 11,
    "monthNumber": 1,
    "title": "Prepositions of Place: In, On, At, Under, Next to, Between",
    "category": "grammar",
    "level": "beginner",
    "description": "Master spatial relationships and location prepositions in visual context.",
    "xpReward": 55,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Spatial prepositions position objects in 3D space. \"In\" denotes enclosed 3D spaces, \"on\" denotes surface contact, and \"at\" denotes specific points or address locations.",
      "rules": [
        {
          "rule": "Use \"at\" for specific point locations, \"on\" for flat surfaces/streets, and \"in\" for enclosed spaces/cities/countries.",
          "why": "Dimensional granularity dictates preposition selection.",
          "example": "He is sitting at his desk on the second floor in Tokyo.",
          "wrongExample": "He is sitting in his desk at Tokyo."
        }
      ],
      "wordExplanations": [
        {
          "word": "at the desk",
          "role": "Preposition of Spatial Point",
          "whyUsed": "Specifies exact location point of activity."
        }
      ],
      "proTip": "Pro Tip Day 11: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d11-q1",
        "question": "Which sentence demonstrates correct Day 11 English usage?",
        "options": [
          "He is sitting at his desk on the second floor in Tokyo.",
          "He is sitting in his desk at Tokyo.",
          "Option 3 with grammatical error on Day 11.",
          "Option 4 with wrong verb tense on Day 11."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 11.",
        "grammaticalRole": "Target Structure for Day 11"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 11 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "He is sitting at his desk on the second floor in Tokyo.",
          "wordPool": [
            "He",
            "is",
            "sitting",
            "at",
            "his",
            "desk",
            "on",
            "the",
            "second",
            "floor",
            "in",
            "Tokyo"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 11."
        }
      ]
    }
  },
  {
    "id": "day-12",
    "dayNumber": 12,
    "monthNumber": 1,
    "title": "Quantifiers Deep-Dive: Few vs A Few, Little vs A Little, Plenty Of",
    "category": "grammar",
    "level": "beginner",
    "description": "Understand the subtle positive vs negative nuances of \"a few\" vs \"few\" and \"a little\" vs \"little\".",
    "xpReward": 60,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "\"Few\" and \"little\" (without \"a\") convey negative scarcity (almost none). \"A few\" and \"a little\" convey positive availability (some, sufficient).",
      "rules": [
        {
          "rule": "Use \"few / a few\" with countable plural nouns; use \"little / a little\" with uncountable nouns.",
          "why": "Nuance depends on article presence: \"a few\" means positive presence, \"few\" means disappointing scarcity.",
          "example": "I have a few friends in town (positive). / I have few friends here (lonely).",
          "wrongExample": "I have a little friends in town."
        }
      ],
      "wordExplanations": [
        {
          "word": "a few items",
          "role": "Countable Positive Quantifier",
          "whyUsed": "Indicates a small but sufficient count."
        }
      ],
      "proTip": "Pro Tip Day 12: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d12-q1",
        "question": "Which sentence demonstrates correct Day 12 English usage?",
        "options": [
          "I have a few friends in town (positive).",
          "I have a little friends in town.",
          "Option 3 with grammatical error on Day 12.",
          "Option 4 with wrong verb tense on Day 12."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 12.",
        "grammaticalRole": "Target Structure for Day 12"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 12 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "I have a few friends in town (positive).",
          "wordPool": [
            "I",
            "have",
            "a",
            "few",
            "friends",
            "in",
            "town",
            "(positive)"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 12."
        }
      ]
    }
  },
  {
    "id": "day-13",
    "dayNumber": 13,
    "monthNumber": 1,
    "title": "Possessive Nouns & Apostrophe Rules ('s vs s' vs Its/It's)",
    "category": "grammar",
    "level": "beginner",
    "description": "Eliminate apostrophe confusion between possessives, plurals, and contractions.",
    "xpReward": 65,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Add 's to singular nouns for possession (the user's account). Add ' to plural nouns ending in s (the users' accounts). \"Its\" is possessive; \"It's\" is a contraction for \"it is\".",
      "rules": [
        {
          "rule": "Never use an apostrophe for simple plural nouns or possessive pronouns (its, whose, ours).",
          "why": "Apostrophes mark omission or possessive noun case, never standard pluralization.",
          "example": "The company updated its privacy policy for all its customers.",
          "wrongExample": "The company updated it's privacy policy for all it's customer's."
        }
      ],
      "wordExplanations": [
        {
          "word": "its policy",
          "role": "Possessive Pronoun (No Apostrophe)",
          "whyUsed": "\"Its\" shows ownership without contraction."
        }
      ],
      "proTip": "Pro Tip Day 13: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d13-q1",
        "question": "Which sentence demonstrates correct Day 13 English usage?",
        "options": [
          "The company updated its privacy policy for all its customers.",
          "The company updated it's privacy policy for all it's customer's.",
          "Option 3 with grammatical error on Day 13.",
          "Option 4 with wrong verb tense on Day 13."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 13.",
        "grammaticalRole": "Target Structure for Day 13"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 13 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "The company updated its privacy policy for all its customers.",
          "wordPool": [
            "The",
            "company",
            "updated",
            "its",
            "privacy",
            "policy",
            "for",
            "all",
            "its",
            "customers"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 13."
        }
      ]
    }
  },
  {
    "id": "day-14",
    "dayNumber": 14,
    "monthNumber": 1,
    "title": "Time Expressions & Adverbs of Frequency (Always, Usually, Rarely, Seldom)",
    "category": "grammar",
    "level": "beginner",
    "description": "Position frequency adverbs accurately relative to main verbs and auxiliary \"be\".",
    "xpReward": 70,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Frequency adverbs quantify how often events occur. They sit BEFORE main verbs (I always drink water) but AFTER auxiliary verb \"be\" (She is always punctual).",
      "rules": [
        {
          "rule": "Place frequency adverbs before main verbs, but immediately after the verb \"to be\".",
          "why": "Syntactic slotting prioritizes proximity to auxiliary verb state.",
          "example": "He rarely arrives late. / He is rarely late.",
          "wrongExample": "He arrives rarely late. / He rarely is late."
        }
      ],
      "wordExplanations": [
        {
          "word": "rarely",
          "role": "Negative Frequency Adverb",
          "whyUsed": "Indicates infrequent occurrence."
        }
      ],
      "proTip": "Pro Tip Day 14: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d14-q1",
        "question": "Which sentence demonstrates correct Day 14 English usage?",
        "options": [
          "He rarely arrives late.",
          "He arrives rarely late. / He rarely is late.",
          "Option 3 with grammatical error on Day 14.",
          "Option 4 with wrong verb tense on Day 14."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 14.",
        "grammaticalRole": "Target Structure for Day 14"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 14 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "He rarely arrives late.",
          "wordPool": [
            "He",
            "rarely",
            "arrives",
            "late"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 14."
        }
      ]
    }
  },
  {
    "id": "day-15",
    "dayNumber": 15,
    "monthNumber": 1,
    "title": "Prepositions Pyramid: \"In\", \"On\", and \"At\" Decoded",
    "category": "grammar",
    "level": "beginner",
    "description": "Master time and calendar prepositions from general centuries to specific precise hours.",
    "xpReward": 50,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "The Prepositions Pyramid narrows from general to specific: \"In\" for long periods (months, years, centuries), \"On\" for dates and days, \"At\" for exact hours and precise times.",
      "rules": [
        {
          "rule": "Use IN for months/years (in May, in 2026), ON for specific days/dates (on Monday, on May 4th), AT for exact times (at 3 PM).",
          "why": "Temporal specificity dictates preposition selection.",
          "example": "The event starts at 9 AM on Friday in October.",
          "wrongExample": "The event starts in 9 AM at Friday on October."
        }
      ],
      "wordExplanations": [
        {
          "word": "on Friday",
          "role": "Preposition of Day/Date",
          "whyUsed": "Specific day requires \"on\"."
        }
      ],
      "proTip": "Pro Tip Day 15: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d15-q1",
        "question": "Which sentence demonstrates correct Day 15 English usage?",
        "options": [
          "The event starts at 9 AM on Friday in October.",
          "The event starts in 9 AM at Friday on October.",
          "Option 3 with grammatical error on Day 15.",
          "Option 4 with wrong verb tense on Day 15."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 15.",
        "grammaticalRole": "Target Structure for Day 15"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 15 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "The event starts at 9 AM on Friday in October.",
          "wordPool": [
            "The",
            "event",
            "starts",
            "at",
            "9",
            "AM",
            "on",
            "Friday",
            "in",
            "October"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 15."
        }
      ]
    }
  },
  {
    "id": "day-16",
    "dayNumber": 16,
    "monthNumber": 1,
    "title": "Basic Conjunctions & Compound Sentences (And, But, So, Because, Although)",
    "category": "grammar",
    "level": "beginner",
    "description": "Connect clauses logically to create fluent compound and complex sentences.",
    "xpReward": 55,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Conjunctions link ideas. Coordinating conjunctions (FANBOYS: and, but, so) connect equal clauses. Subordinating conjunctions (because, although) establish cause or contrast.",
      "rules": [
        {
          "rule": "Use a comma before coordinating conjunctions (and, but, so) when joining two independent clauses.",
          "why": "Commas signal clause boundaries between full independent thoughts.",
          "example": "I wanted to attend the conference, but all tickets were sold out.",
          "wrongExample": "I wanted to attend the conference but all tickets were sold out because."
        }
      ],
      "wordExplanations": [
        {
          "word": "although",
          "role": "Concession Subordinating Conjunction",
          "whyUsed": "Introduces a contrasting clause."
        }
      ],
      "proTip": "Pro Tip Day 16: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d16-q1",
        "question": "Which sentence demonstrates correct Day 16 English usage?",
        "options": [
          "I wanted to attend the conference, but all tickets were sold out.",
          "I wanted to attend the conference but all tickets were sold out because.",
          "Option 3 with grammatical error on Day 16.",
          "Option 4 with wrong verb tense on Day 16."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 16.",
        "grammaticalRole": "Target Structure for Day 16"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 16 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "I wanted to attend the conference, but all tickets were sold out.",
          "wordPool": [
            "I",
            "wanted",
            "to",
            "attend",
            "the",
            "conference",
            "but",
            "all",
            "tickets",
            "were",
            "sold",
            "out"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 16."
        }
      ]
    }
  },
  {
    "id": "day-17",
    "dayNumber": 17,
    "monthNumber": 1,
    "title": "Imperatives & Giving Polite Instructions or Orders",
    "category": "conversation",
    "level": "beginner",
    "description": "Form direct commands, software instructions, and polite imperative requests.",
    "xpReward": 60,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Imperatives drop the subject pronoun and start directly with the base verb form (Click here, Turn right). Add \"Please\" or \"Kindly\" for polite business instructions.",
      "rules": [
        {
          "rule": "Use bare base verb at sentence start for positive imperatives; use \"Do not\" / \"Don't\" for negative imperatives.",
          "why": "The subject \"you\" is understood implicitly in imperative mood.",
          "example": "Please submit your report before 5 PM. / Do not share your password.",
          "wrongExample": "You submit your report before 5 PM! / Not share your password."
        }
      ],
      "wordExplanations": [
        {
          "word": "Please submit",
          "role": "Polite Imperative Verb",
          "whyUsed": "Direct instruction softened with polite marker."
        }
      ],
      "proTip": "Pro Tip Day 17: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d17-q1",
        "question": "Which sentence demonstrates correct Day 17 English usage?",
        "options": [
          "Please submit your report before 5 PM.",
          "You submit your report before 5 PM! / Not share your password.",
          "Option 3 with grammatical error on Day 17.",
          "Option 4 with wrong verb tense on Day 17."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 17.",
        "grammaticalRole": "Target Structure for Day 17"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 17 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Please submit your report before 5 PM.",
          "wordPool": [
            "Please",
            "submit",
            "your",
            "report",
            "before",
            "5",
            "PM"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 17."
        }
      ]
    }
  },
  {
    "id": "day-18",
    "dayNumber": 18,
    "monthNumber": 1,
    "title": "Cardinal & Ordinal Numbers, Dates and Telling Time",
    "category": "vocabulary",
    "level": "beginner",
    "description": "Say numbers, ordinal rankings, formal dates, and precise time accurately.",
    "xpReward": 65,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Cardinal numbers count quantity (one, two); ordinal numbers denote order or ranking (first, second, third). Dates write \"May 4th\" and speak \"May the fourth\".",
      "rules": [
        {
          "rule": "Use ordinal numbers for dates, floor levels, and sequential steps.",
          "why": "Ordinals specify exact relative position in a series.",
          "example": "Our office is located on the 4th floor. The meeting is on May 4th.",
          "wrongExample": "Our office is located on the 4 floor. The meeting is on May 4."
        }
      ],
      "wordExplanations": [
        {
          "word": "4th floor",
          "role": "Ordinal Number Modifier",
          "whyUsed": "Designates sequential position of floor level."
        }
      ],
      "proTip": "Pro Tip Day 18: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d18-q1",
        "question": "Which sentence demonstrates correct Day 18 English usage?",
        "options": [
          "Our office is located on the 4th floor. The meeting is on May 4th.",
          "Our office is located on the 4 floor. The meeting is on May 4.",
          "Option 3 with grammatical error on Day 18.",
          "Option 4 with wrong verb tense on Day 18."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 18.",
        "grammaticalRole": "Target Structure for Day 18"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 18 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Our office is located on the 4th floor. The meeting is on May 4th.",
          "wordPool": [
            "Our",
            "office",
            "is",
            "located",
            "on",
            "the",
            "4th",
            "floor",
            "The",
            "meeting",
            "is",
            "on",
            "May",
            "4th"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 18."
        }
      ]
    }
  },
  {
    "id": "day-19",
    "dayNumber": 19,
    "monthNumber": 1,
    "title": "Physical Descriptions & Personality Traits Vocabulary",
    "category": "vocabulary",
    "level": "beginner",
    "description": "Describe appearance and character using precise adjectives and collocations.",
    "xpReward": 70,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Physical descriptions use \"have/has\" for features (has brown hair) and \"is/are\" for states (is tall, is reliable). Personality adjectives enrich social description.",
      "rules": [
        {
          "rule": "Use \"is/are\" with standalone adjectives (She is articulate); use \"has/have\" with noun phrases (She has great communication skills).",
          "why": "State vs possession determines copula vs transitive verb choice.",
          "example": "He is articulate, reliable, and has extensive industry experience.",
          "wrongExample": "He has articulate and reliable."
        }
      ],
      "wordExplanations": [
        {
          "word": "articulate",
          "role": "Personality Adjective",
          "whyUsed": "Describes ability to express thoughts clearly."
        }
      ],
      "proTip": "Pro Tip Day 19: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d19-q1",
        "question": "Which sentence demonstrates correct Day 19 English usage?",
        "options": [
          "He is articulate, reliable, and has extensive industry experience.",
          "He has articulate and reliable.",
          "Option 3 with grammatical error on Day 19.",
          "Option 4 with wrong verb tense on Day 19."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 19.",
        "grammaticalRole": "Target Structure for Day 19"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 19 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "He is articulate, reliable, and has extensive industry experience.",
          "wordPool": [
            "He",
            "is",
            "articulate",
            "reliable",
            "and",
            "has",
            "extensive",
            "industry",
            "experience"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 19."
        }
      ]
    }
  },
  {
    "id": "day-20",
    "dayNumber": 20,
    "monthNumber": 1,
    "title": "Expressing Likes, Dislikes & Preferences (Prefer, Would Rather)",
    "category": "conversation",
    "level": "beginner",
    "description": "Master structures expressing choices: \"prefer X to Y\" vs \"would rather X than Y\".",
    "xpReward": 50,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "\"Prefer\" takes gerunds/nouns separated by \"to\" (I prefer coffee to tea). \"Would rather\" takes base verbs separated by \"than\" (I would rather drink coffee than tea).",
      "rules": [
        {
          "rule": "Say \"prefer [noun/gerund] TO [noun/gerund]\", but \"would rather [base verb] THAN [base verb]\".",
          "why": "Grammatical parallelism requires matching forms across preference markers.",
          "example": "I prefer working remotely to commuting every day. / I would rather work remotely than commute.",
          "wrongExample": "I prefer working remotely than commuting. / I would rather work remotely to commute."
        }
      ],
      "wordExplanations": [
        {
          "word": "prefer X to Y",
          "role": "Preference Structure",
          "whyUsed": "Correct preposition marker for \"prefer\"."
        }
      ],
      "proTip": "Pro Tip Day 20: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d20-q1",
        "question": "Which sentence demonstrates correct Day 20 English usage?",
        "options": [
          "I prefer working remotely to commuting every day.",
          "I prefer working remotely than commuting. / I would rather work remotely to commute.",
          "Option 3 with grammatical error on Day 20.",
          "Option 4 with wrong verb tense on Day 20."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 20.",
        "grammaticalRole": "Target Structure for Day 20"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 20 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "I prefer working remotely to commuting every day.",
          "wordPool": [
            "I",
            "prefer",
            "working",
            "remotely",
            "to",
            "commuting",
            "every",
            "day"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 20."
        }
      ]
    }
  },
  {
    "id": "day-21",
    "dayNumber": 21,
    "monthNumber": 1,
    "title": "Modal Verbs for Ability & Permission (Can, Could, Be Able To)",
    "category": "grammar",
    "level": "beginner",
    "description": "Express general ability, past capability, and polite permission requests.",
    "xpReward": 55,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "\"Can\" expresses general present ability and casual permission. \"Could\" expresses past general ability or polite requests. \"Be able to\" works across all tenses.",
      "rules": [
        {
          "rule": "Use \"was/were able to\" for a specific successful achievement in the past, rather than \"could\".",
          "why": "\"Could\" implies general past ability, whereas \"was able to\" confirms actual single event success.",
          "example": "Despite the storm, we were able to arrive on time.",
          "wrongExample": "Despite the storm, we can arrive on time yesterday."
        }
      ],
      "wordExplanations": [
        {
          "word": "were able to",
          "role": "Past Specific Achievement Modal",
          "whyUsed": "Confirms successful completion of specific past action."
        }
      ],
      "proTip": "Pro Tip Day 21: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d21-q1",
        "question": "Which sentence demonstrates correct Day 21 English usage?",
        "options": [
          "Despite the storm, we were able to arrive on time.",
          "Despite the storm, we can arrive on time yesterday.",
          "Option 3 with grammatical error on Day 21.",
          "Option 4 with wrong verb tense on Day 21."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 21.",
        "grammaticalRole": "Target Structure for Day 21"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 21 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Despite the storm, we were able to arrive on time.",
          "wordPool": [
            "Despite",
            "the",
            "storm",
            "we",
            "were",
            "able",
            "to",
            "arrive",
            "on",
            "time"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 21."
        }
      ]
    }
  },
  {
    "id": "day-22",
    "dayNumber": 22,
    "monthNumber": 1,
    "title": "Modal Verbs for Advice & Obligation (Should, Must, Have To)",
    "category": "grammar",
    "level": "beginner",
    "description": "Differentiate soft recommendations (should) from hard obligations (must, have to).",
    "xpReward": 60,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "\"Should\" gives recommendations/advice. \"Must\" expresses strong personal obligation or written rules. \"Have to\" expresses external rules or regulations.",
      "rules": [
        {
          "rule": "Use \"don't have to\" for lack of obligation (optional), but \"must not\" for strict prohibition (forbidden).",
          "why": "Negation fundamentally alters modal obligation meaning.",
          "example": "You don't have to wear a suit (optional). / You must not enter without a badge (prohibited).",
          "wrongExample": "You must not pay if it's free."
        }
      ],
      "wordExplanations": [
        {
          "word": "don't have to",
          "role": "Lack of Obligation Modal",
          "whyUsed": "Means something is optional, not mandatory."
        }
      ],
      "proTip": "Pro Tip Day 22: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d22-q1",
        "question": "Which sentence demonstrates correct Day 22 English usage?",
        "options": [
          "You don't have to wear a suit (optional).",
          "You must not pay if it's free.",
          "Option 3 with grammatical error on Day 22.",
          "Option 4 with wrong verb tense on Day 22."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 22.",
        "grammaticalRole": "Target Structure for Day 22"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 22 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "You don't have to wear a suit (optional).",
          "wordPool": [
            "You",
            "don't",
            "have",
            "to",
            "wear",
            "a",
            "suit",
            "(optional)"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 22."
        }
      ]
    }
  },
  {
    "id": "day-23",
    "dayNumber": 23,
    "monthNumber": 1,
    "title": "Food, Dining & Restaurant Conversation Vocabulary",
    "category": "conversation",
    "level": "beginner",
    "description": "Order meals politely, ask about dietary requirements, and settle bills in English.",
    "xpReward": 65,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Dining conversations use polite modal requests like \"I would like...\", \"Could we have...\", \"Does this contain...\", and \"May we get the check?\".",
      "rules": [
        {
          "rule": "Use \"I would like [item]\" or \"Could I have [item]\" when ordering food, not \"I want\".",
          "why": "Pragmatic politeness conventions require modal softening in service encounters.",
          "example": "Could we please get the menu? I would like the grilled salmon.",
          "wrongExample": "Give me menu. I want salmon."
        }
      ],
      "wordExplanations": [
        {
          "word": "I would like",
          "role": "Polite Ordering Formula",
          "whyUsed": "Standard courteous phrasing for ordering."
        }
      ],
      "proTip": "Pro Tip Day 23: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d23-q1",
        "question": "Which sentence demonstrates correct Day 23 English usage?",
        "options": [
          "Could we please get the menu? I would like the grilled salmon.",
          "Give me menu. I want salmon.",
          "Option 3 with grammatical error on Day 23.",
          "Option 4 with wrong verb tense on Day 23."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 23.",
        "grammaticalRole": "Target Structure for Day 23"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 23 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Could we please get the menu? I would like the grilled salmon.",
          "wordPool": [
            "Could",
            "we",
            "please",
            "get",
            "the",
            "menu?",
            "I",
            "would",
            "like",
            "the",
            "grilled",
            "salmon"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 23."
        }
      ]
    }
  },
  {
    "id": "day-24",
    "dayNumber": 24,
    "monthNumber": 1,
    "title": "Shopping, Prices, Quantities & Transactions Vocabulary",
    "category": "vocabulary",
    "level": "beginner",
    "description": "Inquire about items, discuss sizes, return products, and handle customer service.",
    "xpReward": 70,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Shopping vocabulary encompasses \"receipt\", \"refund\", \"in stock\", \"fitting room\", \"discount\", and polite inquiries like \"Do you carry this in size medium?\".",
      "rules": [
        {
          "rule": "Use \"How much is this?\" for single items; use \"How much are these?\" for plural items.",
          "why": "Plural demonstrative requires matching plural verb form.",
          "example": "Could I try this on in the fitting room? I'd like to return this item with my receipt.",
          "wrongExample": "How much is these shoes?"
        }
      ],
      "wordExplanations": [
        {
          "word": "fitting room",
          "role": "Retail Noun Collocation",
          "whyUsed": "Designated area to try on clothing."
        }
      ],
      "proTip": "Pro Tip Day 24: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d24-q1",
        "question": "Which sentence demonstrates correct Day 24 English usage?",
        "options": [
          "Could I try this on in the fitting room? I'd like to return this item with my receipt.",
          "How much is these shoes?",
          "Option 3 with grammatical error on Day 24.",
          "Option 4 with wrong verb tense on Day 24."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 24.",
        "grammaticalRole": "Target Structure for Day 24"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 24 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Could I try this on in the fitting room? I'd like to return this item with my receipt.",
          "wordPool": [
            "Could",
            "I",
            "try",
            "this",
            "on",
            "in",
            "the",
            "fitting",
            "room?",
            "I'd",
            "like",
            "to",
            "return",
            "this",
            "item",
            "with",
            "my",
            "receipt"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 24."
        }
      ]
    }
  },
  {
    "id": "day-25",
    "dayNumber": 25,
    "monthNumber": 1,
    "title": "Gerunds vs Infinitives: \"Doing\" vs \"To Do\"",
    "category": "grammar",
    "level": "intermediate",
    "description": "Master verb patterns: verbs followed by gerund (-ing) vs infinitive (to + verb).",
    "xpReward": 50,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Some verbs require gerunds (enjoy, avoid, suggest, mind), while others require infinitives (decide, hope, plan, refuse, promise). Some verbs change meaning with each form!",
      "rules": [
        {
          "rule": "Verbs of enjoyment, avoidance, and suggestion take gerunds: enjoy swimming, avoid making errors.",
          "why": "Gerunds conceptualize the action as an ongoing activity or completed state.",
          "example": "She decided to apply for the job and avoided making rushed choices.",
          "wrongExample": "She decided applying for the job and avoided to make rushed choices."
        }
      ],
      "wordExplanations": [
        {
          "word": "avoid making",
          "role": "Verb + Gerund Pattern",
          "whyUsed": "\"Avoid\" strictly requires gerund object."
        }
      ],
      "proTip": "Pro Tip Day 25: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d25-q1",
        "question": "Which sentence demonstrates correct Day 25 English usage?",
        "options": [
          "She decided to apply for the job and avoided making rushed choices.",
          "She decided applying for the job and avoided to make rushed choices.",
          "Option 3 with grammatical error on Day 25.",
          "Option 4 with wrong verb tense on Day 25."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 25.",
        "grammaticalRole": "Target Structure for Day 25"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 25 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "She decided to apply for the job and avoided making rushed choices.",
          "wordPool": [
            "She",
            "decided",
            "to",
            "apply",
            "for",
            "the",
            "job",
            "and",
            "avoided",
            "making",
            "rushed",
            "choices"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 25."
        }
      ]
    }
  },
  {
    "id": "day-26",
    "dayNumber": 26,
    "monthNumber": 1,
    "title": "Travel, Directions & Transportation Vocabulary",
    "category": "vocabulary",
    "level": "intermediate",
    "description": "Navigate airports, ask for directions, and manage hotel bookings seamlessly.",
    "xpReward": 55,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Travel English requires clear spatial cues (go straight, take the second left, boarding pass, customs, delay, layover).",
      "rules": [
        {
          "rule": "Use \"by\" for modes of transport (by train, by plane), but \"on foot\" for walking.",
          "why": "Transportation prepositions categorize vehicle type vs walking.",
          "example": "We traveled by train to the city center and then proceeded on foot.",
          "wrongExample": "We traveled by foot to the airport."
        }
      ],
      "wordExplanations": [
        {
          "word": "on foot",
          "role": "Fixed Idiomatic Transport Preposition",
          "whyUsed": "Standard phrase for walking."
        }
      ],
      "proTip": "Pro Tip Day 26: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d26-q1",
        "question": "Which sentence demonstrates correct Day 26 English usage?",
        "options": [
          "We traveled by train to the city center and then proceeded on foot.",
          "We traveled by foot to the airport.",
          "Option 3 with grammatical error on Day 26.",
          "Option 4 with wrong verb tense on Day 26."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 26.",
        "grammaticalRole": "Target Structure for Day 26"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 26 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "We traveled by train to the city center and then proceeded on foot.",
          "wordPool": [
            "We",
            "traveled",
            "by",
            "train",
            "to",
            "the",
            "city",
            "center",
            "and",
            "then",
            "proceeded",
            "on",
            "foot"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 26."
        }
      ]
    }
  },
  {
    "id": "day-27",
    "dayNumber": 27,
    "monthNumber": 1,
    "title": "Stative Verbs vs Dynamic Verbs (Know, Love, Think, Belong)",
    "category": "grammar",
    "level": "intermediate",
    "description": "Identify verbs that cannot be used in continuous aspect unless their meaning shifts.",
    "xpReward": 60,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Stative verbs describe states of mind, perception, possession, or emotion (believe, belong, smell, own) and standardly reject -ing continuous tenses.",
      "rules": [
        {
          "rule": "When \"think\" means opinion, it is stative (I think so). When \"think\" means active mental process, it is dynamic (I am thinking about it).",
          "why": "Meaning shift converts stative sense to dynamic mental action.",
          "example": "This car belongs to me. / I think this proposal is brilliant.",
          "wrongExample": "This car is belonging to me."
        }
      ],
      "wordExplanations": [
        {
          "word": "belongs",
          "role": "Stative Possession Verb",
          "whyUsed": "Possession state cannot take continuous aspect."
        }
      ],
      "proTip": "Pro Tip Day 27: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d27-q1",
        "question": "Which sentence demonstrates correct Day 27 English usage?",
        "options": [
          "This car belongs to me.",
          "This car is belonging to me.",
          "Option 3 with grammatical error on Day 27.",
          "Option 4 with wrong verb tense on Day 27."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 27.",
        "grammaticalRole": "Target Structure for Day 27"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 27 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "This car belongs to me.",
          "wordPool": [
            "This",
            "car",
            "belongs",
            "to",
            "me"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 27."
        }
      ]
    }
  },
  {
    "id": "day-28",
    "dayNumber": 28,
    "monthNumber": 1,
    "title": "Order of Adjectives & Compound Nouns",
    "category": "grammar",
    "level": "intermediate",
    "description": "Arrange multiple adjectives in natural native sequence: OSASCOMP rule.",
    "xpReward": 65,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Adjectives follow a strict natural order: Opinion, Size, Age, Shape, Color, Origin, Material, Purpose + Noun (e.g. a beautiful small old round Italian leather briefcase).",
      "rules": [
        {
          "rule": "Opinion adjectives always come FIRST before factual physical adjectives (size, age, origin).",
          "why": "Subjective speaker perspective introduces the noun before objective physical traits.",
          "example": "A lovely small ancient rectangular French wooden desk.",
          "wrongExample": "A wooden French ancient rectangular small lovely desk."
        }
      ],
      "wordExplanations": [
        {
          "word": "lovely small wooden",
          "role": "Adjective Hierarchy",
          "whyUsed": "Opinion (lovely) -> Size (small) -> Material (wooden)."
        }
      ],
      "proTip": "Pro Tip Day 28: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d28-q1",
        "question": "Which sentence demonstrates correct Day 28 English usage?",
        "options": [
          "A lovely small ancient rectangular French wooden desk.",
          "A wooden French ancient rectangular small lovely desk.",
          "Option 3 with grammatical error on Day 28.",
          "Option 4 with wrong verb tense on Day 28."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 28.",
        "grammaticalRole": "Target Structure for Day 28"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 28 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "A lovely small ancient rectangular French wooden desk.",
          "wordPool": [
            "A",
            "lovely",
            "small",
            "ancient",
            "rectangular",
            "French",
            "wooden",
            "desk"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 28."
        }
      ]
    }
  },
  {
    "id": "day-29",
    "dayNumber": 29,
    "monthNumber": 1,
    "title": "Family, Relationships & Social Collocations Vocabulary",
    "category": "vocabulary",
    "level": "intermediate",
    "description": "Describe family structures, acquaintances, professional networking, and social ties.",
    "xpReward": 70,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Build natural collocations like \"extended family\", \"close confidant\", \"keep in touch\", \"get along well with\", and \"foster strong relationships\".",
      "rules": [
        {
          "rule": "Use phrasal verb \"get along with\" for harmonious social relationships.",
          "why": "Standard natural idiomatic phrasal verb for interpersonal harmony.",
          "example": "I get along well with my colleagues and keep in touch with old friends.",
          "wrongExample": "I get along good with my colleagues."
        }
      ],
      "wordExplanations": [
        {
          "word": "get along with",
          "role": "Social Phrasal Verb",
          "whyUsed": "Expresses positive relationship."
        }
      ],
      "proTip": "Pro Tip Day 29: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d29-q1",
        "question": "Which sentence demonstrates correct Day 29 English usage?",
        "options": [
          "I get along well with my colleagues and keep in touch with old friends.",
          "I get along good with my colleagues.",
          "Option 3 with grammatical error on Day 29.",
          "Option 4 with wrong verb tense on Day 29."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 29.",
        "grammaticalRole": "Target Structure for Day 29"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 29 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "I get along well with my colleagues and keep in touch with old friends.",
          "wordPool": [
            "I",
            "get",
            "along",
            "well",
            "with",
            "my",
            "colleagues",
            "and",
            "keep",
            "in",
            "touch",
            "with",
            "old",
            "friends"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 29."
        }
      ]
    }
  },
  {
    "id": "day-30",
    "dayNumber": 30,
    "monthNumber": 1,
    "title": "Month 1 Synthesis & Professional Reporting / Indirect Speech Prep",
    "category": "conversation",
    "level": "intermediate",
    "description": "Synthesize foundational Month 1 concepts and report statements professionally.",
    "xpReward": 50,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Reported speech shifts tenses back in time (Present Simple -> Past Simple) and changes pronouns and time markers (today -> that day).",
      "rules": [
        {
          "rule": "Shift tenses back when reporting past statements: \"I live here\" -> He said he lived there.",
          "why": "Reported event is viewed from a later past vantage point.",
          "example": "She mentioned that she was reviewing the quarterly results.",
          "wrongExample": "She mentioned that she is review the quarterly results yesterday."
        }
      ],
      "wordExplanations": [
        {
          "word": "said that she was",
          "role": "Reported Speech Backshift",
          "whyUsed": "Present tense backshifts to past tense after past reporting verb."
        }
      ],
      "proTip": "Pro Tip Day 30: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d30-q1",
        "question": "Which sentence demonstrates correct Day 30 English usage?",
        "options": [
          "She mentioned that she was reviewing the quarterly results.",
          "She mentioned that she is review the quarterly results yesterday.",
          "Option 3 with grammatical error on Day 30.",
          "Option 4 with wrong verb tense on Day 30."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 30.",
        "grammaticalRole": "Target Structure for Day 30"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 30 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "She mentioned that she was reviewing the quarterly results.",
          "wordPool": [
            "She",
            "mentioned",
            "that",
            "she",
            "was",
            "reviewing",
            "the",
            "quarterly",
            "results"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 30."
        }
      ]
    }
  },
  {
    "id": "day-31",
    "dayNumber": 31,
    "monthNumber": 2,
    "title": "Past Simple: Regular vs Irregular Verbs in Past Timelines",
    "category": "tenses",
    "level": "intermediate",
    "description": "Master completed past actions and irregular past verb forms.",
    "xpReward": 55,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Past Simple describes actions completed at a specific finished time in the past. Regular verbs add -ed, while irregular verbs have unique forms (buy -> bought, go -> went).",
      "rules": [
        {
          "rule": "Use Past Simple when the time frame is fully closed and finished (yesterday, in 2020).",
          "why": "Closed past timeframes disconnect the action from present time.",
          "example": "She bought a new laptop last week.",
          "wrongExample": "She has bought a new laptop last week."
        }
      ],
      "wordExplanations": [
        {
          "word": "bought",
          "role": "Irregular Past Verb",
          "whyUsed": "Past Simple form of buy for completed past action."
        }
      ],
      "proTip": "Pro Tip Day 31: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d31-q1",
        "question": "Which sentence demonstrates correct Day 31 English usage?",
        "options": [
          "She bought a new laptop last week.",
          "She has bought a new laptop last week.",
          "Option 3 with grammatical error on Day 31.",
          "Option 4 with wrong verb tense on Day 31."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 31.",
        "grammaticalRole": "Target Structure for Day 31"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 31 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "She bought a new laptop last week.",
          "wordPool": [
            "She",
            "bought",
            "a",
            "new",
            "laptop",
            "last",
            "week"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 31."
        }
      ]
    }
  },
  {
    "id": "day-32",
    "dayNumber": 32,
    "monthNumber": 2,
    "title": "Past Continuous: Background Actions & Interrupted Events",
    "category": "tenses",
    "level": "intermediate",
    "description": "Combine Past Continuous (was/were + -ing) with Past Simple to narrate stories.",
    "xpReward": 60,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Past Continuous sets the background scene or describes an ongoing past action that was interrupted by a shorter Past Simple event (e.g. I was studying when the phone rang).",
      "rules": [
        {
          "rule": "Use \"while\" for long simultaneous actions (Past Continuous); use \"when\" before the interrupting action (Past Simple).",
          "why": "Temporal conjunctions delineate background duration vs punctual interruption.",
          "example": "While I was driving home, it started to rain heavily.",
          "wrongExample": "While I drove home, it was starting to rain."
        }
      ],
      "wordExplanations": [
        {
          "word": "was driving",
          "role": "Past Continuous Background Verb",
          "whyUsed": "Ongoing past activity interrupted by rain."
        }
      ],
      "proTip": "Pro Tip Day 32: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d32-q1",
        "question": "Which sentence demonstrates correct Day 32 English usage?",
        "options": [
          "While I was driving home, it started to rain heavily.",
          "While I drove home, it was starting to rain.",
          "Option 3 with grammatical error on Day 32.",
          "Option 4 with wrong verb tense on Day 32."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 32.",
        "grammaticalRole": "Target Structure for Day 32"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 32 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "While I was driving home, it started to rain heavily.",
          "wordPool": [
            "While",
            "I",
            "was",
            "driving",
            "home",
            "it",
            "started",
            "to",
            "rain",
            "heavily"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 32."
        }
      ]
    }
  },
  {
    "id": "day-33",
    "dayNumber": 33,
    "monthNumber": 2,
    "title": "Used To vs. Would vs. Be Used To (Past Habits vs Adaptation)",
    "category": "grammar",
    "level": "intermediate",
    "description": "Distinguish past discontinued habits (used to/would) from current familiarity (be used to + -ing).",
    "xpReward": 65,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "\"Used to\" describes past habits or states that no longer exist. \"Would\" describes repeated past actions (not states). \"Be used to + noun/-ing\" means accustomed to.",
      "rules": [
        {
          "rule": "Never use \"would\" for past stative situations (e.g. \"I used to live in Paris\", NOT \"I would live in Paris\").",
          "why": "\"Would\" requires dynamic action verbs when conveying past habitual behavior.",
          "example": "I used to live in London, but now I am used to living in New York.",
          "wrongExample": "I would live in London, but now I am used to live in New York."
        }
      ],
      "wordExplanations": [
        {
          "word": "is used to working",
          "role": "Accustomed State Structure",
          "whyUsed": "\"Be used to\" takes gerund or noun."
        }
      ],
      "proTip": "Pro Tip Day 33: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d33-q1",
        "question": "Which sentence demonstrates correct Day 33 English usage?",
        "options": [
          "I used to live in London, but now I am used to living in New York.",
          "I would live in London, but now I am used to live in New York.",
          "Option 3 with grammatical error on Day 33.",
          "Option 4 with wrong verb tense on Day 33."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 33.",
        "grammaticalRole": "Target Structure for Day 33"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 33 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "I used to live in London, but now I am used to living in New York.",
          "wordPool": [
            "I",
            "used",
            "to",
            "live",
            "in",
            "London",
            "but",
            "now",
            "I",
            "am",
            "used",
            "to",
            "living",
            "in",
            "New",
            "York"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 33."
        }
      ]
    }
  },
  {
    "id": "day-34",
    "dayNumber": 34,
    "monthNumber": 2,
    "title": "Present Perfect Simple: Connection Between Past and Present",
    "category": "tenses",
    "level": "intermediate",
    "description": "Connect past experiences and recent results to the present moment without specific past dates.",
    "xpReward": 70,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Present Perfect Simple (have/has + past participle) links past events to present context. Use it for life experiences (ever/never), recent results, or ongoing time periods.",
      "rules": [
        {
          "rule": "Never use specific finished time words (yesterday, in 2015, two days ago) with Present Perfect.",
          "why": "Present Perfect requires an open or present-connected time window.",
          "example": "I have visited Japan three times. / She has just finished the report.",
          "wrongExample": "I have visited Japan in 2018."
        }
      ],
      "wordExplanations": [
        {
          "word": "has finished",
          "role": "Present Perfect Verb",
          "whyUsed": "Connects completed past action to present result."
        }
      ],
      "proTip": "Pro Tip Day 34: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d34-q1",
        "question": "Which sentence demonstrates correct Day 34 English usage?",
        "options": [
          "I have visited Japan three times.",
          "I have visited Japan in 2018.",
          "Option 3 with grammatical error on Day 34.",
          "Option 4 with wrong verb tense on Day 34."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 34.",
        "grammaticalRole": "Target Structure for Day 34"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 34 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "I have visited Japan three times.",
          "wordPool": [
            "I",
            "have",
            "visited",
            "Japan",
            "three",
            "times"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 34."
        }
      ]
    }
  },
  {
    "id": "day-35",
    "dayNumber": 35,
    "monthNumber": 2,
    "title": "Present Perfect vs. Past Simple: Why Timeframe Changes Everything",
    "category": "tenses",
    "level": "intermediate",
    "description": "Master the contrast between finished past timeframes and open/present timeframes.",
    "xpReward": 50,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Choose Past Simple for finished time periods (yesterday, last year). Choose Present Perfect for unfinished time periods (today, this week, in my life) or present results.",
      "rules": [
        {
          "rule": "Ask yourself: \"Is the timeframe finished or still open?\" Finished = Past Simple. Open = Present Perfect.",
          "why": "Timeframe status determines grammatical tense choice in English.",
          "example": "I drank two coffees this morning (now it's afternoon). / I have drunk two coffees today (day still open).",
          "wrongExample": "I have drunk two coffees yesterday."
        }
      ],
      "wordExplanations": [
        {
          "word": "have drunk vs drank",
          "role": "Tense Timeframe Contrast",
          "whyUsed": "Unfinished vs finished timeframe."
        }
      ],
      "proTip": "Pro Tip Day 35: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d35-q1",
        "question": "Which sentence demonstrates correct Day 35 English usage?",
        "options": [
          "I drank two coffees this morning (now it's afternoon).",
          "I have drunk two coffees yesterday.",
          "Option 3 with grammatical error on Day 35.",
          "Option 4 with wrong verb tense on Day 35."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 35.",
        "grammaticalRole": "Target Structure for Day 35"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 35 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "I drank two coffees this morning (now it's afternoon).",
          "wordPool": [
            "I",
            "drank",
            "two",
            "coffees",
            "this",
            "morning",
            "(now",
            "it's",
            "afternoon)"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 35."
        }
      ]
    }
  },
  {
    "id": "day-36",
    "dayNumber": 36,
    "monthNumber": 2,
    "title": "Present Perfect Continuous: Ongoing Duration & Recent Results",
    "category": "tenses",
    "level": "intermediate",
    "description": "Focus on duration (for/since) and recent continuous activity using have/has been -ing.",
    "xpReward": 55,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Present Perfect Continuous emphasizes the ongoing duration or physical side-effects of an activity starting in the past and continuing up to or near the present.",
      "rules": [
        {
          "rule": "Use \"for\" with duration lengths (for 3 hours); use \"since\" with starting time points (since 9 AM).",
          "why": "\"For\" quantifies period length, while \"since\" anchors to an origin timestamp.",
          "example": "She has been studying English for five years.",
          "wrongExample": "She has been studying English since five years."
        }
      ],
      "wordExplanations": [
        {
          "word": "for five years",
          "role": "Duration Preposition",
          "whyUsed": "\"For\" marks time duration."
        }
      ],
      "proTip": "Pro Tip Day 36: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d36-q1",
        "question": "Which sentence demonstrates correct Day 36 English usage?",
        "options": [
          "She has been studying English for five years.",
          "She has been studying English since five years.",
          "Option 3 with grammatical error on Day 36.",
          "Option 4 with wrong verb tense on Day 36."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 36.",
        "grammaticalRole": "Target Structure for Day 36"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 36 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "She has been studying English for five years.",
          "wordPool": [
            "She",
            "has",
            "been",
            "studying",
            "English",
            "for",
            "five",
            "years"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 36."
        }
      ]
    }
  },
  {
    "id": "day-37",
    "dayNumber": 37,
    "monthNumber": 2,
    "title": "Past Perfect Simple: The \"Past of the Past\" Sequence",
    "category": "tenses",
    "level": "intermediate",
    "description": "Clarify narrative timelines by marking the earlier of two past events with had + past participle.",
    "xpReward": 60,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "When discussing two past events, the Past Perfect (had + past participle) marks the event that happened first, while the Past Simple marks the later event.",
      "rules": [
        {
          "rule": "Use Past Perfect only when necessary to prevent ambiguity in past chronological sequence.",
          "why": "Past Perfect establishes explicit antecedent priority in narrative time.",
          "example": "When we arrived at the restaurant, our team had already ordered dinner.",
          "wrongExample": "When we arrived at the restaurant, our team already ordered dinner."
        }
      ],
      "wordExplanations": [
        {
          "word": "had ordered",
          "role": "Past Perfect Verb",
          "whyUsed": "Action occurred prior to \"arrived\"."
        }
      ],
      "proTip": "Pro Tip Day 37: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d37-q1",
        "question": "Which sentence demonstrates correct Day 37 English usage?",
        "options": [
          "When we arrived at the restaurant, our team had already ordered dinner.",
          "When we arrived at the restaurant, our team already ordered dinner.",
          "Option 3 with grammatical error on Day 37.",
          "Option 4 with wrong verb tense on Day 37."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 37.",
        "grammaticalRole": "Target Structure for Day 37"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 37 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "When we arrived at the restaurant, our team had already ordered dinner.",
          "wordPool": [
            "When",
            "we",
            "arrived",
            "at",
            "the",
            "restaurant",
            "our",
            "team",
            "had",
            "already",
            "ordered",
            "dinner"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 37."
        }
      ]
    }
  },
  {
    "id": "day-38",
    "dayNumber": 38,
    "monthNumber": 2,
    "title": "Past Perfect Continuous: Duration Before a Past Point",
    "category": "tenses",
    "level": "intermediate",
    "description": "Describe continuous ongoing duration prior to a specific moment in the past.",
    "xpReward": 65,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Past Perfect Continuous (had been + -ing) focuses on the duration of an ongoing process that was taking place before another past milestone.",
      "rules": [
        {
          "rule": "Emphasize how long an action had been continuing before a past interruption.",
          "why": "Combines continuous duration with antecedent past timeframe.",
          "example": "They had been negotiating for three hours before reaching an agreement.",
          "wrongExample": "They were negotiating for three hours before they reached agreement."
        }
      ],
      "wordExplanations": [
        {
          "word": "had been negotiating",
          "role": "Past Perfect Continuous",
          "whyUsed": "Emphasizes continuous duration prior to agreement."
        }
      ],
      "proTip": "Pro Tip Day 38: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d38-q1",
        "question": "Which sentence demonstrates correct Day 38 English usage?",
        "options": [
          "They had been negotiating for three hours before reaching an agreement.",
          "They were negotiating for three hours before they reached agreement.",
          "Option 3 with grammatical error on Day 38.",
          "Option 4 with wrong verb tense on Day 38."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 38.",
        "grammaticalRole": "Target Structure for Day 38"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 38 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "They had been negotiating for three hours before reaching an agreement.",
          "wordPool": [
            "They",
            "had",
            "been",
            "negotiating",
            "for",
            "three",
            "hours",
            "before",
            "reaching",
            "an",
            "agreement"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 38."
        }
      ]
    }
  },
  {
    "id": "day-39",
    "dayNumber": 39,
    "monthNumber": 2,
    "title": "Future Forms 1: Will vs. Be Going To (Predictions vs Intentions)",
    "category": "tenses",
    "level": "intermediate",
    "description": "Distinguish instant decisions/spontaneous offers (will) from prior plans/evidence (going to).",
    "xpReward": 70,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Use \"will\" for spontaneous choices made now, offers, and promises. Use \"be going to\" for pre-planned intentions or predictions based on clear visual evidence right now.",
      "rules": [
        {
          "rule": "Choose \"will\" for instant decisions made at the moment of speaking.",
          "why": "\"Will\" expresses modal willingness or spontaneous commitment.",
          "example": "Look at those dark clouds! It is going to rain. / I'll help you carry that bag.",
          "wrongExample": "Look at dark clouds! It will rain right now."
        }
      ],
      "wordExplanations": [
        {
          "word": "is going to rain",
          "role": "Evidence-Based Future Form",
          "whyUsed": "Based on present visual evidence (dark clouds)."
        }
      ],
      "proTip": "Pro Tip Day 39: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d39-q1",
        "question": "Which sentence demonstrates correct Day 39 English usage?",
        "options": [
          "Look at those dark clouds! It is going to rain.",
          "Look at dark clouds! It will rain right now.",
          "Option 3 with grammatical error on Day 39.",
          "Option 4 with wrong verb tense on Day 39."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 39.",
        "grammaticalRole": "Target Structure for Day 39"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 39 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Look at those dark clouds! It is going to rain.",
          "wordPool": [
            "Look",
            "at",
            "those",
            "dark",
            "clouds",
            "It",
            "is",
            "going",
            "to",
            "rain"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 39."
        }
      ]
    }
  },
  {
    "id": "day-40",
    "dayNumber": 40,
    "monthNumber": 2,
    "title": "Future Forms 2: Present Continuous & Present Simple for Scheduled Futures",
    "category": "tenses",
    "level": "intermediate",
    "description": "Express fixed social arrangements (Present Continuous) and official timetables (Present Simple).",
    "xpReward": 50,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Present Continuous expresses fixed personal arrangements (I am meeting Sarah tomorrow). Present Simple expresses official schedules and timetables (The flight departs at 8 PM).",
      "rules": [
        {
          "rule": "Use Present Simple for public schedules, train times, and official flight timetables.",
          "why": "Official timetables are treated as fixed universal facts.",
          "example": "My train leaves at 6:30 AM tomorrow. / I am dining with the client tonight.",
          "wrongExample": "My train will be leaving at 6:30 AM tomorrow on the official poster."
        }
      ],
      "wordExplanations": [
        {
          "word": "leaves",
          "role": "Scheduled Future Present Simple",
          "whyUsed": "Official timetable event."
        }
      ],
      "proTip": "Pro Tip Day 40: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d40-q1",
        "question": "Which sentence demonstrates correct Day 40 English usage?",
        "options": [
          "My train leaves at 6:30 AM tomorrow.",
          "My train will be leaving at 6:30 AM tomorrow on the official poster.",
          "Option 3 with grammatical error on Day 40.",
          "Option 4 with wrong verb tense on Day 40."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 40.",
        "grammaticalRole": "Target Structure for Day 40"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 40 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "My train leaves at 6:30 AM tomorrow.",
          "wordPool": [
            "My",
            "train",
            "leaves",
            "at",
            "6:30",
            "AM",
            "tomorrow"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 40."
        }
      ]
    }
  },
  {
    "id": "day-41",
    "dayNumber": 41,
    "monthNumber": 2,
    "title": "Future Continuous: Actions in Progress at a Future Moment",
    "category": "tenses",
    "level": "intermediate",
    "description": "Describe what will be actively happening at a specific time in the future.",
    "xpReward": 55,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Future Continuous (will be + -ing) projects into the future and views an action as actively in progress at a specific target time.",
      "rules": [
        {
          "rule": "Use Future Continuous for polite inquiries about future plans or actions in progress at a specific future hour.",
          "why": "Focuses on ongoing state at a designated future timestamp.",
          "example": "This time tomorrow, I will be flying to London.",
          "wrongExample": "This time tomorrow, I will fly to London in the air."
        }
      ],
      "wordExplanations": [
        {
          "word": "will be flying",
          "role": "Future Continuous Verb",
          "whyUsed": "Action in progress at specific future moment."
        }
      ],
      "proTip": "Pro Tip Day 41: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d41-q1",
        "question": "Which sentence demonstrates correct Day 41 English usage?",
        "options": [
          "This time tomorrow, I will be flying to London.",
          "This time tomorrow, I will fly to London in the air.",
          "Option 3 with grammatical error on Day 41.",
          "Option 4 with wrong verb tense on Day 41."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 41.",
        "grammaticalRole": "Target Structure for Day 41"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 41 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "This time tomorrow, I will be flying to London.",
          "wordPool": [
            "This",
            "time",
            "tomorrow",
            "I",
            "will",
            "be",
            "flying",
            "to",
            "London"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 41."
        }
      ]
    }
  },
  {
    "id": "day-42",
    "dayNumber": 42,
    "monthNumber": 2,
    "title": "Future Perfect & Future Perfect Continuous (By the time...)",
    "category": "tenses",
    "level": "intermediate",
    "description": "Project past completion relative to a future deadline using \"by\" or \"by the time\".",
    "xpReward": 60,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Future Perfect (will have + past participle) states that an action will be completed before a future deadline. Future Perfect Continuous measures duration up to that future point.",
      "rules": [
        {
          "rule": "Use \"by\" or \"by the time\" to set the future boundary for Future Perfect.",
          "why": "\"By\" creates a deadline prior to which completion occurs.",
          "example": "By next month, we will have completed the software deployment.",
          "wrongExample": "By next month, we will complete the software deployment already."
        }
      ],
      "wordExplanations": [
        {
          "word": "will have completed",
          "role": "Future Perfect Verb",
          "whyUsed": "Action completed prior to future deadline."
        }
      ],
      "proTip": "Pro Tip Day 42: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d42-q1",
        "question": "Which sentence demonstrates correct Day 42 English usage?",
        "options": [
          "By next month, we will have completed the software deployment.",
          "By next month, we will complete the software deployment already.",
          "Option 3 with grammatical error on Day 42.",
          "Option 4 with wrong verb tense on Day 42."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 42.",
        "grammaticalRole": "Target Structure for Day 42"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 42 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "By next month, we will have completed the software deployment.",
          "wordPool": [
            "By",
            "next",
            "month",
            "we",
            "will",
            "have",
            "completed",
            "the",
            "software",
            "deployment"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 42."
        }
      ]
    }
  },
  {
    "id": "day-43",
    "dayNumber": 43,
    "monthNumber": 2,
    "title": "Workplace & Office Vocabulary (Colleagues, Deadlines, Deliverables)",
    "category": "vocabulary",
    "level": "intermediate",
    "description": "Master essential professional corporate terminology for daily business interactions.",
    "xpReward": 65,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Corporate fluency relies on key terms like \"deliverable\", \"milestone\", \"stakeholder\", \"bandwidth\", \"meet a deadline\", and \"spearhead a project\".",
      "rules": [
        {
          "rule": "Use standard corporate collocations: \"meet a deadline\", \"extend a deadline\", \"deliver results\".",
          "why": "Native corporate register expects precise professional word pairings.",
          "example": "Our team spearheads the new marketing initiative to meet the Q3 deadline.",
          "wrongExample": "Our team makes the new marketing initiative to win the deadline."
        }
      ],
      "wordExplanations": [
        {
          "word": "spearhead",
          "role": "Corporate Action Verb",
          "whyUsed": "Means to lead an initiative or movement."
        }
      ],
      "proTip": "Pro Tip Day 43: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d43-q1",
        "question": "Which sentence demonstrates correct Day 43 English usage?",
        "options": [
          "Our team spearheads the new marketing initiative to meet the Q3 deadline.",
          "Our team makes the new marketing initiative to win the deadline.",
          "Option 3 with grammatical error on Day 43.",
          "Option 4 with wrong verb tense on Day 43."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 43.",
        "grammaticalRole": "Target Structure for Day 43"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 43 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Our team spearheads the new marketing initiative to meet the Q3 deadline.",
          "wordPool": [
            "Our",
            "team",
            "spearheads",
            "the",
            "new",
            "marketing",
            "initiative",
            "to",
            "meet",
            "the",
            "Q3",
            "deadline"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 43."
        }
      ]
    }
  },
  {
    "id": "day-44",
    "dayNumber": 44,
    "monthNumber": 2,
    "title": "Phrasal Verbs 1: Separable vs Inseparable Daily Phrasal Verbs",
    "category": "idioms",
    "level": "intermediate",
    "description": "Master object pronoun rules with separable phrasal verbs.",
    "xpReward": 70,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Separable phrasal verbs can place noun objects between or after verb and particle (turn on the light / turn the light on). BUT if the object is a pronoun, it MUST go in the middle (turn it on)!",
      "rules": [
        {
          "rule": "If the object of a separable phrasal verb is a pronoun (it, them, him, her), place it BETWEEN the verb and particle.",
          "why": "Pronouns are unstressed elements requiring medial positioning in phrasal verbs.",
          "example": "Turn off the lights. -> Turn them off.",
          "wrongExample": "Turn off them."
        }
      ],
      "wordExplanations": [
        {
          "word": "turn them off",
          "role": "Separable Phrasal Verb with Pronoun",
          "whyUsed": "Pronoun must split separable phrasal verb."
        }
      ],
      "proTip": "Pro Tip Day 44: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d44-q1",
        "question": "Which sentence demonstrates correct Day 44 English usage?",
        "options": [
          "Turn off the lights. -> Turn them off.",
          "Turn off them.",
          "Option 3 with grammatical error on Day 44.",
          "Option 4 with wrong verb tense on Day 44."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 44.",
        "grammaticalRole": "Target Structure for Day 44"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 44 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Turn off the lights. -> Turn them off.",
          "wordPool": [
            "Turn",
            "off",
            "the",
            "lights",
            "->",
            "Turn",
            "them",
            "off"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 44."
        }
      ]
    }
  },
  {
    "id": "day-45",
    "dayNumber": 45,
    "monthNumber": 2,
    "title": "Past Continuous & Past Perfect: Connecting Past Timelines",
    "category": "tenses",
    "level": "intermediate",
    "description": "Weave complex narrative threads combining background, interrupted, and prior past events.",
    "xpReward": 50,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Combining Past Simple, Past Continuous, and Past Perfect creates rich, professional narrative cohesion in case studies, incident reports, and stories.",
      "rules": [
        {
          "rule": "Establish background (Past Continuous), mark prior history (Past Perfect), and track primary events (Past Simple).",
          "why": "Multi-layered past tenses give structural depth to analytical reporting.",
          "example": "While the team was investigating the system error, they discovered that someone had altered the server config.",
          "wrongExample": "While team investigated error, they discover someone altered server config."
        }
      ],
      "wordExplanations": [
        {
          "word": "was investigating ... had altered",
          "role": "Multi-Tense Narrative Structure",
          "whyUsed": "Connects ongoing background with earlier past event."
        }
      ],
      "proTip": "Pro Tip Day 45: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d45-q1",
        "question": "Which sentence demonstrates correct Day 45 English usage?",
        "options": [
          "While the team was investigating the system error, they discovered that someone had altered the server config.",
          "While team investigated error, they discover someone altered server config.",
          "Option 3 with grammatical error on Day 45.",
          "Option 4 with wrong verb tense on Day 45."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 45.",
        "grammaticalRole": "Target Structure for Day 45"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 45 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "While the team was investigating the system error, they discovered that someone had altered the server config.",
          "wordPool": [
            "While",
            "the",
            "team",
            "was",
            "investigating",
            "the",
            "system",
            "error",
            "they",
            "discovered",
            "that",
            "someone",
            "had",
            "altered",
            "the",
            "server",
            "config"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 45."
        }
      ]
    }
  },
  {
    "id": "day-46",
    "dayNumber": 46,
    "monthNumber": 2,
    "title": "Phrasal Verbs 2: Business & Productivity Phrasal Verbs",
    "category": "idioms",
    "level": "intermediate",
    "description": "Learn high-frequency business phrasal verbs used in meetings and corporate communication.",
    "xpReward": 55,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Master essential business phrasal verbs: \"bring up\" (raise a topic), \"call off\" (cancel), \"put off\" (postpone), \"carry out\" (execute), and \"look into\" (investigate).",
      "rules": [
        {
          "rule": "Differentiate \"call off\" (cancel completely) from \"put off\" (delay to a later time).",
          "why": "Precise phrasal verbs prevent misunderstandings regarding project schedules.",
          "example": "We decided to put off the product launch until next month.",
          "wrongExample": "We decided to call off the launch until next month when it happens later."
        }
      ],
      "wordExplanations": [
        {
          "word": "put off",
          "role": "Business Phrasal Verb",
          "whyUsed": "Means to postpone or defer an event."
        }
      ],
      "proTip": "Pro Tip Day 46: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d46-q1",
        "question": "Which sentence demonstrates correct Day 46 English usage?",
        "options": [
          "We decided to put off the product launch until next month.",
          "We decided to call off the launch until next month when it happens later.",
          "Option 3 with grammatical error on Day 46.",
          "Option 4 with wrong verb tense on Day 46."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 46.",
        "grammaticalRole": "Target Structure for Day 46"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 46 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "We decided to put off the product launch until next month.",
          "wordPool": [
            "We",
            "decided",
            "to",
            "put",
            "off",
            "the",
            "product",
            "launch",
            "until",
            "next",
            "month"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 46."
        }
      ]
    }
  },
  {
    "id": "day-47",
    "dayNumber": 47,
    "monthNumber": 2,
    "title": "Modal Verbs of Deduction: Must be, Can't be, Might be",
    "category": "grammar",
    "level": "intermediate",
    "description": "Express logical deductions about present situations based on evidence.",
    "xpReward": 60,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Use \"must be\" when 99% sure something is true. Use \"can't be\" when 99% sure something is impossible. Use \"might / could / may be\" when uncertain.",
      "rules": [
        {
          "rule": "Never use \"mustn't be\" for negative logical deduction; use \"can't be\".",
          "why": "\"Mustn't\" expresses prohibition, while \"can't\" expresses impossibility.",
          "example": "He has worked for 14 hours; he must be exhausted. That can't be true!",
          "wrongExample": "He has worked 14 hours; he mustn't be tired."
        }
      ],
      "wordExplanations": [
        {
          "word": "must be",
          "role": "Positive Logical Deduction Modal",
          "whyUsed": "High probability deduction based on evidence."
        }
      ],
      "proTip": "Pro Tip Day 47: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d47-q1",
        "question": "Which sentence demonstrates correct Day 47 English usage?",
        "options": [
          "He has worked for 14 hours; he must be exhausted. That can't be true!",
          "He has worked 14 hours; he mustn't be tired.",
          "Option 3 with grammatical error on Day 47.",
          "Option 4 with wrong verb tense on Day 47."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 47.",
        "grammaticalRole": "Target Structure for Day 47"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 47 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "He has worked for 14 hours; he must be exhausted. That can't be true!",
          "wordPool": [
            "He",
            "has",
            "worked",
            "for",
            "14",
            "hours;",
            "he",
            "must",
            "be",
            "exhausted",
            "That",
            "can't",
            "be",
            "true"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 47."
        }
      ]
    }
  },
  {
    "id": "day-48",
    "dayNumber": 48,
    "monthNumber": 2,
    "title": "Past Modals of Deduction & Regret: Should have, Must have, Might have",
    "category": "grammar",
    "level": "intermediate",
    "description": "Evaluate past events, speculate on causes, and express constructive past regrets.",
    "xpReward": 65,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Past modals add \"have + past participle\": \"must have done\" (certain past deduction), \"can't have done\" (past impossibility), \"should have done\" (past regret/critique).",
      "rules": [
        {
          "rule": "Use \"should have + past participle\" to express advice or regret about a past mistake.",
          "why": "Evaluates past choices from present hindsight vantage point.",
          "example": "We should have double-checked the contract before signing.",
          "wrongExample": "We should double-check the contract yesterday."
        }
      ],
      "wordExplanations": [
        {
          "word": "should have checked",
          "role": "Past Modal of Regret",
          "whyUsed": "Expresses past recommendation missed."
        }
      ],
      "proTip": "Pro Tip Day 48: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d48-q1",
        "question": "Which sentence demonstrates correct Day 48 English usage?",
        "options": [
          "We should have double-checked the contract before signing.",
          "We should double-check the contract yesterday.",
          "Option 3 with grammatical error on Day 48.",
          "Option 4 with wrong verb tense on Day 48."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 48.",
        "grammaticalRole": "Target Structure for Day 48"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 48 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "We should have double-checked the contract before signing.",
          "wordPool": [
            "We",
            "should",
            "have",
            "double-checked",
            "the",
            "contract",
            "before",
            "signing"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 48."
        }
      ]
    }
  },
  {
    "id": "day-49",
    "dayNumber": 49,
    "monthNumber": 2,
    "title": "Passive Voice 1: Present & Past Passive (Focus on Action Over Agent)",
    "category": "grammar",
    "level": "intermediate",
    "description": "Shift focus from subject actor to the receiver or result of an action.",
    "xpReward": 70,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Passive voice (form of \"be\" + past participle) places the object/result in subject position. Use it when the actor is unknown, obvious, or less important than the action itself.",
      "rules": [
        {
          "rule": "Invert object to subject position and add appropriate tense form of \"be\" + past participle.",
          "why": "Shifts thematic focus to the outcome or recipient.",
          "example": "Active: Millions of people read the report. Passive: The report was read by millions.",
          "wrongExample": "The report was readed by millions."
        }
      ],
      "wordExplanations": [
        {
          "word": "was read",
          "role": "Past Passive Verb",
          "whyUsed": "Passive voice with irregular past participle."
        }
      ],
      "proTip": "Pro Tip Day 49: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d49-q1",
        "question": "Which sentence demonstrates correct Day 49 English usage?",
        "options": [
          "Active: Millions of people read the report. Passive: The report was read by millions.",
          "The report was readed by millions.",
          "Option 3 with grammatical error on Day 49.",
          "Option 4 with wrong verb tense on Day 49."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 49.",
        "grammaticalRole": "Target Structure for Day 49"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 49 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Active: Millions of people read the report. Passive: The report was read by millions.",
          "wordPool": [
            "Active:",
            "Millions",
            "of",
            "people",
            "read",
            "the",
            "report",
            "Passive:",
            "The",
            "report",
            "was",
            "read",
            "by",
            "millions"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 49."
        }
      ]
    }
  },
  {
    "id": "day-50",
    "dayNumber": 50,
    "monthNumber": 2,
    "title": "Passive Voice 2: Modals & Continuous Passives in Formal Contexts",
    "category": "grammar",
    "level": "intermediate",
    "description": "Form continuous passives (is being done) and modal passives (must be submitted).",
    "xpReward": 50,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Modal Passive: Modal + be + past participle (Must be completed). Present Continuous Passive: is/are being + past participle (The system is being updated).",
      "rules": [
        {
          "rule": "Insert \"being\" between form of \"be\" and past participle for continuous passive actions.",
          "why": "\"Being\" preserves ongoing continuous aspect in passive construction.",
          "example": "The website is currently being updated. All applications must be submitted online.",
          "wrongExample": "The website is currently updating by developers."
        }
      ],
      "wordExplanations": [
        {
          "word": "is being updated",
          "role": "Continuous Passive Verb",
          "whyUsed": "Action in progress currently done to subject."
        }
      ],
      "proTip": "Pro Tip Day 50: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d50-q1",
        "question": "Which sentence demonstrates correct Day 50 English usage?",
        "options": [
          "The website is currently being updated. All applications must be submitted online.",
          "The website is currently updating by developers.",
          "Option 3 with grammatical error on Day 50.",
          "Option 4 with wrong verb tense on Day 50."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 50.",
        "grammaticalRole": "Target Structure for Day 50"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 50 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "The website is currently being updated. All applications must be submitted online.",
          "wordPool": [
            "The",
            "website",
            "is",
            "currently",
            "being",
            "updated",
            "All",
            "applications",
            "must",
            "be",
            "submitted",
            "online"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 50."
        }
      ]
    }
  },
  {
    "id": "day-51",
    "dayNumber": 51,
    "monthNumber": 2,
    "title": "Relative Clauses 1: Defining Relative Clauses (Who, Which, That, Whose)",
    "category": "grammar",
    "level": "intermediate",
    "description": "Identify essential defining information about people, things, and possessions without commas.",
    "xpReward": 55,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Defining relative clauses specify which exact person or thing is being discussed. They do NOT use commas. \"Who\" for people, \"which\" for things, \"that\" for both, \"whose\" for possession.",
      "rules": [
        {
          "rule": "Omit relative pronoun (who/which/that) if it functions as the object of the relative clause.",
          "why": "Object relative pronoun drop streamlines spoken and written syntax.",
          "example": "The candidate whom we interviewed yesterday was exceptional. (or: The candidate we interviewed...)",
          "wrongExample": "The candidate, that we interviewed, was exceptional."
        }
      ],
      "wordExplanations": [
        {
          "word": "whose report",
          "role": "Possessive Relative Pronoun",
          "whyUsed": "\"Whose\" replaces possessive pronoun in relative clause."
        }
      ],
      "proTip": "Pro Tip Day 51: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d51-q1",
        "question": "Which sentence demonstrates correct Day 51 English usage?",
        "options": [
          "The candidate whom we interviewed yesterday was exceptional. (or: The candidate we interviewed...)",
          "The candidate, that we interviewed, was exceptional.",
          "Option 3 with grammatical error on Day 51.",
          "Option 4 with wrong verb tense on Day 51."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 51.",
        "grammaticalRole": "Target Structure for Day 51"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 51 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "The candidate whom we interviewed yesterday was exceptional. (or: The candidate we interviewed...)",
          "wordPool": [
            "The",
            "candidate",
            "whom",
            "we",
            "interviewed",
            "yesterday",
            "was",
            "exceptional",
            "(or:",
            "The",
            "candidate",
            "we",
            "interviewed)"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 51."
        }
      ]
    }
  },
  {
    "id": "day-52",
    "dayNumber": 52,
    "monthNumber": 2,
    "title": "Relative Clauses 2: Non-Defining Extra Info Clauses with Commas",
    "category": "grammar",
    "level": "intermediate",
    "description": "Add non-essential background information enclosed in commas using who and which.",
    "xpReward": 60,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Non-defining relative clauses provide extra, non-essential information. You MUST use commas around them, and you CANNOT use \"that\" instead of \"who/which\"!",
      "rules": [
        {
          "rule": "Never use \"that\" in a non-defining relative clause enclosed by commas.",
          "why": "\"That\" is restricted to defining restrictive clauses in standard written English.",
          "example": "Our head office, which was built in 2010, is powered by solar energy.",
          "wrongExample": "Our head office, that was built in 2010, is powered by solar energy."
        }
      ],
      "wordExplanations": [
        {
          "word": ", which was built ,",
          "role": "Non-Defining Relative Clause",
          "whyUsed": "Extra non-essential info enclosed in commas."
        }
      ],
      "proTip": "Pro Tip Day 52: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d52-q1",
        "question": "Which sentence demonstrates correct Day 52 English usage?",
        "options": [
          "Our head office, which was built in 2010, is powered by solar energy.",
          "Our head office, that was built in 2010, is powered by solar energy.",
          "Option 3 with grammatical error on Day 52.",
          "Option 4 with wrong verb tense on Day 52."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 52.",
        "grammaticalRole": "Target Structure for Day 52"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 52 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Our head office, which was built in 2010, is powered by solar energy.",
          "wordPool": [
            "Our",
            "head",
            "office",
            "which",
            "was",
            "built",
            "in",
            "2010",
            "is",
            "powered",
            "by",
            "solar",
            "energy"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 52."
        }
      ]
    }
  },
  {
    "id": "day-53",
    "dayNumber": 53,
    "monthNumber": 2,
    "title": "Cause & Effect Connectors (Due to, Owing to, Consequently, As a result)",
    "category": "pro_syntax",
    "level": "intermediate",
    "description": "Connect causes and consequences elegantly in professional and academic writing.",
    "xpReward": 65,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Express causality gracefully: \"Due to / Owing to + Noun Phrase\", \"Because of + Noun Phrase\", \"Consequently / Therefore / As a result + Independent Clause\".",
      "rules": [
        {
          "rule": "Use \"due to\" followed by a noun phrase or gerund, NEVER directly followed by a subject + verb clause.",
          "why": "\"Due to\" functions as a prepositional phrase taking a noun complement.",
          "example": "Due to severe weather, the flight was delayed. Consequently, we missed our connection.",
          "wrongExample": "Due to it was raining, the flight was delayed."
        }
      ],
      "wordExplanations": [
        {
          "word": "Due to severe weather",
          "role": "Prepositional Cause Connector",
          "whyUsed": "Followed by noun phrase."
        }
      ],
      "proTip": "Pro Tip Day 53: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d53-q1",
        "question": "Which sentence demonstrates correct Day 53 English usage?",
        "options": [
          "Due to severe weather, the flight was delayed. Consequently, we missed our connection.",
          "Due to it was raining, the flight was delayed.",
          "Option 3 with grammatical error on Day 53.",
          "Option 4 with wrong verb tense on Day 53."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 53.",
        "grammaticalRole": "Target Structure for Day 53"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 53 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Due to severe weather, the flight was delayed. Consequently, we missed our connection.",
          "wordPool": [
            "Due",
            "to",
            "severe",
            "weather",
            "the",
            "flight",
            "was",
            "delayed",
            "Consequently",
            "we",
            "missed",
            "our",
            "connection"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 53."
        }
      ]
    }
  },
  {
    "id": "day-54",
    "dayNumber": 54,
    "monthNumber": 2,
    "title": "Technology, Software & Digital Vocabulary",
    "category": "vocabulary",
    "level": "intermediate",
    "description": "Master digital transformations, cloud computing, AI, and cybersecurity terminology.",
    "xpReward": 70,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Modern digital communication requires terms like \"user interface\", \"backend integration\", \"encryption\", \"seamless workflow\", \"data privacy\", and \"scalability\".",
      "rules": [
        {
          "rule": "Use industry collocations: \"deploy software\", \"scale infrastructure\", \"ensure data compliance\".",
          "why": "Accurate tech jargon demonstrates domain expertise.",
          "example": "We deployed cloud infrastructure to ensure seamless scalability and data privacy.",
          "wrongExample": "We made tech bigger to make software fast."
        }
      ],
      "wordExplanations": [
        {
          "word": "scalability",
          "role": "Tech Industry Term",
          "whyUsed": "Refers to ability of system to handle growing workload."
        }
      ],
      "proTip": "Pro Tip Day 54: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d54-q1",
        "question": "Which sentence demonstrates correct Day 54 English usage?",
        "options": [
          "We deployed cloud infrastructure to ensure seamless scalability and data privacy.",
          "We made tech bigger to make software fast.",
          "Option 3 with grammatical error on Day 54.",
          "Option 4 with wrong verb tense on Day 54."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 54.",
        "grammaticalRole": "Target Structure for Day 54"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 54 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "We deployed cloud infrastructure to ensure seamless scalability and data privacy.",
          "wordPool": [
            "We",
            "deployed",
            "cloud",
            "infrastructure",
            "to",
            "ensure",
            "seamless",
            "scalability",
            "and",
            "data",
            "privacy"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 54."
        }
      ]
    }
  },
  {
    "id": "day-55",
    "dayNumber": 55,
    "monthNumber": 2,
    "title": "Future Nuances: Will vs Going To vs Present Continuous",
    "category": "tenses",
    "level": "intermediate",
    "description": "Fine-tune subtle future intentionality across professional and conversational scenarios.",
    "xpReward": 50,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Review future nuances: \"will\" (spontaneous/promise), \"be going to\" (intention/evidence), \"present continuous\" (fixed calendar appointment with other people).",
      "rules": [
        {
          "rule": "Use Present Continuous for fixed calendar appointments with named third parties.",
          "why": "Confirms mutually agreed calendar commitment.",
          "example": "I am meeting the CEO at 3 PM. I am going to prepare the slides now.",
          "wrongExample": "I will meet CEO at 3 PM on my printed calendar."
        }
      ],
      "wordExplanations": [
        {
          "word": "am meeting",
          "role": "Fixed Appointment Present Continuous",
          "whyUsed": "Fixed third-party arrangement."
        }
      ],
      "proTip": "Pro Tip Day 55: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d55-q1",
        "question": "Which sentence demonstrates correct Day 55 English usage?",
        "options": [
          "I am meeting the CEO at 3 PM. I am going to prepare the slides now.",
          "I will meet CEO at 3 PM on my printed calendar.",
          "Option 3 with grammatical error on Day 55.",
          "Option 4 with wrong verb tense on Day 55."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 55.",
        "grammaticalRole": "Target Structure for Day 55"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 55 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "I am meeting the CEO at 3 PM. I am going to prepare the slides now.",
          "wordPool": [
            "I",
            "am",
            "meeting",
            "the",
            "CEO",
            "at",
            "3",
            "PM",
            "I",
            "am",
            "going",
            "to",
            "prepare",
            "the",
            "slides",
            "now"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 55."
        }
      ]
    }
  },
  {
    "id": "day-56",
    "dayNumber": 56,
    "monthNumber": 2,
    "title": "Contrast & Concession (Despite, In spite of, Even though, However)",
    "category": "pro_syntax",
    "level": "intermediate",
    "description": "Link opposing ideas smoothly using correct prepositions and conjunctions.",
    "xpReward": 55,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "\"Even though / Although + Subject + Verb\". \"Despite / In spite of + Noun Phrase / Gerund\". \"However\" opens a new sentence followed by a comma.",
      "rules": [
        {
          "rule": "Never say \"despite of\". Use either \"despite\" OR \"in spite of\".",
          "why": "\"Despite\" is a single-word preposition that rejects \"of\".",
          "example": "Despite the delayed shipment, customer satisfaction remained high.",
          "wrongExample": "Despite of the delayed shipment, satisfaction remained high."
        }
      ],
      "wordExplanations": [
        {
          "word": "Despite the delay",
          "role": "Concession Preposition",
          "whyUsed": "Followed by noun phrase without \"of\"."
        }
      ],
      "proTip": "Pro Tip Day 56: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d56-q1",
        "question": "Which sentence demonstrates correct Day 56 English usage?",
        "options": [
          "Despite the delayed shipment, customer satisfaction remained high.",
          "Despite of the delayed shipment, satisfaction remained high.",
          "Option 3 with grammatical error on Day 56.",
          "Option 4 with wrong verb tense on Day 56."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 56.",
        "grammaticalRole": "Target Structure for Day 56"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 56 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Despite the delayed shipment, customer satisfaction remained high.",
          "wordPool": [
            "Despite",
            "the",
            "delayed",
            "shipment",
            "customer",
            "satisfaction",
            "remained",
            "high"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 56."
        }
      ]
    }
  },
  {
    "id": "day-57",
    "dayNumber": 57,
    "monthNumber": 2,
    "title": "Expressing Opinions & Participating in Meetings",
    "category": "conversation",
    "level": "intermediate",
    "description": "Contribute constructively, interrupt politely, and frame opinions persuasively in meetings.",
    "xpReward": 60,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Meeting phrases: \"From my perspective...\", \"I'd like to add...\", \"If I may jump in here...\", \"I see your point, but...\", and \"Could you elaborate on that?\".",
      "rules": [
        {
          "rule": "Soften interruptions with conditional phrases like \"If I may briefly add...\"",
          "why": "Pragmatic diplomatic markers maintain professional meeting harmony.",
          "example": "If I may jump in here, I believe we should also consider budget constraints.",
          "wrongExample": "Stop talking, I want to say something about money."
        }
      ],
      "wordExplanations": [
        {
          "word": "If I may jump in",
          "role": "Polite Interruption Formula",
          "whyUsed": "Standard courteous phrase to enter conversation."
        }
      ],
      "proTip": "Pro Tip Day 57: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d57-q1",
        "question": "Which sentence demonstrates correct Day 57 English usage?",
        "options": [
          "If I may jump in here, I believe we should also consider budget constraints.",
          "Stop talking, I want to say something about money.",
          "Option 3 with grammatical error on Day 57.",
          "Option 4 with wrong verb tense on Day 57."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 57.",
        "grammaticalRole": "Target Structure for Day 57"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 57 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "If I may jump in here, I believe we should also consider budget constraints.",
          "wordPool": [
            "If",
            "I",
            "may",
            "jump",
            "in",
            "here",
            "I",
            "believe",
            "we",
            "should",
            "also",
            "consider",
            "budget",
            "constraints"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 57."
        }
      ]
    }
  },
  {
    "id": "day-58",
    "dayNumber": 58,
    "monthNumber": 2,
    "title": "Professional Email Writing: Formal vs Semi-Formal Structures",
    "category": "conversation",
    "level": "intermediate",
    "description": "Structure professional emails with clear greetings, body paragraphs, and professional sign-offs.",
    "xpReward": 65,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Email hierarchy: Opening (Dear Mr. Smith / Hi Team) -> Purpose statement (I am writing regarding...) -> Call to Action -> Professional sign-off (Best regards / Sincerely).",
      "rules": [
        {
          "rule": "Match sign-offs to opening formality: \"Dear Mr. X\" -> \"Sincerely\". \"Hi Team\" -> \"Best regards\".",
          "why": "Stylistic consistency maintains professional register.",
          "example": "Dear Ms. Davis, I am writing to follow up on our recent proposal. Best regards, Alex.",
          "wrongExample": "Hey Ms Davis, I am writing to follow up. Yours faithfully, Alex."
        }
      ],
      "wordExplanations": [
        {
          "word": "I am writing regarding",
          "role": "Email Opening Statement",
          "whyUsed": "Clear statement of email purpose."
        }
      ],
      "proTip": "Pro Tip Day 58: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d58-q1",
        "question": "Which sentence demonstrates correct Day 58 English usage?",
        "options": [
          "Dear Ms. Davis, I am writing to follow up on our recent proposal. Best regards, Alex.",
          "Hey Ms Davis, I am writing to follow up. Yours faithfully, Alex.",
          "Option 3 with grammatical error on Day 58.",
          "Option 4 with wrong verb tense on Day 58."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 58.",
        "grammaticalRole": "Target Structure for Day 58"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 58 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Dear Ms. Davis, I am writing to follow up on our recent proposal. Best regards, Alex.",
          "wordPool": [
            "Dear",
            "Ms",
            "Davis",
            "I",
            "am",
            "writing",
            "to",
            "follow",
            "up",
            "on",
            "our",
            "recent",
            "proposal",
            "Best",
            "regards",
            "Alex"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 58."
        }
      ]
    }
  },
  {
    "id": "day-59",
    "dayNumber": 59,
    "monthNumber": 2,
    "title": "Health, Well-being & Medical Vocabulary",
    "category": "vocabulary",
    "level": "intermediate",
    "description": "Discuss health, symptoms, wellness practices, and medical appointments accurately.",
    "xpReward": 70,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Health terminology includes \"prescription\", \"symptoms\", \"diagnosis\", \"preventative care\", \"side effects\", and \"work-life balance\".",
      "rules": [
        {
          "rule": "Use \"have a [symptom]\" (have a headache) but \"feel [adjective]\" (feel dizzy).",
          "why": "Possession vs internal state verb distinction.",
          "example": "I have a sore throat and feel exhausted, so I booked a doctor's appointment.",
          "wrongExample": "I feel a headache and have dizzy."
        }
      ],
      "wordExplanations": [
        {
          "word": "prescription",
          "role": "Medical Vocabulary",
          "whyUsed": "Official written order for medicine."
        }
      ],
      "proTip": "Pro Tip Day 59: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d59-q1",
        "question": "Which sentence demonstrates correct Day 59 English usage?",
        "options": [
          "I have a sore throat and feel exhausted, so I booked a doctor's appointment.",
          "I feel a headache and have dizzy.",
          "Option 3 with grammatical error on Day 59.",
          "Option 4 with wrong verb tense on Day 59."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 59.",
        "grammaticalRole": "Target Structure for Day 59"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 59 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "I have a sore throat and feel exhausted, so I booked a doctor's appointment.",
          "wordPool": [
            "I",
            "have",
            "a",
            "sore",
            "throat",
            "and",
            "feel",
            "exhausted",
            "so",
            "I",
            "booked",
            "a",
            "doctor's",
            "appointment"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 59."
        }
      ]
    }
  },
  {
    "id": "day-60",
    "dayNumber": 60,
    "monthNumber": 2,
    "title": "Month 2 Mastery & Transition to Advanced Fluency",
    "category": "conversation",
    "level": "intermediate",
    "description": "Consolidate Month 2 intermediate learning and prepare for advanced C1/C2 mastery.",
    "xpReward": 50,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Congratulations on completing Month 2! You have mastered intermediate narrative tenses, future forms, modals, passive voice, and workplace communication.",
      "rules": [
        {
          "rule": "Review complex multi-clause sentence building before tackling C1/C2 syntax.",
          "why": "Solid intermediate grammar provides the launching pad for executive rhetoric.",
          "example": "Having completed intermediate training, we are now ready for C1 advanced nuances.",
          "wrongExample": "Now we finished intermediate we do advanced."
        }
      ],
      "wordExplanations": [
        {
          "word": "mastery",
          "role": "Achievement Noun",
          "whyUsed": "Comprehensive domain knowledge."
        }
      ],
      "proTip": "Pro Tip Day 60: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d60-q1",
        "question": "Which sentence demonstrates correct Day 60 English usage?",
        "options": [
          "Having completed intermediate training, we are now ready for C1 advanced nuances.",
          "Now we finished intermediate we do advanced.",
          "Option 3 with grammatical error on Day 60.",
          "Option 4 with wrong verb tense on Day 60."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 60.",
        "grammaticalRole": "Target Structure for Day 60"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 60 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Having completed intermediate training, we are now ready for C1 advanced nuances.",
          "wordPool": [
            "Having",
            "completed",
            "intermediate",
            "training",
            "we",
            "are",
            "now",
            "ready",
            "for",
            "C1",
            "advanced",
            "nuances"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 60."
        }
      ]
    }
  },
  {
    "id": "day-61",
    "dayNumber": 61,
    "monthNumber": 3,
    "title": "Zero & First Conditionals: General Truths & Real Future Possibilities",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Form zero conditionals for universal facts and first conditionals for realistic future plans.",
    "xpReward": 55,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Zero Conditional: If + Present Simple, Present Simple (scientific facts). First Conditional: If + Present Simple, Will + Base Verb (real future possibility).",
      "rules": [
        {
          "rule": "In First Conditional, NEVER use \"will\" inside the IF-clause!",
          "why": "Condition clauses require present tense to set the hypothetical frame.",
          "example": "If you heat ice, it melts. / If the weather improves tomorrow, we will launch the campaign.",
          "wrongExample": "If the weather will improve tomorrow, we will launch the campaign."
        }
      ],
      "wordExplanations": [
        {
          "word": "If + Present ... Will",
          "role": "First Conditional Structure",
          "whyUsed": "Real future condition."
        }
      ],
      "proTip": "Pro Tip Day 61: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d61-q1",
        "question": "Which sentence demonstrates correct Day 61 English usage?",
        "options": [
          "If you heat ice, it melts.",
          "If the weather will improve tomorrow, we will launch the campaign.",
          "Option 3 with grammatical error on Day 61.",
          "Option 4 with wrong verb tense on Day 61."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 61.",
        "grammaticalRole": "Target Structure for Day 61"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 61 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "If you heat ice, it melts.",
          "wordPool": [
            "If",
            "you",
            "heat",
            "ice",
            "it",
            "melts"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 61."
        }
      ]
    }
  },
  {
    "id": "day-62",
    "dayNumber": 62,
    "monthNumber": 3,
    "title": "Second Conditional: Hypothetical Present & Unreal Dreams",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Express unreal, imaginary, or improbable present and future situations using If + Past Simple, Would.",
    "xpReward": 60,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Second Conditional (If + Past Simple, Would + Base Verb) describes hypothetical present/future scenarios that are contrary to current reality.",
      "rules": [
        {
          "rule": "In formal written English, use \"were\" for all subjects in the IF clause (If I were you...).",
          "why": "Preserves the subjunctive past form for unreal conditions.",
          "example": "If I were the CEO, I would invest heavily in green energy.",
          "wrongExample": "If I am the CEO, I would invest in green energy."
        }
      ],
      "wordExplanations": [
        {
          "word": "If I were you",
          "role": "Subjunctive Conditional Frame",
          "whyUsed": "Hypothetical advice formula."
        }
      ],
      "proTip": "Pro Tip Day 62: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d62-q1",
        "question": "Which sentence demonstrates correct Day 62 English usage?",
        "options": [
          "If I were the CEO, I would invest heavily in green energy.",
          "If I am the CEO, I would invest in green energy.",
          "Option 3 with grammatical error on Day 62.",
          "Option 4 with wrong verb tense on Day 62."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 62.",
        "grammaticalRole": "Target Structure for Day 62"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 62 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "If I were the CEO, I would invest heavily in green energy.",
          "wordPool": [
            "If",
            "I",
            "were",
            "the",
            "CEO",
            "I",
            "would",
            "invest",
            "heavily",
            "in",
            "green",
            "energy"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 62."
        }
      ]
    }
  },
  {
    "id": "day-63",
    "dayNumber": 63,
    "monthNumber": 3,
    "title": "Third Conditional: Regrets & Past Hypothetical Counterfactuals",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Analyze past unreal events and imaginary past consequences using If + Past Perfect, Would have.",
    "xpReward": 65,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Third Conditional (If + Past Perfect, Would have + Past Participle) reflects on impossible past counterfactuals and past regrets.",
      "rules": [
        {
          "rule": "Use Third Conditional when reflecting on events that can no longer be altered.",
          "why": "Connects unreal past condition to imaginary past result.",
          "example": "If we had conducted thorough market research, we would have avoided the loss.",
          "wrongExample": "If we conducted market research, we would avoid loss last year."
        }
      ],
      "wordExplanations": [
        {
          "word": "would have avoided",
          "role": "Third Conditional Result Verb",
          "whyUsed": "Imaginary past result of unfulfilled condition."
        }
      ],
      "proTip": "Pro Tip Day 63: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d63-q1",
        "question": "Which sentence demonstrates correct Day 63 English usage?",
        "options": [
          "If we had conducted thorough market research, we would have avoided the loss.",
          "If we conducted market research, we would avoid loss last year.",
          "Option 3 with grammatical error on Day 63.",
          "Option 4 with wrong verb tense on Day 63."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 63.",
        "grammaticalRole": "Target Structure for Day 63"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 63 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "If we had conducted thorough market research, we would have avoided the loss.",
          "wordPool": [
            "If",
            "we",
            "had",
            "conducted",
            "thorough",
            "market",
            "research",
            "we",
            "would",
            "have",
            "avoided",
            "the",
            "loss"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 63."
        }
      ]
    }
  },
  {
    "id": "day-64",
    "dayNumber": 64,
    "monthNumber": 3,
    "title": "Mixed Conditionals: Past Causes with Present Results & Vice Versa",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Connect past unfulfilled events to present realities or permanent traits to past outcomes.",
    "xpReward": 70,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Mixed Conditional Type A: If + Past Perfect (past unreal condition), Would + Base Verb (present result). e.g. If I had studied medicine, I would be a doctor today.",
      "rules": [
        {
          "rule": "Match the conditional clause tense to its specific temporal reference point.",
          "why": "Allows dynamic cross-temporal hypothetical reasoning.",
          "example": "If I had taken that flight yesterday, I would be in London right now.",
          "wrongExample": "If I took that flight yesterday, I will be in London right now."
        }
      ],
      "wordExplanations": [
        {
          "word": "had taken ... would be",
          "role": "Mixed Conditional Type A",
          "whyUsed": "Past cause with present result."
        }
      ],
      "proTip": "Pro Tip Day 64: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d64-q1",
        "question": "Which sentence demonstrates correct Day 64 English usage?",
        "options": [
          "If I had taken that flight yesterday, I would be in London right now.",
          "If I took that flight yesterday, I will be in London right now.",
          "Option 3 with grammatical error on Day 64.",
          "Option 4 with wrong verb tense on Day 64."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 64.",
        "grammaticalRole": "Target Structure for Day 64"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 64 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "If I had taken that flight yesterday, I would be in London right now.",
          "wordPool": [
            "If",
            "I",
            "had",
            "taken",
            "that",
            "flight",
            "yesterday",
            "I",
            "would",
            "be",
            "in",
            "London",
            "right",
            "now"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 64."
        }
      ]
    }
  },
  {
    "id": "day-65",
    "dayNumber": 65,
    "monthNumber": 3,
    "title": "Conditionals Mastery: Alternatives to IF (Provided that, As long as, Unless)",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Replace \"if\" with sophisticated C1 conditional markers like \"provided that\", \"unless\", \"supposing\".",
    "xpReward": 50,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Elevate conditional writing: \"Unless\" = If not. \"Provided that / As long as\" = Only if. \"On condition that\" = Strict prerequisite. \"Supposing\" = Imagine if.",
      "rules": [
        {
          "rule": "Remember that \"unless\" contains an inherent negative; do NOT add double negatives!",
          "why": "Inherent negation in \"unless\" satisfies clause polarity.",
          "example": "We will sign the contract provided that all terms remain unchanged.",
          "wrongExample": "We will sign unless terms are not changed."
        }
      ],
      "wordExplanations": [
        {
          "word": "provided that",
          "role": "Advanced Conditional Marker",
          "whyUsed": "Formal prerequisite alternative to \"if\"."
        }
      ],
      "proTip": "Pro Tip Day 65: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d65-q1",
        "question": "Which sentence demonstrates correct Day 65 English usage?",
        "options": [
          "We will sign the contract provided that all terms remain unchanged.",
          "We will sign unless terms are not changed.",
          "Option 3 with grammatical error on Day 65.",
          "Option 4 with wrong verb tense on Day 65."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 65.",
        "grammaticalRole": "Target Structure for Day 65"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 65 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "We will sign the contract provided that all terms remain unchanged.",
          "wordPool": [
            "We",
            "will",
            "sign",
            "the",
            "contract",
            "provided",
            "that",
            "all",
            "terms",
            "remain",
            "unchanged"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 65."
        }
      ]
    }
  },
  {
    "id": "day-66",
    "dayNumber": 66,
    "monthNumber": 3,
    "title": "Wish & If Only: Expressing Present Regrets & Past Counterfactuals",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Express desires for change in the present (wish + past simple) and regrets about the past (wish + past perfect).",
    "xpReward": 55,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Wish + Past Simple (desire for current state change): I wish I lived closer. Wish + Past Perfect (past regret): I wish I had known earlier.",
      "rules": [
        {
          "rule": "Use \"wish + would\" to express annoyance about someone's persistent habit.",
          "why": "\"Would\" in wish structures highlights target willingness or annoying behavior.",
          "example": "I wish I had studied harder for the exam. I wish he would stop interrupting!",
          "wrongExample": "I wish I have known earlier."
        }
      ],
      "wordExplanations": [
        {
          "word": "wish I had known",
          "role": "Past Regret Wish Formula",
          "whyUsed": "Expresses past counterfactual regret."
        }
      ],
      "proTip": "Pro Tip Day 66: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d66-q1",
        "question": "Which sentence demonstrates correct Day 66 English usage?",
        "options": [
          "I wish I had studied harder for the exam. I wish he would stop interrupting!",
          "I wish I have known earlier.",
          "Option 3 with grammatical error on Day 66.",
          "Option 4 with wrong verb tense on Day 66."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 66.",
        "grammaticalRole": "Target Structure for Day 66"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 66 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "I wish I had studied harder for the exam. I wish he would stop interrupting!",
          "wordPool": [
            "I",
            "wish",
            "I",
            "had",
            "studied",
            "harder",
            "for",
            "the",
            "exam",
            "I",
            "wish",
            "he",
            "would",
            "stop",
            "interrupting"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 66."
        }
      ]
    }
  },
  {
    "id": "day-67",
    "dayNumber": 67,
    "monthNumber": 3,
    "title": "Subjunctive Mood: Formal Demands, Proposals & Mandative Clauses",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Master bare subjunctive verb forms after verbs of demand, recommendation, and necessity.",
    "xpReward": 60,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Mandative Subjunctive uses bare base verb (no -s, no -ed) after verbs like \"insist\", \"demand\", \"recommend\", \"propose\" + THAT clause. e.g. It is essential that he be present.",
      "rules": [
        {
          "rule": "Keep the verb in bare base form regardless of third-person subject or main clause past tense.",
          "why": "The subjunctive mood drops inflection to reflect hypothetical directive state.",
          "example": "The committee recommended that she be appointed director immediately.",
          "wrongExample": "The committee recommended that she is appointed director."
        }
      ],
      "wordExplanations": [
        {
          "word": "that she be appointed",
          "role": "Mandative Subjunctive",
          "whyUsed": "Bare base verb \"be\" after \"recommended that\"."
        }
      ],
      "proTip": "Pro Tip Day 67: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d67-q1",
        "question": "Which sentence demonstrates correct Day 67 English usage?",
        "options": [
          "The committee recommended that she be appointed director immediately.",
          "The committee recommended that she is appointed director.",
          "Option 3 with grammatical error on Day 67.",
          "Option 4 with wrong verb tense on Day 67."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 67.",
        "grammaticalRole": "Target Structure for Day 67"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 67 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "The committee recommended that she be appointed director immediately.",
          "wordPool": [
            "The",
            "committee",
            "recommended",
            "that",
            "she",
            "be",
            "appointed",
            "director",
            "immediately"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 67."
        }
      ]
    }
  },
  {
    "id": "day-68",
    "dayNumber": 68,
    "monthNumber": 3,
    "title": "Inversion 1: Negative Adverbs at Sentence Start (Rarely, Seldom, Never)",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Front negative adverbials to create emphatic, dramatic, and authoritative C1 sentences.",
    "xpReward": 65,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "When negative adverbs (Rarely, Seldom, Never, Little, Hardly) open a sentence for dramatic emphasis, invert the subject and auxiliary verb (Negative Adverb + Auxiliary + Subject + Main Verb).",
      "rules": [
        {
          "rule": "Place auxiliary verb BEFORE subject immediately following the fronted negative adverb.",
          "why": "Syntactic inversion marks emphatic rhetorical focus.",
          "example": "Rarely have I seen such dedication to quality.",
          "wrongExample": "Rarely I have seen such dedication to quality."
        }
      ],
      "wordExplanations": [
        {
          "word": "Rarely have I seen",
          "role": "Emphatic Inversion",
          "whyUsed": "Auxiliary \"have\" precedes subject \"I\"."
        }
      ],
      "proTip": "Pro Tip Day 68: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d68-q1",
        "question": "Which sentence demonstrates correct Day 68 English usage?",
        "options": [
          "Rarely have I seen such dedication to quality.",
          "Rarely I have seen such dedication to quality.",
          "Option 3 with grammatical error on Day 68.",
          "Option 4 with wrong verb tense on Day 68."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 68.",
        "grammaticalRole": "Target Structure for Day 68"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 68 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Rarely have I seen such dedication to quality.",
          "wordPool": [
            "Rarely",
            "have",
            "I",
            "seen",
            "such",
            "dedication",
            "to",
            "quality"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 68."
        }
      ]
    }
  },
  {
    "id": "day-69",
    "dayNumber": 69,
    "monthNumber": 3,
    "title": "Inversion 2: Scarcely... when, No sooner... than, Not only... but also",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Master double-clause inverted structures for executive writing and formal presentations.",
    "xpReward": 70,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "\"No sooner HAD subject + past participle THAN...\" / \"Hardly HAD subject + past participle WHEN...\" / \"Not only DID subject + verb BUT ALSO...\"",
      "rules": [
        {
          "rule": "Pair \"No sooner\" strictly with \"THAN\", and \"Hardly/Scarcely\" strictly with \"WHEN\".",
          "why": "Correlative adverbial pairs enforce fixed temporal conjunctions.",
          "example": "Not only did we exceed our revenue targets, but we also expanded internationally.",
          "wrongExample": "Not only we exceeded our revenue targets, but also expanded."
        }
      ],
      "wordExplanations": [
        {
          "word": "Not only did we exceed",
          "role": "Inverted Correlative Structure",
          "whyUsed": "Auxiliary \"did\" inverted before subject \"we\"."
        }
      ],
      "proTip": "Pro Tip Day 69: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d69-q1",
        "question": "Which sentence demonstrates correct Day 69 English usage?",
        "options": [
          "Not only did we exceed our revenue targets, but we also expanded internationally.",
          "Not only we exceeded our revenue targets, but also expanded.",
          "Option 3 with grammatical error on Day 69.",
          "Option 4 with wrong verb tense on Day 69."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 69.",
        "grammaticalRole": "Target Structure for Day 69"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 69 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Not only did we exceed our revenue targets, but we also expanded internationally.",
          "wordPool": [
            "Not",
            "only",
            "did",
            "we",
            "exceed",
            "our",
            "revenue",
            "targets",
            "but",
            "we",
            "also",
            "expanded",
            "internationally"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 69."
        }
      ]
    }
  },
  {
    "id": "day-70",
    "dayNumber": 70,
    "monthNumber": 3,
    "title": "Advanced Inversion & Emphatic C1 Writing",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Synthesize negative inversion, conditional inversion (Had I known...), and emphatic rhetoric.",
    "xpReward": 50,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Omit \"if\" in formal conditionals via inversion: \"Had I known\" (= If I had known), \"Were I in your position\" (= If I were in your position), \"Should you require assistance\" (= If you require).",
      "rules": [
        {
          "rule": "Invert auxiliary verb to omit \"if\" in high-level formal correspondence.",
          "why": "Conditional inversion produces an authoritative executive tone.",
          "example": "Should you have any questions, please do not hesitate to contact us.",
          "wrongExample": "Should if you have any questions, please contact us."
        }
      ],
      "wordExplanations": [
        {
          "word": "Should you have",
          "role": "Formal Inverted Conditional",
          "whyUsed": "Replaces \"If you have\" for executive register."
        }
      ],
      "proTip": "Pro Tip Day 70: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d70-q1",
        "question": "Which sentence demonstrates correct Day 70 English usage?",
        "options": [
          "Should you have any questions, please do not hesitate to contact us.",
          "Should if you have any questions, please contact us.",
          "Option 3 with grammatical error on Day 70.",
          "Option 4 with wrong verb tense on Day 70."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 70.",
        "grammaticalRole": "Target Structure for Day 70"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 70 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Should you have any questions, please do not hesitate to contact us.",
          "wordPool": [
            "Should",
            "you",
            "have",
            "any",
            "questions",
            "please",
            "do",
            "not",
            "hesitate",
            "to",
            "contact",
            "us"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 70."
        }
      ]
    }
  },
  {
    "id": "day-71",
    "dayNumber": 71,
    "monthNumber": 3,
    "title": "Cleft Sentences: Adding Emphasis (It is... that, What I need is...)",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Divide sentences into two clauses to spotlight specific key information.",
    "xpReward": 55,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "It-Cleft: It was [emphasized element] that [rest of sentence]. Wh-Cleft (Pseudo-cleft): What [subject + verb] IS/WAS [emphasized element].",
      "rules": [
        {
          "rule": "Use cleft sentences when you want to focus the listener's attention on one crucial fact.",
          "why": "Foregrounding alters information structure for maximum rhetorical punch.",
          "example": "What surprised us most was the rapid adoption rate of the product.",
          "wrongExample": "What surprised us most it was the rapid adoption rate."
        }
      ],
      "wordExplanations": [
        {
          "word": "What surprised us was",
          "role": "Wh-Cleft Focus Structure",
          "whyUsed": "Emphasizes \"the rapid adoption rate\"."
        }
      ],
      "proTip": "Pro Tip Day 71: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d71-q1",
        "question": "Which sentence demonstrates correct Day 71 English usage?",
        "options": [
          "What surprised us most was the rapid adoption rate of the product.",
          "What surprised us most it was the rapid adoption rate.",
          "Option 3 with grammatical error on Day 71.",
          "Option 4 with wrong verb tense on Day 71."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 71.",
        "grammaticalRole": "Target Structure for Day 71"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 71 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "What surprised us most was the rapid adoption rate of the product.",
          "wordPool": [
            "What",
            "surprised",
            "us",
            "most",
            "was",
            "the",
            "rapid",
            "adoption",
            "rate",
            "of",
            "the",
            "product"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 71."
        }
      ]
    }
  },
  {
    "id": "day-72",
    "dayNumber": 72,
    "monthNumber": 3,
    "title": "Participle Clauses: Reduced Clauses for Sophisticated Writing",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Replace full relative or adverbial clauses with present (-ing) and past (-ed) participle phrases.",
    "xpReward": 60,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Reduced active clause: Having completed the review, the team submitted the audit. Reduced passive clause: Built in 1920, the historic bridge remains functional.",
      "rules": [
        {
          "rule": "Ensure the subject of the main clause matches the implicit subject of the participle phrase (avoid dangling modifiers!).",
          "why": "Dangling modifiers create grammatical errors by attaching participle phrases to wrong subjects.",
          "example": "Having analyzed the data thoroughly, we made our final decision.",
          "wrongExample": "Having analyzed the data thoroughly, the decision was made by us."
        }
      ],
      "wordExplanations": [
        {
          "word": "Having analyzed",
          "role": "Perfect Participle Clause",
          "whyUsed": "Reduces \"After we had analyzed\"."
        }
      ],
      "proTip": "Pro Tip Day 72: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d72-q1",
        "question": "Which sentence demonstrates correct Day 72 English usage?",
        "options": [
          "Having analyzed the data thoroughly, we made our final decision.",
          "Having analyzed the data thoroughly, the decision was made by us.",
          "Option 3 with grammatical error on Day 72.",
          "Option 4 with wrong verb tense on Day 72."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 72.",
        "grammaticalRole": "Target Structure for Day 72"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 72 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Having analyzed the data thoroughly, we made our final decision.",
          "wordPool": [
            "Having",
            "analyzed",
            "the",
            "data",
            "thoroughly",
            "we",
            "made",
            "our",
            "final",
            "decision"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 72."
        }
      ]
    }
  },
  {
    "id": "day-73",
    "dayNumber": 73,
    "monthNumber": 3,
    "title": "Advanced Articles & Special Noun Nuances (Geographical, Abstract)",
    "category": "grammar",
    "level": "pro",
    "description": "Master zero article vs definite article across countries, mountain ranges, institutions, and abstract nouns.",
    "xpReward": 65,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Use \"the\" with plural countries (The Netherlands, The Philippines), mountain ranges (The Alps), and oceans. Use zero article with single peaks (Mount Everest), continents, and abstract concepts in general.",
      "rules": [
        {
          "rule": "Use \"the\" when a country name contains a collective noun like Republic, Kingdom, or States.",
          "why": "Collective institutional descriptors convert proper names into definite noun phrases.",
          "example": "He traveled across the United Kingdom and visited the Alps.",
          "wrongExample": "He traveled across United Kingdom and visited Alps."
        }
      ],
      "wordExplanations": [
        {
          "word": "the United Kingdom",
          "role": "Definite Geographical Article",
          "whyUsed": "Kingdom takes definite article."
        }
      ],
      "proTip": "Pro Tip Day 73: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d73-q1",
        "question": "Which sentence demonstrates correct Day 73 English usage?",
        "options": [
          "He traveled across the United Kingdom and visited the Alps.",
          "He traveled across United Kingdom and visited Alps.",
          "Option 3 with grammatical error on Day 73.",
          "Option 4 with wrong verb tense on Day 73."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 73.",
        "grammaticalRole": "Target Structure for Day 73"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 73 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "He traveled across the United Kingdom and visited the Alps.",
          "wordPool": [
            "He",
            "traveled",
            "across",
            "the",
            "United",
            "Kingdom",
            "and",
            "visited",
            "the",
            "Alps"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 73."
        }
      ]
    }
  },
  {
    "id": "day-74",
    "dayNumber": 74,
    "monthNumber": 3,
    "title": "Advanced Prepositional Collocations & Idiomatic Verb Pairs",
    "category": "idioms",
    "level": "pro",
    "description": "Master fixed verb + preposition combinations (attribute to, comply with, redolent of).",
    "xpReward": 70,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Advanced collocations: \"comply with regulations\", \"attribute success to hard work\", \"tamper with evidence\", \"hinge on a decision\", \"conducive to growth\".",
      "rules": [
        {
          "rule": "Match verbs to their exact mandatory prepositions (e.g. comply WITH, NOT comply to).",
          "why": "Fixed prepositional complementation is strictly enforced in formal English.",
          "example": "Our team ensured all processes comply fully with environmental standards.",
          "wrongExample": "Our team ensured all processes comply to environmental standards."
        }
      ],
      "wordExplanations": [
        {
          "word": "comply with",
          "role": "Fixed Prepositional Verb",
          "whyUsed": "\"Comply\" strictly takes preposition \"with\"."
        }
      ],
      "proTip": "Pro Tip Day 74: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d74-q1",
        "question": "Which sentence demonstrates correct Day 74 English usage?",
        "options": [
          "Our team ensured all processes comply fully with environmental standards.",
          "Our team ensured all processes comply to environmental standards.",
          "Option 3 with grammatical error on Day 74.",
          "Option 4 with wrong verb tense on Day 74."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 74.",
        "grammaticalRole": "Target Structure for Day 74"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 74 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Our team ensured all processes comply fully with environmental standards.",
          "wordPool": [
            "Our",
            "team",
            "ensured",
            "all",
            "processes",
            "comply",
            "fully",
            "with",
            "environmental",
            "standards"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 74."
        }
      ]
    }
  },
  {
    "id": "day-75",
    "dayNumber": 75,
    "monthNumber": 3,
    "title": "Passive Voice & Nuance: Impersonal Passive & Causative Have/Get",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Use formal reporting passives (It is alleged that...) and causative structures (have something done).",
    "xpReward": 50,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Impersonal Passive: It is reported that... / He is said to be... Causative: Have/Get something done (arrange for someone else to do a service for you).",
      "rules": [
        {
          "rule": "Use \"have + object + past participle\" when delegating professional tasks to specialists.",
          "why": "Causative structure specifies agent delegation rather than direct personal labor.",
          "example": "The company is said to be preparing an IPO. We had our servers audited last week.",
          "wrongExample": "We audited our servers by specialists last week."
        }
      ],
      "wordExplanations": [
        {
          "word": "had our servers audited",
          "role": "Causative Structure",
          "whyUsed": "Arranged for specialists to perform audit."
        }
      ],
      "proTip": "Pro Tip Day 75: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d75-q1",
        "question": "Which sentence demonstrates correct Day 75 English usage?",
        "options": [
          "The company is said to be preparing an IPO. We had our servers audited last week.",
          "We audited our servers by specialists last week.",
          "Option 3 with grammatical error on Day 75.",
          "Option 4 with wrong verb tense on Day 75."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 75.",
        "grammaticalRole": "Target Structure for Day 75"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 75 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "The company is said to be preparing an IPO. We had our servers audited last week.",
          "wordPool": [
            "The",
            "company",
            "is",
            "said",
            "to",
            "be",
            "preparing",
            "an",
            "IPO",
            "We",
            "had",
            "our",
            "servers",
            "audited",
            "last",
            "week"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 75."
        }
      ]
    }
  },
  {
    "id": "day-76",
    "dayNumber": 76,
    "monthNumber": 3,
    "title": "Idioms & Metaphors in Corporate & Social Settings",
    "category": "idioms",
    "level": "pro",
    "description": "Incorporate native business metaphors without sounding unnatural or clichés.",
    "xpReward": 55,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Corporate idioms: \"hit the ground running\", \"touch base\", \"raise the bar\", \"think outside the box\", \"ball is in your court\", \"bite the bullet\".",
      "rules": [
        {
          "rule": "Use idioms selectively in appropriate contexts to enhance rapport without cluttering rhetoric.",
          "why": "Idiomatic restraint distinguishes native polish from forced jargon.",
          "example": "Let's touch base on Friday after you review the proposal; the ball is in their court.",
          "wrongExample": "We must hit the ground running outside the box to bite the bullet."
        }
      ],
      "wordExplanations": [
        {
          "word": "touch base",
          "role": "Business Metaphor",
          "whyUsed": "Means to make brief contact to check progress."
        }
      ],
      "proTip": "Pro Tip Day 76: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d76-q1",
        "question": "Which sentence demonstrates correct Day 76 English usage?",
        "options": [
          "Let's touch base on Friday after you review the proposal; the ball is in their court.",
          "We must hit the ground running outside the box to bite the bullet.",
          "Option 3 with grammatical error on Day 76.",
          "Option 4 with wrong verb tense on Day 76."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 76.",
        "grammaticalRole": "Target Structure for Day 76"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 76 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Let's touch base on Friday after you review the proposal; the ball is in their court.",
          "wordPool": [
            "Let's",
            "touch",
            "base",
            "on",
            "Friday",
            "after",
            "you",
            "review",
            "the",
            "proposal;",
            "the",
            "ball",
            "is",
            "in",
            "their",
            "court"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 76."
        }
      ]
    }
  },
  {
    "id": "day-77",
    "dayNumber": 77,
    "monthNumber": 3,
    "title": "Diplomatic Hedging & Softening Direct Language in Business",
    "category": "conversation",
    "level": "pro",
    "description": "Softened direct statements using diplomatic qualifiers, modals, and indirect phrasing.",
    "xpReward": 60,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Diplomatic hedging avoids confrontational directness: Use modals (might, would), soft verbs (appear, seem, tend), and qualifiers (somewhat, slight, minor).",
      "rules": [
        {
          "rule": "Replace blunt assertions (\"This is wrong\") with diplomatic hedges (\"It seems there might be a slight misunderstanding\").",
          "why": "Preserves professional goodwill while highlighting necessary corrections.",
          "example": "It would appear that there might be a minor discrepancy in the financial statements.",
          "wrongExample": "Your financial statements are completely wrong and false."
        }
      ],
      "wordExplanations": [
        {
          "word": "It would appear that",
          "role": "Diplomatic Hedging Formula",
          "whyUsed": "Softens critique politely in executive context."
        }
      ],
      "proTip": "Pro Tip Day 77: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d77-q1",
        "question": "Which sentence demonstrates correct Day 77 English usage?",
        "options": [
          "It would appear that there might be a minor discrepancy in the financial statements.",
          "Your financial statements are completely wrong and false.",
          "Option 3 with grammatical error on Day 77.",
          "Option 4 with wrong verb tense on Day 77."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 77.",
        "grammaticalRole": "Target Structure for Day 77"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 77 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "It would appear that there might be a minor discrepancy in the financial statements.",
          "wordPool": [
            "It",
            "would",
            "appear",
            "that",
            "there",
            "might",
            "be",
            "a",
            "minor",
            "discrepancy",
            "in",
            "the",
            "financial",
            "statements"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 77."
        }
      ]
    }
  },
  {
    "id": "day-78",
    "dayNumber": 78,
    "monthNumber": 3,
    "title": "Advanced Negotiation & Persuasive Rhetoric",
    "category": "conversation",
    "level": "pro",
    "description": "Employ persuasive rhetorical techniques, anchoring, and concessive phrasing in negotiations.",
    "xpReward": 65,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Negotiation strategies: \"While we appreciate your position, our primary concern remains...\", \"Would you be open to considering...\", \"On the understanding that...\".",
      "rules": [
        {
          "rule": "Acknowledge the counterpart's point before introducing your counter-proposal.",
          "why": "Concessive framing reduces defensive reaction in negotiations.",
          "example": "While we appreciate your pricing constraints, we need a commitment to quality standards.",
          "wrongExample": "We don't care about your constraints, give us quality."
        }
      ],
      "wordExplanations": [
        {
          "word": "While we appreciate",
          "role": "Concessive Framing Phrase",
          "whyUsed": "Validates counterpart before stating counter-position."
        }
      ],
      "proTip": "Pro Tip Day 78: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d78-q1",
        "question": "Which sentence demonstrates correct Day 78 English usage?",
        "options": [
          "While we appreciate your pricing constraints, we need a commitment to quality standards.",
          "We don't care about your constraints, give us quality.",
          "Option 3 with grammatical error on Day 78.",
          "Option 4 with wrong verb tense on Day 78."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 78.",
        "grammaticalRole": "Target Structure for Day 78"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 78 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "While we appreciate your pricing constraints, we need a commitment to quality standards.",
          "wordPool": [
            "While",
            "we",
            "appreciate",
            "your",
            "pricing",
            "constraints",
            "we",
            "need",
            "a",
            "commitment",
            "to",
            "quality",
            "standards"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 78."
        }
      ]
    }
  },
  {
    "id": "day-79",
    "dayNumber": 79,
    "monthNumber": 3,
    "title": "Nuances of Tone: Formal, Casual, Sarcastic & Warm English",
    "category": "conversation",
    "level": "pro",
    "description": "Adapt linguistic register effortlessly between formal executive, warm social, and subtle humor.",
    "xpReward": 70,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Recognize tone indicators: Latinate vocabulary and passive voice for formal register; phrasal verbs and contractions for casual warmth; understated irony for humor.",
      "rules": [
        {
          "rule": "Match vocabulary origin to register: Latinate (commence, inform) = formal; Anglo-Saxon (start, tell) = casual.",
          "why": "Etymological register alignment ensures appropriate social distance.",
          "example": "Formal: We regret to inform you that the event is postponed. Casual: Sorry to tell you the party is moved!",
          "wrongExample": "We regret to tell you the party is moved!"
        }
      ],
      "wordExplanations": [
        {
          "word": "regret to inform",
          "role": "Formal Register Formula",
          "whyUsed": "High-formality corporate communication."
        }
      ],
      "proTip": "Pro Tip Day 79: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d79-q1",
        "question": "Which sentence demonstrates correct Day 79 English usage?",
        "options": [
          "Formal: We regret to inform you that the event is postponed. Casual: Sorry to tell you the party is moved!",
          "We regret to tell you the party is moved!",
          "Option 3 with grammatical error on Day 79.",
          "Option 4 with wrong verb tense on Day 79."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 79.",
        "grammaticalRole": "Target Structure for Day 79"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 79 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Formal: We regret to inform you that the event is postponed. Casual: Sorry to tell you the party is moved!",
          "wordPool": [
            "Formal:",
            "We",
            "regret",
            "to",
            "inform",
            "you",
            "that",
            "the",
            "event",
            "is",
            "postponed",
            "Casual:",
            "Sorry",
            "to",
            "tell",
            "you",
            "the",
            "party",
            "is",
            "moved"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 79."
        }
      ]
    }
  },
  {
    "id": "day-80",
    "dayNumber": 80,
    "monthNumber": 3,
    "title": "Connected Speech, Reductions & Native Rhythm",
    "category": "conversation",
    "level": "pro",
    "description": "Master elision, assimilation, intrusive sounds, and thought-group pausing for fluid pronunciation.",
    "xpReward": 50,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Native spoken English features connected speech: Assimilation (ten boys -> /tem bɔɪz/), Elision (next door -> /neks dɔː/), Linking /r/ and Intrusive /w/ or /j/ between vowels.",
      "rules": [
        {
          "rule": "Group words into natural rhythmic thought groups and link trailing consonants to leading vowels.",
          "why": "Acoustic linking creates stress-timed cadence in spoken English.",
          "example": "Spoken linking: \"An apple\" sounds like \"A-napple\" (/ənˈæp.əl/).",
          "wrongExample": "An... Apple (choppy glottal stop)."
        }
      ],
      "wordExplanations": [
        {
          "word": "connected speech",
          "role": "Phonological Flow Feature",
          "whyUsed": "Smooth transition between words in natural speech."
        }
      ],
      "proTip": "Pro Tip Day 80: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d80-q1",
        "question": "Which sentence demonstrates correct Day 80 English usage?",
        "options": [
          "Spoken linking: \"An apple\" sounds like \"A-napple\" (",
          "An... Apple (choppy glottal stop).",
          "Option 3 with grammatical error on Day 80.",
          "Option 4 with wrong verb tense on Day 80."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 80.",
        "grammaticalRole": "Target Structure for Day 80"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 80 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Spoken linking: \"An apple\" sounds like \"A-napple\" (",
          "wordPool": [
            "Spoken",
            "linking:",
            "\"An",
            "apple\"",
            "sounds",
            "like",
            "\"A-napple\"",
            "("
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 80."
        }
      ]
    }
  },
  {
    "id": "day-81",
    "dayNumber": 81,
    "monthNumber": 3,
    "title": "Advanced Phrasal Verbs: Three-Part Phrasal Verbs",
    "category": "idioms",
    "level": "pro",
    "description": "Master inseparable three-word phrasal verbs (verb + particle + preposition).",
    "xpReward": 55,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Three-part phrasal verbs are ALWAYS inseparable: \"come up with\" (invent), \"cut down on\" (reduce), \"look forward to\" (anticipate), \"get away with\" (escape punishment).",
      "rules": [
        {
          "rule": "Keep all three words together; never insert objects inside a three-part phrasal verb.",
          "why": "Three-part phrasal verbs form a single indivisible semantic unit.",
          "example": "We must come up with an innovative solution to cut down on operational costs.",
          "wrongExample": "We must come an innovative solution up with."
        }
      ],
      "wordExplanations": [
        {
          "word": "come up with",
          "role": "Three-Part Inseparable Phrasal Verb",
          "whyUsed": "Means to generate or invent an idea."
        }
      ],
      "proTip": "Pro Tip Day 81: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d81-q1",
        "question": "Which sentence demonstrates correct Day 81 English usage?",
        "options": [
          "We must come up with an innovative solution to cut down on operational costs.",
          "We must come an innovative solution up with.",
          "Option 3 with grammatical error on Day 81.",
          "Option 4 with wrong verb tense on Day 81."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 81.",
        "grammaticalRole": "Target Structure for Day 81"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 81 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "We must come up with an innovative solution to cut down on operational costs.",
          "wordPool": [
            "We",
            "must",
            "come",
            "up",
            "with",
            "an",
            "innovative",
            "solution",
            "to",
            "cut",
            "down",
            "on",
            "operational",
            "costs"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 81."
        }
      ]
    }
  },
  {
    "id": "day-82",
    "dayNumber": 82,
    "monthNumber": 3,
    "title": "Nominalization: Converting Verbs & Adjectives to High-Level Academic Nouns",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Transform clauses into dense, authoritative noun phrases for formal C2 writing.",
    "xpReward": 60,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Nominalization converts verbs/adjectives into abstract nouns (analyze -> analysis, perform -> performance). e.g. \"We analyzed the data\" -> \"Our analysis of the data revealed...\".",
      "rules": [
        {
          "rule": "Use nominalization in executive summaries to increase informational density.",
          "why": "Noun-based prose presents ideas as objective entities.",
          "example": "The rapid expansion of the firm led to a dramatic increase in market share.",
          "wrongExample": "Because the firm expanded fast, market share increased dramatically."
        }
      ],
      "wordExplanations": [
        {
          "word": "rapid expansion",
          "role": "Nominalized Noun Phrase",
          "whyUsed": "Converts \"expanded rapidly\" into formal noun phrase."
        }
      ],
      "proTip": "Pro Tip Day 82: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d82-q1",
        "question": "Which sentence demonstrates correct Day 82 English usage?",
        "options": [
          "The rapid expansion of the firm led to a dramatic increase in market share.",
          "Because the firm expanded fast, market share increased dramatically.",
          "Option 3 with grammatical error on Day 82.",
          "Option 4 with wrong verb tense on Day 82."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 82.",
        "grammaticalRole": "Target Structure for Day 82"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 82 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "The rapid expansion of the firm led to a dramatic increase in market share.",
          "wordPool": [
            "The",
            "rapid",
            "expansion",
            "of",
            "the",
            "firm",
            "led",
            "to",
            "a",
            "dramatic",
            "increase",
            "in",
            "market",
            "share"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 82."
        }
      ]
    }
  },
  {
    "id": "day-83",
    "dayNumber": 83,
    "monthNumber": 3,
    "title": "Expressing Certainty, Doubt & Probability (Bound to, Likely to, On the verge of)",
    "category": "grammar",
    "level": "pro",
    "description": "Quantify probability with high precision using sophisticated modal adjectives and idioms.",
    "xpReward": 65,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "High certainty: bound to, certain to, inevitable. Probability: likely to, probable that. Unlikelihood: unlikely to, doubtful whether. Imminence: on the verge of / on the brink of.",
      "rules": [
        {
          "rule": "Use \"bound to + base verb\" to state a near-certain inevitable outcome.",
          "why": "Modal adjective phrase conveying logical necessity.",
          "example": "With such high demand, the event is bound to sell out quickly.",
          "wrongExample": "The event is bound to selling out."
        }
      ],
      "wordExplanations": [
        {
          "word": "bound to sell out",
          "role": "High Certainty Modal Adjective",
          "whyUsed": "States inevitable outcome."
        }
      ],
      "proTip": "Pro Tip Day 83: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d83-q1",
        "question": "Which sentence demonstrates correct Day 83 English usage?",
        "options": [
          "With such high demand, the event is bound to sell out quickly.",
          "The event is bound to selling out.",
          "Option 3 with grammatical error on Day 83.",
          "Option 4 with wrong verb tense on Day 83."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 83.",
        "grammaticalRole": "Target Structure for Day 83"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 83 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "With such high demand, the event is bound to sell out quickly.",
          "wordPool": [
            "With",
            "such",
            "high",
            "demand",
            "the",
            "event",
            "is",
            "bound",
            "to",
            "sell",
            "out",
            "quickly"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 83."
        }
      ]
    }
  },
  {
    "id": "day-84",
    "dayNumber": 84,
    "monthNumber": 3,
    "title": "Discourse Markers & Cohesion in Long Essays or Presentations",
    "category": "pro_syntax",
    "level": "pro",
    "description": "Guide audience attention smoothly through long presentations using cohesive discourse markers.",
    "xpReward": 70,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Discourse markers structure logical progression: Transitioning (\"Turning now to...\"), Exemplification (\"To illustrate...\"), Summarizing (\"To recap...\"), Digression (\"Parenthetically...\").",
      "rules": [
        {
          "rule": "Use explicit signposting markers at major structural transitions in public presentations.",
          "why": "Signposting assists audience cognitive mapping during complex speeches.",
          "example": "Turning now to our financial outlook, let us examine the Q4 projections.",
          "wrongExample": "Now finance outlook Q4 projections look at."
        }
      ],
      "wordExplanations": [
        {
          "word": "Turning now to",
          "role": "Presentation Discourse Signpost",
          "whyUsed": "Signals smooth topic transition."
        }
      ],
      "proTip": "Pro Tip Day 84: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d84-q1",
        "question": "Which sentence demonstrates correct Day 84 English usage?",
        "options": [
          "Turning now to our financial outlook, let us examine the Q4 projections.",
          "Now finance outlook Q4 projections look at.",
          "Option 3 with grammatical error on Day 84.",
          "Option 4 with wrong verb tense on Day 84."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 84.",
        "grammaticalRole": "Target Structure for Day 84"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 84 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Turning now to our financial outlook, let us examine the Q4 projections.",
          "wordPool": [
            "Turning",
            "now",
            "to",
            "our",
            "financial",
            "outlook",
            "let",
            "us",
            "examine",
            "the",
            "Q4",
            "projections"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 84."
        }
      ]
    }
  },
  {
    "id": "day-85",
    "dayNumber": 85,
    "monthNumber": 3,
    "title": "Financial, Economic & Analytical Terminology",
    "category": "vocabulary",
    "level": "pro",
    "description": "Master C-suite terminology for fiscal analysis, economic trends, and market forecasting.",
    "xpReward": 50,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Financial lexicon: \"liquidity\", \"yield\", \"fiscal trajectory\", \"ROI\", \"margin expansion\", \"macroeconomic headwinds\", \"capital expenditure\".",
      "rules": [
        {
          "rule": "Pair financial nouns with accurate analytical verbs: \"yield returns\", \"mitigate fiscal risks\".",
          "why": "Domain accuracy ensures credibility in executive boardrooms.",
          "example": "Despite macroeconomic headwinds, our margin expansion strategy yielded high returns.",
          "wrongExample": "Despite bad money wind, our plan made good cash."
        }
      ],
      "wordExplanations": [
        {
          "word": "macroeconomic headwinds",
          "role": "C-Suite Economic Collocation",
          "whyUsed": "Refers to external economic pressures."
        }
      ],
      "proTip": "Pro Tip Day 85: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d85-q1",
        "question": "Which sentence demonstrates correct Day 85 English usage?",
        "options": [
          "Despite macroeconomic headwinds, our margin expansion strategy yielded high returns.",
          "Despite bad money wind, our plan made good cash.",
          "Option 3 with grammatical error on Day 85.",
          "Option 4 with wrong verb tense on Day 85."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 85.",
        "grammaticalRole": "Target Structure for Day 85"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 85 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Despite macroeconomic headwinds, our margin expansion strategy yielded high returns.",
          "wordPool": [
            "Despite",
            "macroeconomic",
            "headwinds",
            "our",
            "margin",
            "expansion",
            "strategy",
            "yielded",
            "high",
            "returns"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 85."
        }
      ]
    }
  },
  {
    "id": "day-86",
    "dayNumber": 86,
    "monthNumber": 3,
    "title": "Nuances of Words with Similar Meanings (Affect vs Effect, Continuous vs Continual)",
    "category": "vocabulary",
    "level": "pro",
    "description": "Eliminate common high-level vocabulary errors between frequently confused word pairs.",
    "xpReward": 55,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Affect (verb: to influence) vs Effect (noun: result). Continuous (uninterrupted without pause) vs Continual (frequently recurring with pauses). Historic (famous in history) vs Historical (related to history).",
      "rules": [
        {
          "rule": "Use \"continuous\" for smooth unbroken duration; use \"continual\" for repeated recurring events.",
          "why": "Semantic precision distinguishes continuous flow from iterative repetition.",
          "example": "The machine made a continuous humming sound. We experienced continual interruptions.",
          "wrongExample": "We experienced continuous interruptions with 10-minute gaps."
        }
      ],
      "wordExplanations": [
        {
          "word": "continual interruptions",
          "role": "Precise Vocabulary Choice",
          "whyUsed": "Denotes repeated recurring events with pauses."
        }
      ],
      "proTip": "Pro Tip Day 86: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d86-q1",
        "question": "Which sentence demonstrates correct Day 86 English usage?",
        "options": [
          "The machine made a continuous humming sound. We experienced continual interruptions.",
          "We experienced continuous interruptions with 10-minute gaps.",
          "Option 3 with grammatical error on Day 86.",
          "Option 4 with wrong verb tense on Day 86."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 86.",
        "grammaticalRole": "Target Structure for Day 86"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 86 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "The machine made a continuous humming sound. We experienced continual interruptions.",
          "wordPool": [
            "The",
            "machine",
            "made",
            "a",
            "continuous",
            "humming",
            "sound",
            "We",
            "experienced",
            "continual",
            "interruptions"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 86."
        }
      ]
    }
  },
  {
    "id": "day-87",
    "dayNumber": 87,
    "monthNumber": 3,
    "title": "Public Speaking, Pitching & Storytelling Structures",
    "category": "conversation",
    "level": "pro",
    "description": "Structure compelling business pitches using the Hook-Problem-Solution-Value framework.",
    "xpReward": 60,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Persuasive presentation architecture: 1. Attention Hook -> 2. Pain Point / Problem -> 3. Innovative Solution -> 4. Concrete Value Proposition -> 5. Decisive Call to Action.",
      "rules": [
        {
          "rule": "Open pitches with an engaging hook or striking stat rather than generic introductions.",
          "why": "Pragmatic audience hook captures cognitive focus immediately.",
          "example": "What if we could reduce operational downtime by 40% in under thirty days?",
          "wrongExample": "Hello my name is John and today I talk about my slides."
        }
      ],
      "wordExplanations": [
        {
          "word": "Rhetorical Hook",
          "role": "Public Speaking Device",
          "whyUsed": "Engages audience curiosity immediately."
        }
      ],
      "proTip": "Pro Tip Day 87: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d87-q1",
        "question": "Which sentence demonstrates correct Day 87 English usage?",
        "options": [
          "What if we could reduce operational downtime by 40% in under thirty days?",
          "Hello my name is John and today I talk about my slides.",
          "Option 3 with grammatical error on Day 87.",
          "Option 4 with wrong verb tense on Day 87."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 87.",
        "grammaticalRole": "Target Structure for Day 87"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 87 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "What if we could reduce operational downtime by 40% in under thirty days?",
          "wordPool": [
            "What",
            "if",
            "we",
            "could",
            "reduce",
            "operational",
            "downtime",
            "by",
            "40%",
            "in",
            "under",
            "thirty",
            "days?"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 87."
        }
      ]
    }
  },
  {
    "id": "day-88",
    "dayNumber": 88,
    "monthNumber": 3,
    "title": "Advanced Listening Comprehension & Accents (RP, General American)",
    "category": "conversation",
    "level": "pro",
    "description": "Train your ear to decode fast native accents, dropped vowels, and regional variations.",
    "xpReward": 65,
    "estimatedMinutes": 12,
    "theory": {
      "summary": "Decode accent variations: Non-rhotic Received Pronunciation (UK) drops post-vocalic /r/ (car -> /kɑː/), while General American pronounces rhotic /r/ clearly (car -> /kɑːr/).",
      "rules": [
        {
          "rule": "Focus on keywords and tonic stress rather than attempting to decode every unstressed schwa.",
          "why": "English listening efficiency prioritizes content words over function word schwas.",
          "example": "In fast speech, \"What do you want to do?\" sounds like \"Whatcha wanna do?\"",
          "wrongExample": "Expecting every word to be spoken in isolated slow dictionary form."
        }
      ],
      "wordExplanations": [
        {
          "word": "tonic stress",
          "role": "Phonological Auditory Feature",
          "whyUsed": "Primary pitch accent carrying core meaning."
        }
      ],
      "proTip": "Pro Tip Day 88: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d88-q1",
        "question": "Which sentence demonstrates correct Day 88 English usage?",
        "options": [
          "In fast speech, \"What do you want to do?\" sounds like \"Whatcha wanna do?\"",
          "Expecting every word to be spoken in isolated slow dictionary form.",
          "Option 3 with grammatical error on Day 88.",
          "Option 4 with wrong verb tense on Day 88."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 88.",
        "grammaticalRole": "Target Structure for Day 88"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 88 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "In fast speech, \"What do you want to do?\" sounds like \"Whatcha wanna do?\"",
          "wordPool": [
            "In",
            "fast",
            "speech",
            "\"What",
            "do",
            "you",
            "want",
            "to",
            "do?\"",
            "sounds",
            "like",
            "\"Whatcha",
            "wanna",
            "do?\""
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 88."
        }
      ]
    }
  },
  {
    "id": "day-89",
    "dayNumber": 89,
    "monthNumber": 3,
    "title": "Master Class in Colloquialisms & Native Conversational Fillers",
    "category": "idioms",
    "level": "pro",
    "description": "Understand casual native idioms, conversational fillers, and informal discourse markers naturally.",
    "xpReward": 70,
    "estimatedMinutes": 14,
    "theory": {
      "summary": "Native conversational markers: \"To be honest...\", \"At the end of the day...\", \"Fair enough\", \"I get where you're coming from\", \"For what it's worth\".",
      "rules": [
        {
          "rule": "Use conversational fillers sparingly to maintain natural conversational pacing without clutter.",
          "why": "Pragmatic discourse fillers soften social exchanges.",
          "example": "Fair enough, I see where you're coming from, but let's consider the alternative.",
          "wrongExample": "Fair enough fair enough at the end of the day like you know."
        }
      ],
      "wordExplanations": [
        {
          "word": "Fair enough",
          "role": "Social Discourse Marker",
          "whyUsed": "Signals polite acceptance or understanding."
        }
      ],
      "proTip": "Pro Tip Day 89: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d89-q1",
        "question": "Which sentence demonstrates correct Day 89 English usage?",
        "options": [
          "Fair enough, I see where you're coming from, but let's consider the alternative.",
          "Fair enough fair enough at the end of the day like you know.",
          "Option 3 with grammatical error on Day 89.",
          "Option 4 with wrong verb tense on Day 89."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 89.",
        "grammaticalRole": "Target Structure for Day 89"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 89 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Fair enough, I see where you're coming from, but let's consider the alternative.",
          "wordPool": [
            "Fair",
            "enough",
            "I",
            "see",
            "where",
            "you're",
            "coming",
            "from",
            "but",
            "let's",
            "consider",
            "the",
            "alternative"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 89."
        }
      ]
    }
  },
  {
    "id": "day-90",
    "dayNumber": 90,
    "monthNumber": 3,
    "title": "Executive Fluency: Graduation, Diplomatic Masterclass & C2 Capstone",
    "category": "pro_syntax",
    "level": "pro",
    "description": "The ultimate synthesis of executive English fluency, diplomatic rhetoric, and native eloquence.",
    "xpReward": 50,
    "estimatedMinutes": 10,
    "theory": {
      "summary": "Congratulations on completing the full 90-Day English Learning Journey! You have built C2-level proficiency across grammar, vocabulary, rhetoric, and diplomatic communication.",
      "rules": [
        {
          "rule": "Maintain your native-level executive fluency through continuous exposure, reading, and active communication.",
          "why": "Language mastery is a lifelong practice of refined expression and deep connection.",
          "example": "Having mastered the 90-day curriculum, you communicate with authoritative poise and native nuance.",
          "wrongExample": "Now finished day 90 no more practice needed."
        }
      ],
      "wordExplanations": [
        {
          "word": "Executive Fluency",
          "role": "Mastery Milestone",
          "whyUsed": "Peak international communication proficiency."
        }
      ],
      "proTip": "Pro Tip Day 90: Regular active recall strengthens lifelong language intuition!"
    },
    "quiz": [
      {
        "id": "d90-q1",
        "question": "Which sentence demonstrates correct Day 90 English usage?",
        "options": [
          "Having mastered the 90-day curriculum, you communicate with authoritative poise and native nuance.",
          "Now finished day 90 no more practice needed.",
          "Option 3 with grammatical error on Day 90.",
          "Option 4 with wrong verb tense on Day 90."
        ],
        "correctAnswerIndex": 0,
        "explanationWhy": "The first choice follows standard grammar and native syntactic structure for Day 90.",
        "grammaticalRole": "Target Structure for Day 90"
      }
    ],
    "miniGame": {
      "type": "sentence_builder",
      "title": "Day 90 Interactive Architect",
      "instructions": "Arrange the word blocks in correct sequence!",
      "sentenceBuilder": [
        {
          "targetSentence": "Having mastered the 90-day curriculum, you communicate with authoritative poise and native nuance.",
          "wordPool": [
            "Having",
            "mastered",
            "the",
            "90-day",
            "curriculum",
            "you",
            "communicate",
            "with",
            "authoritative",
            "poise",
            "and",
            "native",
            "nuance"
          ],
          "grammarBreakdown": "Demonstrates target sentence structure for Day 90."
        }
      ]
    }
  }
];
