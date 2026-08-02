export interface WordleWord {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  hindiMeaning: string;
  exampleSentence: string;
  hindiExample?: string;
}

export const WORDLE_DICTIONARY: WordleWord[] = [
  {
    word: "SMART",
    phonetic: "/smɑːrt/",
    partOfSpeech: "adjective",
    definition: "Having or showing a quick-witted intelligence and mental sharpness.",
    hindiMeaning: "चतुर / बुद्धिमान",
    exampleSentence: "She is a smart and ambitious student who learns quickly."
  },
  {
    word: "BRAIN",
    phonetic: "/breɪn/",
    partOfSpeech: "noun",
    definition: "The organ of soft nervous tissue inside the skull, functioning as the coordinating center of sensation and intellect.",
    hindiMeaning: "मस्तिष्क / दिमाग",
    exampleSentence: "Continuous learning keeps your brain active and healthy."
  },
  {
    word: "LEARN",
    phonetic: "/lɜːrn/",
    partOfSpeech: "verb",
    definition: "Gain knowledge or skill in a subject or activity through study, experience, or being taught.",
    hindiMeaning: "सीखना / ज्ञान प्राप्त करना",
    exampleSentence: "Daily speaking practice helps us learn new English vocabulary."
  },
  {
    word: "SPEAK",
    phonetic: "/spiːk/",
    partOfSpeech: "verb",
    definition: "Say something in order to convey information, an opinion, or a feeling.",
    hindiMeaning: "बोलना / सम्भाषण करना",
    exampleSentence: "He can speak three languages with natural confidence."
  },
  {
    word: "SHINE",
    phonetic: "/ʃaɪn/",
    partOfSpeech: "verb",
    definition: "Give out or reflect bright light; excel in a particular activity.",
    hindiMeaning: "चमकना / श्रेष्ठ होना",
    exampleSentence: "The bright stars shine across the night sky."
  },
  {
    word: "DREAM",
    phonetic: "/driːm/",
    partOfSpeech: "noun / verb",
    definition: "A cherished ambition or ideal, or thoughts occurring during sleep.",
    hindiMeaning: "सपना / महत्वाकांक्षा",
    exampleSentence: "She fulfilled her dream of becoming a fluent speaker."
  },
  {
    word: "POWER",
    phonetic: "/ˈpaʊər/",
    partOfSpeech: "noun",
    definition: "The ability or capacity to do something or act in a particular way.",
    hindiMeaning: "शक्ति / सामर्थ्य",
    exampleSentence: "Knowledge and clear communication give you great power."
  },
  {
    word: "FLASH",
    phonetic: "/flæʃ/",
    partOfSpeech: "noun / verb",
    definition: "A sudden brief burst of bright light or a quick display.",
    hindiMeaning: "चमक / झलक",
    exampleSentence: "A flash of inspiration helped her answer the question."
  },
  {
    word: "CLEAR",
    phonetic: "/klɪər/",
    partOfSpeech: "adjective",
    definition: "Easy to perceive, understand, or interpret; transparent.",
    hindiMeaning: "स्पष्ट / साफ़",
    exampleSentence: "His explanation was clear, precise, and easy to follow."
  },
  {
    word: "LIGHT",
    phonetic: "/laɪt/",
    partOfSpeech: "noun / adjective",
    definition: "Natural energy that makes things visible, or having little weight.",
    hindiMeaning: "प्रकाश / हल्का",
    exampleSentence: "Morning sunlight fills the room with warm light."
  },
  {
    word: "SWEET",
    phonetic: "/swiːt/",
    partOfSpeech: "adjective",
    definition: "Having a pleasant taste characteristic of sugar, or delightful in character.",
    hindiMeaning: "मीठा / प्यारा",
    exampleSentence: "Honey has a naturally sweet flavor and rich aroma."
  },
  {
    word: "GRAIN",
    phonetic: "/ɡreɪn/",
    partOfSpeech: "noun",
    definition: "Wheat or any other cultivated cereal crop used as food.",
    hindiMeaning: "अनाज",
    exampleSentence: "Whole grains provide essential fiber and sustained energy."
  },
  {
    word: "CLOUD",
    phonetic: "/klaʊd/",
    partOfSpeech: "noun",
    definition: "A visible mass of condensed water vapor floating in the atmosphere.",
    hindiMeaning: "बादल",
    exampleSentence: "A fluffy white cloud drifted across the bright blue sky."
  },
  {
    word: "FLAME",
    phonetic: "/fleɪm/",
    partOfSpeech: "noun",
    definition: "A hot glowing body of ignited gas produced by something on fire.",
    hindiMeaning: "ज्वाला / लपट",
    exampleSentence: "The candle flame flickered softly in the calm evening."
  },
  {
    word: "PEACE",
    phonetic: "/piːs/",
    partOfSpeech: "noun",
    definition: "Freedom from disturbance, noise, or conflict; tranquility.",
    hindiMeaning: "शांति / सुकून",
    exampleSentence: "Meditation and quiet reading bring inner peace."
  },
  {
    word: "WORLD",
    phonetic: "/wɜːrld/",
    partOfSpeech: "noun",
    definition: "The earth, together with all of its countries, people, and natural features.",
    hindiMeaning: "दुनिया / संसार",
    exampleSentence: "Learning English connects you with people around the world."
  },
  {
    word: "HEART",
    phonetic: "/hɑːrt/",
    partOfSpeech: "noun",
    definition: "The organ that pumps blood, or the central locus of emotion and courage.",
    hindiMeaning: "हृदय / दिल",
    exampleSentence: "Her genuine kind words touched everyone's heart."
  },
  {
    word: "CROWN",
    phonetic: "/kraʊn/",
    partOfSpeech: "noun",
    definition: "A circular ornamental headband worn by a monarch as a symbol of sovereignty.",
    hindiMeaning: "मुकुट / ताज",
    exampleSentence: "The king wore a golden crown embellished with jewels."
  },
  {
    word: "GRACE",
    phonetic: "/ɡreɪs/",
    partOfSpeech: "noun",
    definition: "Simple elegance or refinement of movement, poise, or goodwill.",
    hindiMeaning: "कृपा / लालित्य",
    exampleSentence: "She handled the difficult situation with calm grace."
  },
  {
    word: "TEACH",
    phonetic: "/tiːtʃ/",
    partOfSpeech: "verb",
    definition: "Impart knowledge or skill to someone through instruction or demonstration.",
    hindiMeaning: "सिखाना / पढ़ाना",
    exampleSentence: "Great mentors teach us how to think independently."
  },
  {
    word: "STORY",
    phonetic: "/ˈstɔːri/",
    partOfSpeech: "noun",
    definition: "An account of imaginary or real people and events told for entertainment or education.",
    hindiMeaning: "कहानी / किस्सा",
    exampleSentence: "An inspiring story can motivate you to reach your goals."
  },
  {
    word: "AUDIO",
    phonetic: "/ˈɔːdioʊ/",
    partOfSpeech: "noun",
    definition: "Sound, especially when recorded, transmitted, or reproduced electronically.",
    hindiMeaning: "ऑडियो / ध्वनि",
    exampleSentence: "Listen closely to the audio clip to master pronunciation."
  },
  {
    word: "MUSIC",
    phonetic: "/ˈmjuːzɪk/",
    partOfSpeech: "noun",
    definition: "Vocal or instrumental sounds combined in a harmonious and expressive way.",
    hindiMeaning: "संगीत / गान",
    exampleSentence: "Calming music helps lower stress and sharpen concentration."
  },
  {
    word: "VOICE",
    phonetic: "/vɔɪs/",
    partOfSpeech: "noun",
    definition: "The sound produced in a person's larynx and uttered through the mouth.",
    hindiMeaning: "आवाज़ / स्वर",
    exampleSentence: "Speak with a clear and confident voice during presentations."
  },
  {
    word: "CANDY",
    phonetic: "/ˈkændi/",
    partOfSpeech: "noun",
    definition: "A sweet food made with sugar or syrup, often combined with fruit or chocolate.",
    hindiMeaning: "मिठाई / टॉफी",
    exampleSentence: "Fruit candy is a popular sweet treat among children."
  },
  {
    word: "SMILE",
    phonetic: "/smaɪl/",
    partOfSpeech: "noun / verb",
    definition: "A pleasant facial expression with the corners of the mouth turned up.",
    hindiMeaning: "मुस्कान / मुस्कुराना",
    exampleSentence: "A friendly smile breaks down barriers instantly."
  },
  {
    word: "FRESH",
    phonetic: "/freʃ/",
    partOfSpeech: "adjective",
    definition: "Recently made, picked, or obtained; clean and refreshing.",
    hindiMeaning: "ताज़ा / नया",
    exampleSentence: "Breathing fresh morning air boosts your energy for the day."
  },
  {
    word: "HONOR",
    phonetic: "/ˈɑːnər/",
    partOfSpeech: "noun / verb",
    definition: "High respect, esteem, or a privilege that brings pride.",
    hindiMeaning: "सम्मान / आदर",
    exampleSentence: "It is a great honor to represent our community."
  },
  {
    word: "GREAT",
    phonetic: "/ɡreɪt/",
    partOfSpeech: "adjective",
    definition: "Of an extent, amount, or quality considerably above average.",
    hindiMeaning: "महान / शानदार",
    exampleSentence: "Continuous daily effort yields great long-term results."
  },
  {
    word: "PLANT",
    phonetic: "/plænt/",
    partOfSpeech: "noun / verb",
    definition: "A living organism absorbing water and inorganic substances through roots.",
    hindiMeaning: "पौधा / लगाना",
    exampleSentence: "Planting green trees helps improve environmental air quality."
  },
  {
    word: "MAGIC",
    phonetic: "/ˈmædʒɪk/",
    partOfSpeech: "noun / adjective",
    definition: "The power of influencing events using mysterious or extraordinary forces.",
    hindiMeaning: "जादू / चमत्कार",
    exampleSentence: "Dedicated practice works like magic in mastering languages."
  },
  {
    word: "HAPPY",
    phonetic: "/ˈhæpi/",
    partOfSpeech: "adjective",
    definition: "Feeling or showing pleasure, contentment, or joy.",
    hindiMeaning: "प्रसन्न / खुश",
    exampleSentence: "Sharing achievements with friends makes us feel happy."
  },
  {
    word: "YOUTH",
    phonetic: "/juːθ/",
    partOfSpeech: "noun",
    definition: "The period between childhood and adult age; young people collectively.",
    hindiMeaning: "युवावस्था / युवा",
    exampleSentence: "Investing in education empowers the youth to build the future."
  },
  {
    word: "FAITH",
    phonetic: "/feɪθ/",
    partOfSpeech: "noun",
    definition: "Complete trust or confidence in someone or something.",
    hindiMeaning: "विश्वास / भरोसा",
    exampleSentence: "Have faith in your capability to master English speaking."
  },
  {
    word: "SKILL",
    phonetic: "/skɪl/",
    partOfSpeech: "noun",
    definition: "The ability to do something well; expertise gained through practice.",
    hindiMeaning: "कौशल / हुनर",
    exampleSentence: "Effective listening is a vital communication skill."
  },
  {
    word: "GLORY",
    phonetic: "/ˈɡlɔːri/",
    partOfSpeech: "noun",
    definition: "High honor won by notable achievements; magnificent beauty.",
    hindiMeaning: "गौरव / महिमा",
    exampleSentence: "The hard-working team celebrated their tournament glory."
  },
  {
    word: "HUMAN",
    phonetic: "/ˈhjuːmən/",
    partOfSpeech: "noun / adjective",
    definition: "Relating to or characteristic of humankind.",
    hindiMeaning: "मानव / इंसान",
    exampleSentence: "Empathy and kindness are core human values."
  },
  {
    word: "PRIDE",
    phonetic: "/praɪd/",
    partOfSpeech: "noun",
    definition: "A feeling of deep pleasure or satisfaction derived from achievements.",
    hindiMeaning: "गर्व / स्वाभिमान",
    exampleSentence: "She took great pride in writing her first English essay."
  },
  {
    word: "NOBLE",
    phonetic: "/ˈnoʊbəl/",
    partOfSpeech: "adjective",
    definition: "Having or showing fine personal qualities or high moral principles.",
    hindiMeaning: "श्रेष्ठ / कुलीन",
    exampleSentence: "Helping others overcome learning hurdles is a noble deed."
  },
  {
    word: "STORM",
    phonetic: "/stɔːrm/",
    partOfSpeech: "noun",
    definition: "A violent disturbance of the atmosphere with strong winds, rain, or thunder.",
    hindiMeaning: "तूफान / आंधी",
    exampleSentence: "The sturdy lighthouse stood strong against the ocean storm."
  },
  {
    word: "OCEAN",
    phonetic: "/ˈoʊʃən/",
    partOfSpeech: "noun",
    definition: "A very large expanse of sea covering much of the Earth.",
    hindiMeaning: "महासागर / समुद्र",
    exampleSentence: "Dolphins swim gracefully across the vast blue ocean."
  },
  {
    word: "EARTH",
    phonetic: "/ɜːrθ/",
    partOfSpeech: "noun",
    definition: "The planet on which we live; the world.",
    hindiMeaning: "पृथ्वी / धरती",
    exampleSentence: "Earth is home to billions of diverse living species."
  },
  {
    word: "FRUIT",
    phonetic: "/fruːt/",
    partOfSpeech: "noun",
    definition: "The sweet and fleshy product of a tree or plant containing seed.",
    hindiMeaning: "फल",
    exampleSentence: "Eating fresh fruit daily supports immune health."
  },
  {
    word: "BREAD",
    phonetic: "/bred/",
    partOfSpeech: "noun",
    definition: "Food made of flour, water, and yeast mixed together and baked.",
    hindiMeaning: "रोटी / ब्रेड",
    exampleSentence: "Freshly baked whole wheat bread tastes delicious."
  },
  {
    word: "GREEN",
    phonetic: "/ɡriːn/",
    partOfSpeech: "adjective / noun",
    definition: "The color of growing grass and leaves; environmentally beneficial.",
    hindiMeaning: "हरा / प्राकृतिक",
    exampleSentence: "Green forests produce clean oxygen for our atmosphere."
  },
  {
    word: "LOGIC",
    phonetic: "/ˈlɑːdʒɪk/",
    partOfSpeech: "noun",
    definition: "Reasoning conducted according to strict principles of validity.",
    hindiMeaning: "तर्क / न्यायशास्त्र",
    exampleSentence: "Use clear logic when structuring your argument in debates."
  },
  {
    word: "FOCUS",
    phonetic: "/ˈfoʊkəs/",
    partOfSpeech: "noun / verb",
    definition: "The main center of interest or activity, or concentrating attention.",
    hindiMeaning: "ध्यान / एकाग्रता",
    exampleSentence: "Maintained focus helps solve complex problems quickly."
  },
  {
    word: "TREND",
    phonetic: "/trend/",
    partOfSpeech: "noun",
    definition: "A general direction in which something is developing or changing.",
    hindiMeaning: "प्रवृत्ति / रुझान",
    exampleSentence: "Interactive gamified apps are a growing educational trend."
  },
  {
    word: "GUIDE",
    phonetic: "/ɡaɪd/",
    partOfSpeech: "noun / verb",
    definition: "A person or indicator that shows the way or advises others.",
    hindiMeaning: "मार्गदर्शक / राह दिखाना",
    exampleSentence: "This lesson guide explains tricky grammar rules step-by-step."
  },
  {
    word: "STAGE",
    phonetic: "/steɪdʒ/",
    partOfSpeech: "noun",
    definition: "A raised platform for public speaking or performance; a phase of development.",
    hindiMeaning: "मंच / चरण",
    exampleSentence: "He spoke confidently on stage in front of the entire audience."
  },
  {
    word: "CHARM",
    phonetic: "/tʃɑːrm/",
    partOfSpeech: "noun / verb",
    definition: "The quality of giving delight, attracting admiration, or fascinating.",
    hindiMeaning: "आकर्षण / सम्मोहन",
    exampleSentence: "Her polite manners and warm speech gave her great charm."
  },
  {
    word: "VALOR",
    phonetic: "/ˈvælər/",
    partOfSpeech: "noun",
    definition: "Great courage and bravery in the face of danger or difficulty.",
    hindiMeaning: "वीरता / पराक्रम",
    exampleSentence: "The firefighters were awarded medals for their outstanding valor."
  },
  {
    word: "QUICK",
    phonetic: "/kwɪk/",
    partOfSpeech: "adjective",
    definition: "Moving fast or doing something in a short time; rapid.",
    hindiMeaning: "तेज़ / शीघ्र",
    exampleSentence: "A quick review before exams helps solidify key ideas."
  },
  {
    word: "SHARP",
    phonetic: "/ʃɑːrp/",
    partOfSpeech: "adjective",
    definition: "Having a fine edge or point, or having a quick, keen mind.",
    hindiMeaning: "तेज़ / तीव्र",
    exampleSentence: "She has a sharp mind for identifying grammatical patterns."
  },
  {
    word: "BRAVE",
    phonetic: "/breɪv/",
    partOfSpeech: "adjective",
    definition: "Ready to face and endure danger or difficulty; courageous.",
    hindiMeaning: "बहादुर / साहसी",
    exampleSentence: "Be brave and practice speaking aloud every single day."
  }
];

export function getWordMeaning(searchWord: string): WordleWord {
  const clean = searchWord.toUpperCase().trim();
  const found = WORDLE_DICTIONARY.find(w => w.word.toUpperCase() === clean);
  if (found) return found;

  // Fallback generation for words outside static dictionary
  return {
    word: clean,
    phonetic: `/${clean.toLowerCase()}/`,
    partOfSpeech: "noun / verb",
    definition: `An English word consisting of 5 letters.`,
    hindiMeaning: `${clean} - अंग्रेज़ी शब्द`,
    exampleSentence: `The word "${clean}" can be used in daily English conversation.`
  };
}
