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

export const WORDLE_4LETTER_DICTIONARY: WordleWord[] = [
  { word: "BOOK", phonetic: "/bʊk/", partOfSpeech: "noun", definition: "A written or printed work consisting of pages bound together.", hindiMeaning: "पुस्तक / किताब", exampleSentence: "Reading a book every day expands your English knowledge." },
  { word: "MIND", phonetic: "/maɪnd/", partOfSpeech: "noun", definition: "The element of a person that enables them to be aware of the world and their experiences.", hindiMeaning: "मन / दिमाग", exampleSentence: "Keep an open mind when learning new language skills." },
  { word: "LIFE", phonetic: "/laɪf/", partOfSpeech: "noun", definition: "The condition that distinguishes animals and plants from inorganic matter.", hindiMeaning: "जीवन / ज़िंदगी", exampleSentence: "Continuous learning brings joy to life." },
  { word: "STAR", phonetic: "/stɑːr/", partOfSpeech: "noun", definition: "A luminous astronomical body visible in the night sky.", hindiMeaning: "तारा / सितारा", exampleSentence: "The bright star shines brightly in the night sky." },
  { word: "MOON", phonetic: "/muːn/", partOfSpeech: "noun", definition: "The natural satellite of the earth, visible by reflected light from the sun.", hindiMeaning: "चाँद / चंद्रमा", exampleSentence: "The full moon illuminated the quiet evening." },
  { word: "READ", phonetic: "/riːd/", partOfSpeech: "verb", definition: "Look at and comprehend the meaning of written or printed matter.", hindiMeaning: "पढ़ना", exampleSentence: "I read daily to improve my reading comprehension." },
  { word: "WORK", phonetic: "/wɜːrk/", partOfSpeech: "noun / verb", definition: "Activity involving mental or physical effort done in order to achieve a result.", hindiMeaning: "कार्य / काम", exampleSentence: "Hard work pays off in mastering any subject." },
  { word: "WORD", phonetic: "/wɜːrd/", partOfSpeech: "noun", definition: "A single distinct meaningful element of speech or writing.", hindiMeaning: "शब्द", exampleSentence: "Learn one new word every single day." },
  { word: "TALK", phonetic: "/tɔːk/", partOfSpeech: "verb", definition: "Speak in order to give information or express ideas.", hindiMeaning: "बात करना / बोलना", exampleSentence: "We talk in English to build natural fluency." },
  { word: "HOPE", phonetic: "/hoʊp/", partOfSpeech: "noun / verb", definition: "A feeling of expectation and desire for a certain thing to happen.", hindiMeaning: "आशा / उम्मीद", exampleSentence: "Never lose hope when working toward your goals." },
  { word: "FAST", phonetic: "/fæst/", partOfSpeech: "adjective / adverb", definition: "Moving or capable of moving at high speed.", hindiMeaning: "तेज़ / तीव्र", exampleSentence: "Consistent practice leads to fast progress." },
  { word: "EASY", phonetic: "/ˈiːzi/", partOfSpeech: "adjective", definition: "Achieved without great effort; presenting no difficulty.", hindiMeaning: "आसान / सरल", exampleSentence: "Grammar rules become easy once understood." },
  { word: "TIME", phonetic: "/taɪm/", partOfSpeech: "noun", definition: "The indefinite continued progress of existence and events.", hindiMeaning: "समय / वक्त", exampleSentence: "Manage your study time effectively every day." },
  { word: "LOVE", phonetic: "/lʌv/", partOfSpeech: "noun / verb", definition: "An intense feeling of deep affection.", hindiMeaning: "प्रेम / प्यार", exampleSentence: "They love practicing languages together." },
  { word: "HELP", phonetic: "/hɛlp/", partOfSpeech: "verb / noun", definition: "Make it easier for someone to do something by offering services.", hindiMeaning: "मदद / सहायता", exampleSentence: "Always ask for help when facing difficulties." },
  { word: "BLUE", phonetic: "/bluː/", partOfSpeech: "noun / adjective", definition: "The color of the clear sky and the deep sea.", hindiMeaning: "नीला रंग", exampleSentence: "The sky is clear and blue today." },
  { word: "GOLD", phonetic: "/ɡoʊld/", partOfSpeech: "noun", definition: "A yellow precious metal, chemical element of atomic number 79.", hindiMeaning: "सोना / स्वर्ण", exampleSentence: "Gold has been valued throughout human history." },
  { word: "KIND", phonetic: "/kaɪnd/", partOfSpeech: "adjective", definition: "Having or showing a friendly, generous, and considerate nature.", hindiMeaning: "दयालु / प्रकार", exampleSentence: "Always be kind and encouraging to others." },
  { word: "HERO", phonetic: "/ˈhɪəroʊ/", partOfSpeech: "noun", definition: "A person who is admired for their courage, outstanding achievements, or noble qualities.", hindiMeaning: "नायक / वीर", exampleSentence: "He became a local hero after saving the puppy." },
  { word: "COOL", phonetic: "/kuːl/", partOfSpeech: "adjective", definition: "Fairly cold, or fashionably attractive and impressive.", hindiMeaning: "शीतल / शानदार", exampleSentence: "A cool breeze refreshed everyone during the walk." },
  { word: "FREE", phonetic: "/friː/", partOfSpeech: "adjective", definition: "Not under the control or in the power of another.", hindiMeaning: "मुफ़्त / स्वतंत्र", exampleSentence: "Feel free to ask any questions during the lesson." },
  { word: "GAME", phonetic: "/ɡeɪm/", partOfSpeech: "noun", definition: "A form of play or sport, especially one with rules.", hindiMeaning: "खेल", exampleSentence: "Word games make vocabulary building fun." },
  { word: "BEST", phonetic: "/bɛst/", partOfSpeech: "adjective", definition: "Of the most excellent, effective, or desirable type.", hindiMeaning: "सर्वश्रेष्ठ / सबसे अच्छा", exampleSentence: "Always try your best in every challenge." },
  { word: "TEAM", phonetic: "/tiːm/", partOfSpeech: "noun", definition: "A group of players forming one side in a competitive game.", hindiMeaning: "दल / टीम", exampleSentence: "Our study team helps each other improve." },
  { word: "WIND", phonetic: "/wɪnd/", partOfSpeech: "noun", definition: "The perceptible natural movement of the air.", hindiMeaning: "हवा / पवन", exampleSentence: "A gentle wind rustled through the green leaves." },
  { word: "SNOW", phonetic: "/snoʊ/", partOfSpeech: "noun", definition: "Atmospheric water vapor frozen into ice crystals.", hindiMeaning: "बर्फ / हिम", exampleSentence: "Fresh snow covered the mountain peaks." },
  { word: "RAIN", phonetic: "/reɪn/", partOfSpeech: "noun", definition: "Moisture condensed from the atmosphere that falls in drops.", hindiMeaning: "बारिश / वर्षा", exampleSentence: "The soothing sound of rain filled the quiet night." },
  { word: "DEEP", phonetic: "/diːp/", partOfSpeech: "adjective", definition: "Extending far down from the top or surface.", hindiMeaning: "गहरा / गंभीर", exampleSentence: "Take a deep breath before speaking confidently." },
  { word: "RICH", phonetic: "/rɪtʃ/", partOfSpeech: "adjective", definition: "Having a great deal of money or assets; plentiful.", hindiMeaning: "धनी / समृद्ध", exampleSentence: "English has a rich history and vast vocabulary." },
  { word: "WILD", phonetic: "/waɪld/", partOfSpeech: "adjective", definition: "Living or growing in the natural environment.", hindiMeaning: "जंगली / प्राकृतिक", exampleSentence: "Wild animals roam freely in the forest reserve." },
  { word: "SURE", phonetic: "/ʃʊər/", partOfSpeech: "adjective", definition: "Confident in what one thinks or knows; having no doubt.", hindiMeaning: "पक्का / निश्चित", exampleSentence: "Are you sure about your answer?" },
  { word: "TRUE", phonetic: "/truː/", partOfSpeech: "adjective", definition: "In accordance with fact or reality.", hindiMeaning: "सत्य / सच", exampleSentence: "A true friend is always supportive and honest." },
  { word: "REAL", phonetic: "/riːəl/", partOfSpeech: "adjective", definition: "Actually existing or occurring; not imagined or supposed.", hindiMeaning: "वास्तविक / असली", exampleSentence: "Practice with real conversations for fast progress." },
  { word: "SAFE", phonetic: "/seɪf/", partOfSpeech: "adjective", definition: "Protected from or not exposed to danger or risk.", hindiMeaning: "सुरक्षित", exampleSentence: "Keep your study notes in a safe place." },
  { word: "GROW", phonetic: "/ɡroʊ/", partOfSpeech: "verb", definition: "Undergo natural development by increasing in size and capacity.", hindiMeaning: "बढ़ना / विकसित होना", exampleSentence: "Daily study helps your vocabulary grow rapidly." },
  { word: "RISE", phonetic: "/raɪz/", partOfSpeech: "verb", definition: "Move upward or increase in amount, number, or degree.", hindiMeaning: "उठना / वृद्धि", exampleSentence: "The sun begins to rise early in the morning." },
  { word: "PLAY", phonetic: "/pleɪ/", partOfSpeech: "verb", definition: "Engage in activity for enjoyment and recreation.", hindiMeaning: "खेलना", exampleSentence: "Children play happily in the neighborhood park." },
  { word: "WALK", phonetic: "/wɔːk/", partOfSpeech: "verb", definition: "Move at a regular pace by lifting and setting down each foot.", hindiMeaning: "टहलना / चलना", exampleSentence: "A morning walk keeps the mind fresh and active." },
  { word: "HOME", phonetic: "/hoʊm/", partOfSpeech: "noun", definition: "The place where one lives permanently.", hindiMeaning: "घर / गृह", exampleSentence: "Home is where family comes together." },
  { word: "CITY", phonetic: "/ˈsɪti/", partOfSpeech: "noun", definition: "A large human settlement with organized infrastructure.", hindiMeaning: "शहर / नगर", exampleSentence: "The vibrant city lights lit up the evening skyline." }
];

export const WORDLE_6LETTER_DICTIONARY: WordleWord[] = [
  { word: "ACTION", phonetic: "/ˈæk.ʃən/", partOfSpeech: "noun", definition: "The fact or process of doing something, typically to achieve an aim.", hindiMeaning: "कार्य / क्रिया", exampleSentence: "Taking daily action is the key to building strong habits." },
  { word: "ACTIVE", phonetic: "/ˈæk.tɪv/", partOfSpeech: "adjective", definition: "Engaging or ready to engage in physically energetic pursuits.", hindiMeaning: "सक्रिय / चुस्त", exampleSentence: "An active mind absorbs new English concepts rapidly." },
  { word: "BEAUTY", phonetic: "/ˈbjuː.ti/", partOfSpeech: "noun", definition: "A combination of qualities that pleases the aesthetic senses.", hindiMeaning: "सुंदरता / सौंदर्य", exampleSentence: "The beauty of nature inspires peace and creativity." },
  { word: "CHANGE", phonetic: "/tʃeɪndʒ/", partOfSpeech: "noun / verb", definition: "Make or become different.", hindiMeaning: "बदलाव / परिवर्तन", exampleSentence: "Positive change happens step by step through daily study." },
  { word: "CLEVER", phonetic: "/ˈklɛv.ər/", partOfSpeech: "adjective", definition: "Quick to understand, learn, and devise ideas.", hindiMeaning: "चतुर / होशियार", exampleSentence: "She solved the difficult puzzle with a clever idea." },
  { word: "DANCE", phonetic: "/dæns/", partOfSpeech: "verb / noun", definition: "Move rhythmically to music, typically following a set sequence of steps.", hindiMeaning: "नृत्य / नाचना", exampleSentence: "Music makes people want to dance and celebrate." },
  { word: "DRIVEN", phonetic: "/ˈdrɪv.ən/", partOfSpeech: "adjective", definition: "Motivated by a strong determination to succeed.", hindiMeaning: "प्रेरित / लक्ष्यबद्ध", exampleSentence: "A driven student practices consistently every single day." },
  { word: "ENERGY", phonetic: "/ˈɛn.ər.dʒi/", partOfSpeech: "noun", definition: "The strength and vitality required for sustained physical or mental activity.", hindiMeaning: "ऊर्जा / शक्ति", exampleSentence: "High energy helps you stay focused during learning." },
  { word: "FAMILY", phonetic: "/ˈfæm.ɪ.li/", partOfSpeech: "noun", definition: "A group of one or more parents and their children living together as a unit.", hindiMeaning: "परिवार / कुटुंब", exampleSentence: "Spending quality time with family brings lasting happiness." },
  { word: "FRIEND", phonetic: "/frɛnd/", partOfSpeech: "noun", definition: "A person with whom one has a bond of mutual affection.", hindiMeaning: "मित्र / दोस्त", exampleSentence: "A good friend always encourages you to do your best." },
  { word: "FUTURE", phonetic: "/ˈfjuː.tʃər/", partOfSpeech: "noun", definition: "A period of time following the moment of speaking or writing.", hindiMeaning: "भविष्य", exampleSentence: "Investing in education creates a bright future." },
  { word: "GARDEN", phonetic: "/ˈɡɑːr.dən/", partOfSpeech: "noun", definition: "A piece of ground used for growing flowers, fruit, or vegetables.", hindiMeaning: "बगीचा / उद्यान", exampleSentence: "Colorful flowers bloom in the neighborhood garden." },
  { word: "GLOBAL", phonetic: "/ˈɡloʊ.bəl/", partOfSpeech: "adjective", definition: "Relating to the whole world; worldwide.", hindiMeaning: "वैश्विक / दुनिया भर में", exampleSentence: "English is a global language that connects people everywhere." },
  { word: "GROWTH", phonetic: "/ɡroʊθ/", partOfSpeech: "noun", definition: "The process of increasing in physical size or mental capacity.", hindiMeaning: "विकास / वृद्धि", exampleSentence: "Personal growth comes from trying new challenges." },
  { word: "HONEST", phonetic: "/ˈɒn.ɪst/", partOfSpeech: "adjective", definition: "Free of deceit and untruthfulness; sincere.", hindiMeaning: "ईमानदार / सच्चा", exampleSentence: "An honest answer builds trust and good relationships." },
  { word: "IMPACT", phonetic: "/ˈɪm.pækt/", partOfSpeech: "noun", definition: "The marked effect or influence of something.", hindiMeaning: "प्रभाव / असर", exampleSentence: "Effective communication has a powerful impact on success." },
  { word: "INSIGHT", phonetic: "/ˈɪn.saɪt/", partOfSpeech: "noun", definition: "The capacity to gain an accurate and deep intuitive understanding.", hindiMeaning: "अंतर्दृष्टि / समझ", exampleSentence: "Deep insights make grammar rules easy to understand." },
  { word: "LEADER", phonetic: "/ˈliː.dər/", partOfSpeech: "noun", definition: "The person who leads or commands a group, organization, or country.", hindiMeaning: "नेता / मार्गदर्शक", exampleSentence: "A great leader inspires others through clear words." },
  { word: "MASTER", phonetic: "/ˈmæs.tər/", partOfSpeech: "noun / verb", definition: "Acquire complete knowledge or skill in an accomplishment or subject.", hindiMeaning: "माहिर होना / स्वामी", exampleSentence: "With daily practice, you will master conversational English." },
  { word: "MEMORY", phonetic: "/ˈmɛm.ər.i/", partOfSpeech: "noun", definition: "The faculty by which the mind stores and remembers information.", hindiMeaning: "स्मृति / याददाश्त", exampleSentence: "Spaced repetition helps lock vocabulary into long-term memory." },
  { word: "MODERN", phonetic: "/ˈmɒd.ərn/", partOfSpeech: "adjective", definition: "Relating to the present or recent times as opposed to the remote past.", hindiMeaning: "आधुनिक / नवीन", exampleSentence: "Modern learning tools make language practice engaging." },
  { word: "NATURE", phonetic: "/ˈneɪ.tʃər/", partOfSpeech: "noun", definition: "The physical world including plants, animals, landscapes, and natural features.", hindiMeaning: "प्रकृति / स्वभाव", exampleSentence: "Walking in nature refreshes the mind and reduces stress." },
  { word: "PLANET", phonetic: "/ˈplæn.ɪt/", partOfSpeech: "noun", definition: "A celestial body moving in an elliptical orbit around a star.", hindiMeaning: "ग्रह", exampleSentence: "Earth is a unique planet capable of supporting life." },
  { word: "POLITE", phonetic: "/pəˈlaɪt/", partOfSpeech: "adjective", definition: "Having or showing behavior that is respectful and considerate of others.", hindiMeaning: "विनम्र / सभ्य", exampleSentence: "Using polite phrases makes social interactions smoother." },
  { word: "REASON", phonetic: "/ˈriː.zən/", partOfSpeech: "noun", definition: "A cause, explanation, or justification for an action or event.", hindiMeaning: "कारण / वजह", exampleSentence: "Understanding the reason behind rules helps long-term recall." },
  { word: "SEARCH", phonetic: "/sɜːrtʃ/", partOfSpeech: "verb / noun", definition: "Try to find something by looking or otherwise seeking carefully.", hindiMeaning: "खोजना / तलाश", exampleSentence: "Search for opportunities to speak English aloud." },
  { word: "SILENT", phonetic: "/ˈsaɪ.lənt/", partOfSpeech: "adjective", definition: "Not making or accompanied by any sound; quiet.", hindiMeaning: "शांत / मौन", exampleSentence: "A silent library is a peaceful place for deep study." },
  { word: "SPIRIT", phonetic: "/ˈspɪr.ɪt/", partOfSpeech: "noun", definition: "The non-physical part of a person which is the seat of emotions and character.", hindiMeaning: "आत्मा / उत्साह", exampleSentence: "Keep a positive spirit when learning something new." },
  { word: "STRONG", phonetic: "/strɒŋ/", partOfSpeech: "adjective", definition: "Having the power to move heavy weights or perform heavy tasks.", hindiMeaning: "मजबूत / बलवान", exampleSentence: "Building a strong vocabulary empowers confidence." },
  { word: "SUMMER", phonetic: "/ˈsʌm.ər/", partOfSpeech: "noun", definition: "The warmest season of the year, between spring and autumn.", hindiMeaning: "गर्मी का मौसम", exampleSentence: "Warm summer days are great for outdoor activities." },
  { word: "SYSTEM", phonetic: "/ˈsɪs.təm/", partOfSpeech: "noun", definition: "A set of things working together as parts of a mechanism or network.", hindiMeaning: "प्रणाली / तंत्र", exampleSentence: "A structured study system ensures steady improvement." },
  { word: "TRAVEL", phonetic: "/ˈtræv.əl/", partOfSpeech: "verb / noun", definition: "Make a journey, typically of some length or abroad.", hindiMeaning: "यात्रा करना", exampleSentence: "Traveling opens up opportunities to practice new languages." },
  { word: "UNIQUE", phonetic: "/juːˈniːk/", partOfSpeech: "adjective", definition: "Being the only one of its kind; unlike anything else.", hindiMeaning: "अनोखा / अद्वितीय", exampleSentence: "Everyone has a unique way of processing language concepts." },
  { word: "VISION", phonetic: "/ˈvɪʒ.ən/", partOfSpeech: "noun", definition: "The state of being able to see, or the ability to think about the future with wisdom.", hindiMeaning: "दृष्टि / दृष्टिकोण", exampleSentence: "A clear vision guides your learning roadmap effectively." },
  { word: "WISDOM", phonetic: "/ˈwɪz.dəm/", partOfSpeech: "noun", definition: "The quality of having experience, knowledge, and good judgment.", hindiMeaning: "बुद्धिमत्ता / ज्ञान", exampleSentence: "Wisdom grows through experience and continuous reflection." },
  { word: "WONDER", phonetic: "/ˈwʌn.dər/", partOfSpeech: "noun / verb", definition: "A feeling of surprise mingled with admiration, caused by something beautiful.", hindiMeaning: "आश्चर्य / चमत्कार", exampleSentence: "The child looked at the starry sky with pure wonder." }
];

export const WORDLE_7LETTER_DICTIONARY: WordleWord[] = [
  { word: "ANIMALS", phonetic: "/ˈæn.ɪ.məlzi/", partOfSpeech: "noun (plural)", definition: "Living organisms that feed on organic matter, typically having specialized sense organs.", hindiMeaning: "जानवर / पशु", exampleSentence: "Wild animals live freely in the national park." },
  { word: "PANTIES", phonetic: "/ˈpæn.tiz/", partOfSpeech: "noun (plural)", definition: "An undergarment worn by women and girls.", hindiMeaning: "अंतर्वस्त्र / अंडरगारमेंट", exampleSentence: "Soft cotton garments provide comfortable daily wear." },
  { word: "TEACHER", phonetic: "/ˈtiː.tʃər/", partOfSpeech: "noun", definition: "A person who helps students acquire knowledge, competence, or virtue.", hindiMeaning: "शिक्षक / अध्यापक", exampleSentence: "An inspiring teacher encourages students to ask thoughtful questions." },
  { word: "STUDENT", phonetic: "/ˈstjuː.dənt/", partOfSpeech: "noun", definition: "A person who is studying at a school, college, or university.", hindiMeaning: "छात्र / विद्यार्थी", exampleSentence: "The dedicated student practices English vocabulary every day." },
  { word: "FARMERS", phonetic: "/ˈfɑːr.mərz/", partOfSpeech: "noun (plural)", definition: "People who own or manage a farm to grow crops and raise animals.", hindiMeaning: "किसान / कृषक", exampleSentence: "Hardworking farmers supply fresh produce to the local markets." },
  { word: "DOCTORS", phonetic: "/ˈdɒk.tərz/", partOfSpeech: "noun (plural)", definition: "Qualified medical practitioners who diagnose and treat health conditions.", hindiMeaning: "चिकित्सक / डॉक्टर", exampleSentence: "Experienced doctors work tirelessly to care for patients." },
  { word: "JOURNEY", phonetic: "/ˈdʒɜːr.ni/", partOfSpeech: "noun", definition: "An act of traveling from one place to another.", hindiMeaning: "यात्रा / सफर", exampleSentence: "Learning a new language is a rewarding lifelong journey." },
  { word: "WEATHER", phonetic: "/ˈwɛð.ər/", partOfSpeech: "noun", definition: "The state of the atmosphere at a place and time regarding heat, cloudiness, dryness, sunshine, wind, and rain.", hindiMeaning: "मौसम / जलवायु", exampleSentence: "The pleasant spring weather makes walking outdoors enjoyable." },
  { word: "COUNTRY", phonetic: "/ˈkʌn.tri/", partOfSpeech: "noun", definition: "A nation with its own government, occupying a particular territory.", hindiMeaning: "देश / राष्ट्र", exampleSentence: "India is a vibrant country rich in culture and diversity." },
  { word: "COMPANY", phonetic: "/ˈkʌm.pə.ni/", partOfSpeech: "noun", definition: "A commercial business or the presence of others.", hindiMeaning: "कंपनी / संगठन", exampleSentence: "She works for an innovative technology company." }
];

export function getWordsForLength(length: number): WordleWord[] {
  if (length === 4) return WORDLE_4LETTER_DICTIONARY;
  if (length === 6) return WORDLE_6LETTER_DICTIONARY;
  if (length === 7) return WORDLE_7LETTER_DICTIONARY;
  return WORDLE_DICTIONARY; // Default 5 letters
}

// Extra words valid set for 4, 5, 6, 7 letter words
export const EXTENDED_VALID_4LETTER_WORDS: string[] = [
  "ABLE", "ACID", "AGED", "ALSO", "AREA", "ARMY", "AWAY", "BABY", "BACK", "BALL",
  "BAND", "BANK", "BASE", "BATH", "BEAR", "BEAT", "BEEN", "BELL", "BELT", "BEST",
  "BIRD", "BLOW", "BLUE", "BOAT", "BODY", "BOND", "BONE", "BOOK", "BORN", "BOTH",
  "BOWL", "BULK", "BURN", "BUSH", "BUSY", "CALL", "CALM", "CAME", "CAMP", "CARD",
  "CARE", "CASE", "CASH", "CAST", "CELL", "CHAT", "CHIP", "CITY", "CLUB", "COAL",
  "COAT", "CODE", "COLD", "COOK", "COOL", "COPY", "CORE", "COST", "CREW", "CROP",
  "DARK", "DATA", "DATE", "DAWN", "DAYS", "DEAD", "DEAF", "DEAL", "DEAN", "DEAR",
  "DEEP", "DESK", "DIET", "DISC", "DISK", "DOOR", "DOSE", "DOWN", "DRAW", "DROP",
  "DRUG", "DUAL", "DUCK", "DUTY", "EACH", "EARN", "EASE", "EAST", "EASY", "EDGE",
  "ELSE", "EVEN", "EVER", "EVIL", "EXAM", "EXIT", "FACE", "FACT", "FAIR", "FALL",
  "FARM", "FAST", "FATE", "FEAR", "FEED", "FEEL", "FEET", "FILE", "FILL", "FILM",
  "FIND", "FINE", "FIRE", "FIRM", "FISH", "FLAT", "FLOW", "FOLK", "FOOD", "FOOT",
  "FORM", "FORT", "FOUR", "FREE", "FROM", "FUEL", "FULL", "FUND", "GAIN", "GAME",
  "GATE", "GEAR", "GIFT", "GIRL", "GIVE", "GLAD", "GOAL", "GOLD", "GOLF", "GONE",
  "GOOD", "GRAY", "GREY", "GROW", "GULF", "HALF", "HALL", "HAND", "HANG", "HARD",
  "HAVE", "HEAD", "HEAR", "HEAT", "HELL", "HELP", "HERE", "HERO", "HIGH", "HILL",
  "HIRE", "HOLD", "HOLE", "HOLY", "HOME", "HOPE", "HOST", "HOUR", "HUGE", "HUNG",
  "HUNT", "HURT", "IDEA", "INCH", "INTO", "IRON", "ITEM", "JACK", "JOIN", "JUMP",
  "JUST", "KEEP", "KENT", "KEPT", "KICK", "KILL", "KIND", "KING", "KNEE", "KNOW",
  "LACK", "LADY", "LAKE", "LAND", "LANE", "LAST", "LATE", "LEAD", "LEAF", "LEAN",
  "LEFT", "LESS", "LIFE", "LIFT", "LIGHT", "LIKE", "LINE", "LINK", "LION", "LIST",
  "LIVE", "LOAD", "LOAN", "LOCK", "LOGO", "LONG", "LOOK", "LORD", "LOSS", "LOTS",
  "LOVE", "LUCK", "MAIN", "MAKE", "MALE", "MANY", "MAPS", "MARK", "MASS", "MATH",
  "MEAL", "MEAN", "MEAT", "MEET", "MIND", "MINE", "MOON", "MORE", "MOST", "MOVE",
  "MUCH", "NAME", "NAVY", "NEAR", "NECK", "NEED", "NEWS", "NEXT", "NICE", "NIGHT",
  "NONE", "NOON", "NORM", "NOSE", "NOTE", "OKAY", "ONCE", "ONLY", "OPEN", "ORAL",
  "PACK", "PAGE", "PAIN", "PAIR", "PARK", "PART", "PASS", "PATH", "PEAK", "PICK",
  "PINK", "PIPE", "PLAN", "PLAY", "PLOT", "PLUG", "PLUS", "POEM", "POET", "POLE",
  "POLL", "POOL", "POOR", "PORT", "POST", "PURE", "PUSH", "RACE", "RAIL", "RAIN",
  "RANK", "RARE", "RATE", "READ", "REAL", "REAR", "RELY", "RENT", "REST", "RICE",
  "RICH", "RIDE", "RING", "RISE", "RISK", "ROAD", "ROCK", "ROLE", "ROLL", "ROOF",
  "ROOM", "ROOT", "ROSE", "RULE", "RUSH", "SAFE", "SAID", "SAIL", "SALE", "SAME",
  "SAND", "SAVE", "SEAT", "SEED", "SEEK", "SEEM", "SEEN", "SELF", "SELL", "SEND",
  "SHIP", "SHOP", "SHOT", "SHOW", "SHUT", "SICK", "SIDE", "SIGN", "SILK", "SITE",
  "SIZE", "SKIN", "SLOW", "SNOW", "SOAP", "SOFT", "SOIL", "SOLD", "SOLE", "SOME",
  "SONG", "SOON", "SORT", "SOUL", "SPOT", "STAR", "STAY", "STEP", "STOP", "SUCH",
  "SUIT", "SURE", "SWIM", "TAIL", "TAKE", "TALK", "TALL", "TANK", "TAPE", "TASK",
  "TEAM", "TEAR", "TECH", "TELL", "TERM", "TEST", "TEXT", "THAT", "THEM", "THEN",
  "THEY", "THIN", "THIS", "THUS", "TIME", "TINY", "TIP", "TOOL", "TOWN", "TREE",
  "TRIP", "TRUE", "TUBE", "TURN", "TWIN", "TYPE", "UNIT", "UPON", "URBAN", "USED",
  "USER", "VARY", "VAST", "VERY", "VIEW", "VOTE", "WAGE", "WAIT", "WAKE", "WALK",
  "WALL", "WANT", "WARM", "WASH", "WAVE", "WAYS", "WEAK", "WEAR", "WEEK", "WELL",
  "WEST", "WHAT", "WHEN", "WHICH", "WIDE", "WILD", "WILL", "WIND", "WINE", "WING",
  "WISH", "WITH", "WOOD", "WORD", "WORK", "WORLD", "YARD", "YEAR", "ZERO", "ZONE"
];

export const EXTENDED_VALID_6LETTER_WORDS: string[] = [
  "ACCEPT", "ACCESS", "ACCORD", "ACROSS", "ACTION", "ACTIVE", "ACTUAL", "ADVICE", "ADVISE", "AFFECT",
  "AFFORD", "AGAINST", "AGENCY", "AGENDA", "ALMOST", "ALWAYS", "AMOUNT", "ANIMAL", "ANNUAL", "ANSWER",
  "ANYONE", "ANYWAY", "APPEAR", "ASTATIC", "AROUND", "ARRIVE", "ARTIST", "ASPECT", "ASSIST", "ASSUME",
  "ATTACK", "ATTEND", "AUTHOR", "AUTUMN", "AVENUE", "BAKERY", "BEAUTY", "BECOME", "BEFORE", "BEHIND",
  "BELIEF", "BELONG", "BESIDE", "BETTER", "BEYOND", "BISHOP", "BORDER", "BORROW", "BOTTLE", "BOTTOM",
  "BRANCH", "BREATH", "BRIDGE", "BRIGHT", "BROKEN", "BUDGET", "BURDEN", "CAMERA", "CANDLE", "CAMPUS",
  "CANCER", "CANDID", "CARBON", "CAREER", "CASTLE", "CASUAL", "CAUGHT", "CENTER", "CENTURY", "CHAIRS",
  "CHANCE", "CHANGE", "CHARGE", "CHARM", "CHEAP", "CHEESE", "CHERRY", "CHOICE", "CHOOSE", "CHURCH",
  "CIRCLE", "CLIENT", "CLIMATE", "CLOTHES", "CLOUDY", "COFFEE", "COLLAR", "COLUMN", "COMBAT", "COMEDY",
  "COMMON", "COPPER", "CORNER", "COUNTY", "COUPLE", "COURT", "COUSIN", "CREDIT", "CRIME", "CRISIS",
  "CUSTOM", "DAMAGE", "DANGER", "DATED", "DEBATE", "DECIDE", "DECREASE", "DEFEND", "DEGREE", "DEMAND",
  "DESIGN", "DESIRE", "DETAIL", "DETECT", "DEVICE", "DIRECT", "DOCTOR", "DOMAIN", "DOUBLE", "DRAGON",
  "DREAM", "DRIVEN", "DRIVER", "DURING", "EASILY", "EATING", "EFFECT", "EFFORT", "EIGHTH", "EITHER",
  "ELEVEN", "EMERGE", "EMPIRE", "EMPLOY", "ENABLE", "ENERGY", "ENGINE", "ENOUGH", "ENSURE", "ENTIRE",
  "ESCAPE", "ESTATE", "ETHICS", "EXCEED", "EXCEPT", "EXCUSE", "EXPAND", "EXPECT", "EXPERT", "EXPORT",
  "EXTEND", "EXTENT", "FABRIC", "FACTOR", "FAMILY", "FAMOUS", "FATHER", "FELLOW", "FEMALE", "FIGURE",
  "FILING", "FILTER", "FINALE", "FINGER", "FINISH", "FISCAL", "FLIGHT", "FLOWER", "FLYING", "FOLDER",
  "FOLLOW", "FOREST", "FORGET", "FORMAL", "FORMAT", "FORMER", "FOSTER", "FOURTH", "FRIEND", "FUTURE",
  "GARDEN", "GATHER", "GENDER", "GENTLE", "GLOBAL", "GOLDEN", "GROUND", "GROWTH", "HANDLE", "HAPPEN",
  "HARDLY", "HEALTH", "HEAVEN", "HEIGHT", "HIDDEN", "HOLDER", "HONEST", "IMPACT", "IMPORT", "INCOME",
  "INDIGO", "INJURY", "INSIGHT", "INTENT", "INVEST", "ISLAND", "ITSELF", "JACKET", "JUNGLE", "JUNIOR",
  "KEEPER", "KERNEL", "KITCHEN", "LADDER", "LANDING", "LATEST", "LIVING", "LONDON", "LUXURY", "MAGNET",
  "MAJORITY", "MANAGE", "MANNER", "MANUAL", "MARGIN", "MARKET", "MARTIN", "MASTER", "MATTER", "MEMORY",
  "MENTAL", "METHOD", "MIDDLE", "MODERN", "MOMENT", "MOTHER", "MOTION", "MUSEUM", "MUTUAL", "MYSTERY",
  "NATION", "NATIVE", "NATURE", "NEIGHBOR", "NORMAL", "NOTICE", "NUMBER", "OBJECT", "OBTAIN", "OFFICE",
  "ONLINE", "OPTION", "ORANGE", "ORIGIN", "OUTPUT", "PARENT", "PATIENT", "PATTERN", "PEOPLE", "PEPPER",
  "PERIOD", "PERSON", "PLANET", "PLAYER", "PLEASE", "POCKET", "POLICE", "POLICY", "POLITE", "POTATO",
  "POWDER", "POWERFUL", "PRACTICE", "PREFER", "PRESERVE", "PRESS", "PREVENT", "PRICE", "PRIDE", "PRIEST",
  "PRINCE", "PRISON", "PROFIT", "PROMPT", "PROPER", "PROTECT", "PROVE", "PUBLIC", "PUNISH", "PUPIL",
  "PURPLE", "PURPOSE", "PURSUE", "QUALITY", "QUESTION", "RABBIT", "RATHER", "RATING", "READER", "REALLY",
  "REASON", "RECIPE", "RECORD", "REDUCE", "REFORM", "REFUSE", "REGION", "REGRET", "RELATE", "RELIEF",
  "REMAIN", "REMEDY", "REMOVE", "REPAIR", "REPEAT", "REPORT", "RESCUE", "RESULT", "RETAIL", "RETAIN",
  "RETURN", "REVEAL", "REVIEW", "REWARD", "RHYTHM", "RISING", "ROCKET", "SAFETY", "SALARY", "SAMPLE",
  "SAVING", "SCHEME", "SCHOOL", "SCREEN", "SCRIPT", "SEARCH", "SEASON", "SECOND", "SECRET", "SECTOR",
  "SECURE", "SENIOR", "SENSOR", "SERIES", "SERVER", "SETTLE", "SEVERE", "SHADOW", "SHARED", "SHIELD",
  "SHOULD", "SILENT", "SILVER", "SIMPLE", "SINGLE", "SISTER", "SKILL", "SLIGHT", "SMOOTH", "SOCIAL",
  "SOCIETY", "SOURCE", "SPEECH", "SPIRIT", "SPREAD", "SPRING", "STABLE", "STATUS", "STREAM", "STREET",
  "STRESS", "STRICT", "STRIKE", "STRING", "STRONG", "STUDIO", "SUMMER", "SUNDAY", "SUNRISE", "SUPERB",
  "SUPPLY", "SYSTEM", "TARGET", "TAXATION", "TEMPLE", "TENNIS", "THANKS", "THEORY", "THIRTY", "THREAT",
  "TIMING", "TISSUE", "TOWARD", "TRAVEL", "TREATY", "TUNNEL", "TWELVE", "TWENTY", "UNIQUE", "UNITED",
  "UPDATE", "URGENT", "USEFUL", "VALUABLE", "VICTOR", "VIOLIN", "VISION", "VISUAL", "VOLUME", "WALKER",
  "WALLET", "WANDER", "WARMTH", "WEALTH", "WEAPON", "WEEKLY", "WEIGHT", "WINDOW", "WINTER", "WISDOM",
  "WITHIN", "WONDER", "WORKER", "WRITER", "YELLOW"
];

// Additional common plural & s-suffix words list
export const EXTENDED_VALID_5LETTER_WORDS: string[] = [
  "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
  "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIEN", "ALIGN", "ALIKE", "ALIVE",
  "ALLOW", "ALONG", "ALOUD", "ALTER", "AMONG", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE",
  "APPLY", "ARENA", "ARGUE", "ARISE", "ARMED", "ARRAY", "ARROW", "ASIDE", "ASSET", "AUDIO",
  "AUDIT", "AVOID", "AWAKE", "AWARE", "AWARE", "AWFUL", "BADLY", "BAKER", "BASIS", "BEACH",
  "BEGAN", "BEGIN", "BEGUN", "BEING", "BELOW", "BENCH", "BENEF", "BLACK", "BLADE", "BLAME",
  "BLANK", "BLAST", "BLEED", "BLEND", "BLESS", "BLIND", "BLOCK", "BLOOD", "BLOOM", "BLOWN",
  "BLUE", "BOARD", "BOAST", "BOMBS", "BONUS", "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAKE",
  "BRAND", "BRASS", "BRAVE", "BREAD", "BREAK", "BREED", "BRIEF", "BRING", "BROAD", "BROKE",
  "BROWN", "BRUSH", "BUDDY", "BUILD", "BUNCH", "BURST", "BUYER", "CABIN", "CABLE", "CACHE",
  "CANDY", "CANOE", "CARDS", "CARRY", "CATCH", "CAUSE", "CHAIN", "CHAIR", "CHALK", "CHAOS",
  "CHARM", "CHART", "CHASE", "CHEAP", "CHECK", "CHEEK", "CHEER", "CHESS", "CHEST", "CHIEF",
  "CHILD", "CHILL", "CHINA", "CHIPS", "CHOIR", "CHOSE", "CIVIL", "CLAIM", "CLASS", "CLEAN",
  "CLEAR", "CLIMB", "CLOCK", "CLOSE", "CLOTH", "CLOUD", "CLOWN", "CLUES", "COACH", "COAST",
  "COUNT", "COURT", "COVER", "CRACK", "CRAFT", "CRASH", "CRAWL", "CRAZY", "CREAM", "CRIME",
  "CRISP", "CROSS", "CROWD", "CROWN", "CRUDE", "CRUEL", "CRUSH", "CULTURE", "CURVE", "CYCLE",
  "DAILY", "DANCE", "DATED", "EAGER", "EARLY", "EARTH", "EIGHT", "ELBOW", "ELDER", "ELECT",
  "ELITE", "EMPTY", "ENEMY", "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR", "EVENT", "EVERY",
  "EXACT", "EXIST", "EXTRA", "FAINT", "FAIRLY", "FAITH", "FALSE", "FANCY", "FATAL", "FAULT",
  "FAVOR", "FEAST", "FEVER", "FEWER", "FIBER", "FIELD", "FIFTH", "FIFTY", "FIGHT", "FINAL",
  "FIRST", "FLAME", "FLASH", "FLEET", "FLESH", "FLOAT", "FLOOD", "FLOOR", "FLOUR", "FLUID",
  "FLYER", "FOCUS", "FORCE", "FORTH", "FORTY", "FORUM", "FOUND", "FRAME", "FRAUD", "FRESH",
  "FRONT", "FROWN", "FRUIT", "FUNNY", "GIANT", "GIVEN", "GLASS", "GLOBE", "GLORY", "GLOVE",
  "GRACE", "GRADE", "GRAIN", "GRAND", "GRANT", "GRAPE", "GRASP", "GRASS", "GRAVE", "GREAT",
  "GREEN", "GREET", "GRIEF", "GRILL", "GROSS", "GROUP", "GROVE", "GUARD", "GUESS", "GUEST",
  "GUIDE", "GUILT", "HAPPY", "HARDY", "HARSH", "HASTE", "HASTE", "HEADS", "HEAVY", "HENCE",
  "HEROIC", "HONOR", "HORSE", "HOTEL", "HOUSE", "HUMAN", "HUMOR", "IDEAL", "IMAGE", "IMPLY",
  "INDEX", "INNER", "INPUT", "ISSUE", "JAPAN", "JEWEL", "JOINT", "JUDGE", "JUICE", "JURY",
  "KNIFE", "KNOCK", "KNOWN", "LABEL", "LABOR", "LARGE", "LASER", "LATER", "LATEST", "LAUGH",
  "LAYER", "LEARN", "LEASE", "LEAST", "LEAVE", "LEGAL", "LEMON", "LEVEL", "LEVER", "LIGHT",
  "LIMIT", "LINEN", "LIONS", "LIQUID", "LOCAL", "LOGIC", "LOOSE", "LOWER", "LOYAL", "LUCKY",
  "LUNCH", "MAGIC", "MAJOR", "MAKER", "MARCH", "MATCH", "MAYOR", "MEDAL", "MEDIA", "MERCY",
  "MERIT", "METAL", "METER", "MICRO", "MIDDLE", "MIDST", "MIGHT", "MINOR", "MINUS", "MIXED",
  "MODEL", "MODEM", "MONEY", "MONTH", "MORAL", "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVIE",
  "MUSIC", "NAKED", "NASTY", "NAVAL", "NERVE", "NEVER", "NEWER", "NEWLY", "NIGHT", "NOBLE",
  "NOISE", "NORTH", "NOTED", "NOVEL", "NURSE", "OCEAN", "OFFER", "OFTEN", "OLDER", "OLDEST",
  "OLIVE", "ONION", "ONSET", "OPENER", "OPERATE", "ORBIT", "ORDER", "ORGAN", "OTHER", "OUGHT",
  "OUTER", "OWNER", "PANEL", "PANIC", "PAPER", "PARTY", "PEACE", "PEACH", "PEARL", "PENAL",
  "PENCE", "PENNY", "PERIL", "PHONE", "PHOTO", "PIANO", "PIECE", "PILOT", "PITCH", "PIVOT",
  "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "PLAZA", "PLEAD", "PLENTY", "PLUNG", "POEM",
  "POETRY", "POINT", "POLAR", "POLICE", "POLICY", "PORCH", "POUND", "POWER", "PRESS", "PRICE",
  "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROOF", "PROUD", "PROVE", "PULSE", "PUPIL",
  "PUPPY", "PURSE", "QUEEN", "QUERY", "QUEST", "QUICK", "QUIET", "QUITE", "QUOTA", "RADAR",
  "RADIO", "RAISE", "RALLY", "RANCH", "RANGE", "RAPID", "RATIO", "REACH", "REACT", "READY",
  "REALM", "REBEL", "REFER", "REIGN", "RELAX", "RELAY", "RENEW", "REPLY", "RESET", "RESIN",
  "RIDER", "RIDGE", "RIPLE", "RISKY", "RIVAL", "RIVER", "ROBOT", "ROCKY", "ROGUE", "ROUGH",
  "ROUND", "ROUTE", "ROYAL", "RULER", "RURAL", "SADLY", "SAFER", "SAFELY", "SAINT", "SALAD",
  "SALES", "SALON", "SALTY", "SANDY", "SATIN", "SAUCE", "SCALE", "SCARE", "SCENE", "SCENT",
  "SCOPE", "SCORE", "SCOUT", "SCREW", "SENSE", "SERVE", "SETTING", "SEVEN", "SEVERE", "SHADE",
  "SHADOW", "SHAFT", "SHAKE", "SHALL", "SHAME", "SHAPE", "SHARE", "SHARK", "SHARP", "SHEEP",
  "SHEER", "SHEET", "SHELL", "SHIFT", "SHINE", "SHIRT", "SHOCK", "SHOOT", "SHORT", "SHOUT",
  "SHOWS", "SHRUB", "SHRUG", "SIGHT", "SIGNS", "SILENT", "SILLY", "SILVER", "SIMPLE", "SINCE",
  "SIXTH", "SIXTY", "SKILL", "SKIRT", "SKULL", "SLATE", "SLAVE", "SLEEP", "SLICE", "SLIDE",
  "SLIGHT", "SLOPE", "SLUM", "SMALL", "SMART", "SMELL", "SMILE", "SMOKE", "SMOOTH", "SNAKE",
  "SOLAR", "SOLID", "SOLVE", "SORRY", "SOUND", "SOUTH", "SPACE", "SPARE", "SPARK", "SPEAK",
  "SPEED", "SPELL", "SPEND", "SPILL", "SPINE", "SPITE", "SPLIT", "SPOIL", "SPOKE", "SPOON",
  "SPORT", "SPOTS", "SPRAY", "SPREAD", "SPRING", "SQUAD", "STACK", "STAFF", "STAGE", "STAIN",
  "STAIR", "STAKE", "STALE", "STAMP", "STAND", "STARK", "START", "STATE", "STEAM", "STEEL",
  "STEEP", "STEER", "STEMS", "STEPS", "STICK", "STIFF", "STILL", "STOCK", "STONE", "STOOD",
  "STOOL", "STORM", "STORY", "STRAW", "STRIP", "STUDY", "STUFF", "STYLE", "SUGAR", "SUITE",
  "SUPER", "SWEET", "SWIFT", "SWING", "SWORD", "TABLE", "TASTE", "TEACH", "TEXAS", "THANK",
  "THEME", "THERE", "THESE", "THICK", "THIEF", "THIGH", "THING", "THINK", "THIRD", "THOSE",
  "THREE", "TREES", "TIGERS", "TIGER", "TIRED", "TITLE", "TODAY", "TOKEN", "TONGUE", "TOTAL",
  "TOUCH", "TOUGH", "TOWEL", "TOWER", "TOXIC", "TRACE", "TRACK", "TRADE", "TRAIL", "TRAIN",
  "TRAIT", "TREND", "TRIAL", "TRIBE", "TRICK", "TRIED", "TROOP", "TRUCK", "TRULY", "TRUNK",
  "TRUST", "TRUTH", "TUMOR", "TUNNEL", "TWICE", "TWIST", "UNCLE", "UNDER", "UNION", "UNITE",
  "UNITY", "UNTIL", "UPSET", "URBAN", "USAGE", "USUAL", "VALID", "VALUE", "VIDEO", "VIRUS",
  "VISIT", "VITAL", "VOICE", "WASTE", "WATCH", "WATER", "WEALTH", "WEAPON", "WEIGH", "WEIRD",
  "WHEEL", "WHERE", "WHICH", "WHILE", "WHITE", "WHOLE", "WHOSE", "WIDELY", "WIDOW", "WIDTH",
  "WINDY", "WINTER", "WISDOM", "WOMAN", "WOMEN", "WORLD", "WORRY", "WORST", "WORTH", "WOULD",
  "WOUND", "WRITE", "WRONG", "YOUTH"
];

export const INFLECTED_EXTENDED_WORDS: string[] = [
  "CLOSER", "CLOSES", "CLOSED", "CLOSING", "CLOSELY", "CLOSEST",
  "FASTER", "FASTEST", "FASTED", "FASTING", "FASTLY",
  "SLOWER", "SLOWEST", "SLOWED", "SLOWING", "SLOWLY",
  "HIGHER", "HIGHEST", "HIGHLY",
  "LOWER", "LOWEST", "LOWLY",
  "SMARTER", "SMARTEST", "SMARTLY",
  "CLEANER", "CLEANEST", "CLEANED", "CLEANING",
  "DARKER", "DARKEST", "DARKLY",
  "LIGHTER", "LIGHTEST", "LIGHTLY",
  "SOONER", "SOONEST",
  "LATER", "LATEST",
  "SAFER", "SAFEST", "SAFELY",
  "STRONGER", "STRONGEST", "STRONGLY",
  "WEAKER", "WEAKEST", "WEAKLY",
  "COLDER", "COLDEST",
  "WARMER", "WARMEST",
  "YOUNGER", "YOUNGEST",
  "OLDER", "OLDEST",
  "BIGGER", "BIGGEST",
  "GREATER", "GREATEST", "GREATLY",
  "HARDER", "HARDEST",
  "SOFTER", "SOFTEST", "SOFTLY",
  "QUICKER", "QUICKEST", "QUICKLY",
  "SHARPER", "SHARPEST", "SHARPLY",
  "TIGHTER", "TIGHTEST", "TIGHTLY",
  "LOOSER", "LOOSEST", "LOOSELY",
  "FINER", "FINEST",
  "NICER", "NICEST", "NICELY",
  "BRAVER", "BRAVEST", "BRAVELY",
  "LARGER", "LARGEST",
  "CUTER", "CUTEST",
  "SWEETER", "SWEETEST", "SWEETLY",
  "FRESHER", "FRESHEST", "FRESHLY",
  "NEATER", "NEATEST", "NEATLY",
  "PLAINER", "PLAINEST", "PLAINLY",
  "THICKER", "THICKEST", "THICKLY",
  "THINNER", "THINNEST", "THINLY",
  "FATTER", "FATTEST",
  "MADDER", "MADDEST", "MADLY",
  "SADDER", "SADDEST", "SADLY",
  "HOTTER", "HOTTEST",
  "REDDER", "REDDEST",
  "WETTER", "WETTEST",
  "FITTER", "FITTEST",
  "DRIER", "DRIEST", "DRILY",
  "HAPPIER", "HAPPIEST", "HAPPILY",
  "EASIER", "EASIEST", "EASILY",
  "BUSIER", "BUSIEST", "BUSILY",
  "EARLIER", "EARLIEST",
  "HEAVIER", "HEAVIEST", "HEAVILY",
  "FUNNIER", "FUNNIEST", "FUNNILY",
  "DIRTIER", "DIRTIEST",
  "LAZIER", "LAZIEST", "LAZILY",
  "TINIER", "TINIEST",
  "PRETTIER", "PRETTIEST", "PRETTILY",
  "LUCKIER", "LUCKIEST", "LUCKILY",
  "LEADER", "LEADERS", "LEADING",
  "READER", "READERS", "READING",
  "WRITER", "WRITERS", "WRITING",
  "DRIVER", "DRIVERS", "DRIVING",
  "BUYER", "BUYERS", "BUYING",
  "SELLER", "SELLERS", "SELLING",
  "BUILDER", "BUILDERS", "BUILDING",
  "PLAYER", "PLAYERS", "PLAYING", "PLAYED",
  "RUNNER", "RUNNERS", "RUNNING",
  "MAKER", "MAKERS", "MAKING",
  "WORKER", "WORKERS", "WORKING", "WORKED", "WORKS",
  "HELPER", "HELPERS", "HELPING", "HELPED", "HELPS",
  "WALKER", "WALKERS", "WALKING", "WALKED", "WALKS",
  "TALKER", "TALKERS", "TALKING", "TALKED", "TALKS",
  "LOOKER", "LOOKERS", "LOOKING", "LOOKED", "LOOKS",
  "LISTENER", "LISTENERS", "LISTENING", "LISTENED", "LISTENS",
  "TEACHER", "TEACHERS", "TEACHING", "TEACHES",
  "FARMER", "FARMERS", "FARMING", "FARMS",
  "DOCTOR", "DOCTORS", "DOCTORING",
  "ACTOR", "ACTORS", "ACTING", "ACTED", "ACTS",
  "VISITOR", "VISITORS", "VISITING", "VISITED", "VISITS",
  "CREATOR", "CREATORS", "CREATING", "CREATED", "CREATES",
  "OWNER", "OWNERS", "OWNING", "OWNED", "OWNS",
  "USER", "USERS", "USING", "USED", "USES"
];

// Sets for O(1) word lookup by length
const SET_3 = new Set<string>([
  "BOX", "FOX", "BUS", "DOG", "CAT", "BOY", "TOY", "CAR", "BAG", "MAP", "KEY", "BED", "FAN",
  "SUN", "PEN", "CUP", "COW", "PIG", "RAT", "MAN", "FLY", "EYE", "ARM", "LEG", "JAR", "HAT",
  "CAP", "PAN", "PIN", "TAX", "HUB", "BAR", "LIP", "PET", "PIT", "POT", "RUG", "SEA", "SKY",
  "TIN", "TOP", "VAN", "WEB", "WIN", "ZIP", "ANT", "BEE", "OWL", "BAT", "EGG", "NUT", "JAM",
  "ICE", "OIL", "GAS", "AIR", "DAY", "END", "FUN", "GUY", "JOY", "LAW", "ONE", "RUN", "TWO", "USE"
]);

const SET_4 = new Set<string>([
  ...WORDLE_4LETTER_DICTIONARY.map(w => w.word.toUpperCase()),
  ...EXTENDED_VALID_4LETTER_WORDS.map(w => w.toUpperCase())
]);

const SET_5 = new Set<string>([
  ...WORDLE_DICTIONARY.map(w => w.word.toUpperCase()),
  ...EXTENDED_VALID_5LETTER_WORDS.map(w => w.toUpperCase())
]);

const SET_6 = new Set<string>([
  ...WORDLE_6LETTER_DICTIONARY.map(w => w.word.toUpperCase()),
  ...EXTENDED_VALID_6LETTER_WORDS.map(w => w.toUpperCase())
]);

const SET_7 = new Set<string>([
  ...WORDLE_7LETTER_DICTIONARY.map(w => w.word.toUpperCase())
]);

export const PLURAL_EXTENDED_WORDS: string[] = [
  "ANIMALS", "TIGERS", "PANTIES", "PANTY", "TIGER", "ANIMAL", "BOOKS", "TREES", "BIRDS", "PARKS",
  "LIONS", "GIRLS", "BOYS", "COWS", "BEDS", "CARS", "BAGS", "MAPS", "BALLS", "HAIRS", "LEGS",
  "HANDS", "FEET", "EYES", "EARS", "SONGS", "GAMES", "FOODS", "HOUSES", "RINGS", "STARS",
  "ROADS", "SHIPS", "BOATS", "FARMERS", "TEACHERS", "DOCTORS", "STUDENTS", "MATCHES", "WATCHES",
  "DRESSES", "GLASSES", "CLASSES", "BOXES", "FOXES", "BUSES", "BABIES", "CANDIES", "CITIES",
  "LADIES", "STORIES", "PARTIES", "PANTS", "PLANTS", "SHIRTS", "SHOES", "RIVERS", "OCEANS",
  "MOUNTAINS", "DESERTS", "FORESTS", "PLANETS", "HEARTS", "BRAINS", "LIGHTS", "SOUNDS", "WORDS",
  "VOICES", "CHOICES", "CHANGES", "DREAMS", "DRIVERS", "PLAYERS", "READERS", "WRITERS", "FRIENDS",
  "PARENTS", "MEMORIES", "ENERGIES", "STRATEGIES", "QUALITIES", "ACTIVITIES", "COMMUNITIES",
  "SISTERS", "BROTHERS", "MOTHERS", "FATHERS", "NEIGHBORS", "COUSINS", "HEROES", "POTATOES",
  "TOMATOES", "MANGOES", "ECHOES", "CARGOES", "LAKES", "TOYS", "DAYS", "KEYS", "PENS", "CUPS"
];

// Master lookup set containing all known words and stems across lengths
const ALL_VALID_WORDS_SET = new Set<string>([
  ...SET_3,
  ...SET_4,
  ...SET_5,
  ...SET_6,
  ...SET_7,
  ...PLURAL_EXTENDED_WORDS.map(w => w.toUpperCase()),
  ...INFLECTED_EXTENDED_WORDS.map(w => w.toUpperCase())
]);

// Helper to check if a word/stem is in any dictionary
function isKnownWord(w: string): boolean {
  return ALL_VALID_WORDS_SET.has(w.toUpperCase().trim());
}

// Helper to find a matching WordleWord object across dictionaries
function findInAnyDictionary(searchWord: string): WordleWord | null {
  const clean = searchWord.toUpperCase().trim();
  const allDicts = [
    ...WORDLE_DICTIONARY,
    ...WORDLE_4LETTER_DICTIONARY,
    ...WORDLE_6LETTER_DICTIONARY,
    ...WORDLE_7LETTER_DICTIONARY
  ];
  return allDicts.find(w => w.word.toUpperCase() === clean) || null;
}

export interface StemMatch {
  cleanWord: string;
  stemWord: string;
  stemObj: WordleWord | null;
  type: 'exact' | 'plural' | 'comparative' | 'superlative' | 'past' | 'progressive' | 'adverb' | 'agent';
  suffix: string;
}

export function resolveWordStem(word: string): StemMatch | null {
  if (!word) return null;
  const clean = word.toUpperCase().trim();

  // 1. Direct match
  const exactObj = findInAnyDictionary(clean);
  if (exactObj || ALL_VALID_WORDS_SET.has(clean)) {
    return {
      cleanWord: clean,
      stemWord: clean,
      stemObj: exactObj,
      type: 'exact',
      suffix: ''
    };
  }

  const checkStem = (stem: string): WordleWord | boolean | null => {
    if (!stem || stem.length < 2) return null;
    const obj = findInAnyDictionary(stem);
    if (obj) return obj;
    if (ALL_VALID_WORDS_SET.has(stem)) return true;
    return null;
  };

  // 2. Comparative / Agent (-ER, -R, -IER) e.g. CLOSER -> CLOSE, FASTER -> FAST, MAKER -> MAKE
  if (clean.endsWith("IER") && clean.length >= 4) {
    const yStem = clean.slice(0, -3) + "Y";
    const res = checkStem(yStem);
    if (res) return { cleanWord: clean, stemWord: yStem, stemObj: typeof res === 'object' ? res : null, type: 'comparative', suffix: 'IER' };
  }
  if (clean.endsWith("ER") && clean.length >= 4) {
    const erStem = clean.slice(0, -2);
    let res = checkStem(erStem);
    if (res) return { cleanWord: clean, stemWord: erStem, stemObj: typeof res === 'object' ? res : null, type: 'comparative', suffix: 'ER' };

    const rStem = clean.slice(0, -1);
    res = checkStem(rStem);
    if (res) return { cleanWord: clean, stemWord: rStem, stemObj: typeof res === 'object' ? res : null, type: 'comparative', suffix: 'R' };

    const eStem = clean.slice(0, -2) + "E";
    res = checkStem(eStem);
    if (res) return { cleanWord: clean, stemWord: eStem, stemObj: typeof res === 'object' ? res : null, type: 'comparative', suffix: 'ER' };

    if (erStem.length >= 3 && erStem[erStem.length - 1] === erStem[erStem.length - 2]) {
      const singleStem = erStem.slice(0, -1);
      res = checkStem(singleStem);
      if (res) return { cleanWord: clean, stemWord: singleStem, stemObj: typeof res === 'object' ? res : null, type: 'comparative', suffix: 'ER' };
    }
  }

  // 3. Superlative (-EST, -ST, -IEST) e.g. CLOSEST -> CLOSE, FASTEST -> FAST
  if (clean.endsWith("IEST") && clean.length >= 5) {
    const yStem = clean.slice(0, -4) + "Y";
    const res = checkStem(yStem);
    if (res) return { cleanWord: clean, stemWord: yStem, stemObj: typeof res === 'object' ? res : null, type: 'superlative', suffix: 'IEST' };
  }
  if (clean.endsWith("EST") && clean.length >= 5) {
    const estStem = clean.slice(0, -3);
    let res = checkStem(estStem);
    if (res) return { cleanWord: clean, stemWord: estStem, stemObj: typeof res === 'object' ? res : null, type: 'superlative', suffix: 'EST' };

    const stStem = clean.slice(0, -2);
    res = checkStem(stStem);
    if (res) return { cleanWord: clean, stemWord: stStem, stemObj: typeof res === 'object' ? res : null, type: 'superlative', suffix: 'ST' };

    const eStem = clean.slice(0, -3) + "E";
    res = checkStem(eStem);
    if (res) return { cleanWord: clean, stemWord: eStem, stemObj: typeof res === 'object' ? res : null, type: 'superlative', suffix: 'EST' };

    if (estStem.length >= 3 && estStem[estStem.length - 1] === estStem[estStem.length - 2]) {
      const singleStem = estStem.slice(0, -1);
      res = checkStem(singleStem);
      if (res) return { cleanWord: clean, stemWord: singleStem, stemObj: typeof res === 'object' ? res : null, type: 'superlative', suffix: 'EST' };
    }
  }

  // 4. Past tense (-ED, -D, -IED) e.g. CLOSED -> CLOSE, PLAYED -> PLAY
  if (clean.endsWith("IED") && clean.length >= 4) {
    const yStem = clean.slice(0, -3) + "Y";
    const res = checkStem(yStem);
    if (res) return { cleanWord: clean, stemWord: yStem, stemObj: typeof res === 'object' ? res : null, type: 'past', suffix: 'IED' };
  }
  if (clean.endsWith("ED") && clean.length >= 4) {
    const edStem = clean.slice(0, -2);
    let res = checkStem(edStem);
    if (res) return { cleanWord: clean, stemWord: edStem, stemObj: typeof res === 'object' ? res : null, type: 'past', suffix: 'ED' };

    const dStem = clean.slice(0, -1);
    res = checkStem(dStem);
    if (res) return { cleanWord: clean, stemWord: dStem, stemObj: typeof res === 'object' ? res : null, type: 'past', suffix: 'D' };

    const eStem = clean.slice(0, -2) + "E";
    res = checkStem(eStem);
    if (res) return { cleanWord: clean, stemWord: eStem, stemObj: typeof res === 'object' ? res : null, type: 'past', suffix: 'ED' };

    if (edStem.length >= 3 && edStem[edStem.length - 1] === edStem[edStem.length - 2]) {
      const singleStem = edStem.slice(0, -1);
      res = checkStem(singleStem);
      if (res) return { cleanWord: clean, stemWord: singleStem, stemObj: typeof res === 'object' ? res : null, type: 'past', suffix: 'ED' };
    }
  }

  // 5. Progressive (-ING) e.g. CLOSING -> CLOSE, PLAYING -> PLAY
  if (clean.endsWith("ING") && clean.length >= 5) {
    const ingStem = clean.slice(0, -3);
    let res = checkStem(ingStem);
    if (res) return { cleanWord: clean, stemWord: ingStem, stemObj: typeof res === 'object' ? res : null, type: 'progressive', suffix: 'ING' };

    const eStem = ingStem + "E";
    res = checkStem(eStem);
    if (res) return { cleanWord: clean, stemWord: eStem, stemObj: typeof res === 'object' ? res : null, type: 'progressive', suffix: 'ING' };

    if (ingStem.length >= 3 && ingStem[ingStem.length - 1] === ingStem[ingStem.length - 2]) {
      const singleStem = ingStem.slice(0, -1);
      res = checkStem(singleStem);
      if (res) return { cleanWord: clean, stemWord: singleStem, stemObj: typeof res === 'object' ? res : null, type: 'progressive', suffix: 'ING' };
    }
  }

  // 6. Adverb (-LY, -ILY) e.g. CLOSELY -> CLOSE, SLOWLY -> SLOW
  if (clean.endsWith("ILY") && clean.length >= 5) {
    const yStem = clean.slice(0, -3) + "Y";
    const res = checkStem(yStem);
    if (res) return { cleanWord: clean, stemWord: yStem, stemObj: typeof res === 'object' ? res : null, type: 'adverb', suffix: 'ILY' };
  }
  if (clean.endsWith("LY") && clean.length >= 4) {
    const lyStem = clean.slice(0, -2);
    let res = checkStem(lyStem);
    if (res) return { cleanWord: clean, stemWord: lyStem, stemObj: typeof res === 'object' ? res : null, type: 'adverb', suffix: 'LY' };

    const eStem = lyStem + "E";
    res = checkStem(eStem);
    if (res) return { cleanWord: clean, stemWord: eStem, stemObj: typeof res === 'object' ? res : null, type: 'adverb', suffix: 'LY' };
  }

  // 7. Plurals / 3rd person (-IES, -ES, -S) e.g. CLOSES -> CLOSE, TIGERS -> TIGER
  if (clean.endsWith("IES") && clean.length >= 4) {
    const yStem = clean.slice(0, -3) + "Y";
    const res = checkStem(yStem);
    if (res) return { cleanWord: clean, stemWord: yStem, stemObj: typeof res === 'object' ? res : null, type: 'plural', suffix: 'IES' };
  }
  if (clean.endsWith("ES") && clean.length >= 4) {
    const esStem = clean.slice(0, -2);
    let res = checkStem(esStem);
    if (res) return { cleanWord: clean, stemWord: esStem, stemObj: typeof res === 'object' ? res : null, type: 'plural', suffix: 'ES' };

    const sStem = clean.slice(0, -1);
    res = checkStem(sStem);
    if (res) return { cleanWord: clean, stemWord: sStem, stemObj: typeof res === 'object' ? res : null, type: 'plural', suffix: 'S' };
  }
  if (clean.endsWith("S") && clean.length >= 3) {
    const sStem = clean.slice(0, -1);
    const res = checkStem(sStem);
    if (res) return { cleanWord: clean, stemWord: sStem, stemObj: typeof res === 'object' ? res : null, type: 'plural', suffix: 'S' };
  }

  return null;
}

export function isValidWordleWord(word: string, length?: number): boolean {
  if (!word) return false;
  const clean = word.toUpperCase().trim();
  if (length && clean.length !== length) return false;

  // 1. Direct check in master word set or length sets
  if (ALL_VALID_WORDS_SET.has(clean)) return true;
  if (clean.length === 4 && SET_4.has(clean)) return true;
  if (clean.length === 5 && SET_5.has(clean)) return true;
  if (clean.length === 6 && SET_6.has(clean)) return true;
  if (clean.length === 7 && SET_7.has(clean)) return true;

  // 2. Stem resolution (comparatives like CLOSER, past CLOSED, gerund CLOSING, plural CLOSES)
  const stemMatch = resolveWordStem(clean);
  if (stemMatch) return true;

  // 3. Fallback English word structure validator (accepts standard A-Z words containing vowels/y)
  const isEnglishWordPattern = /^[A-Z]{3,8}$/.test(clean) && /[AEIOUY]/.test(clean);
  if (isEnglishWordPattern) {
    return true;
  }

  return false;
}

export function getWordMeaning(searchWord: string): WordleWord {
  const clean = searchWord.toUpperCase().trim();
  const len = clean.length;
  
  // 1. Check exact dictionary match
  const pool = getWordsForLength(len);
  const foundInPool = pool.find(w => w.word.toUpperCase() === clean);
  if (foundInPool) return foundInPool;

  const foundAny = findInAnyDictionary(clean);
  if (foundAny) return foundAny;

  // 2. Dynamic Stem & Inflection Lookup
  const stemMatch = resolveWordStem(clean);
  if (stemMatch) {
    const stemObj = stemMatch.stemObj;
    const baseWord = stemMatch.stemWord;

    if (stemMatch.type === 'comparative') {
      return {
        word: clean,
        phonetic: `/${clean.toLowerCase()}/`,
        partOfSpeech: "adjective (comparative) / noun",
        definition: stemObj ? `Comparative form of ${stemObj.word}: ${stemObj.definition}` : `Comparative or agent form derived from ${baseWord}.`,
        hindiMeaning: stemObj ? `${stemObj.hindiMeaning} (अधिक / Comparative)` : `${baseWord} - Comparative / Agent`,
        exampleSentence: `Moving ${clean.toLowerCase()} provides clearer insight and understanding.`
      };
    }

    if (stemMatch.type === 'superlative') {
      return {
        word: clean,
        phonetic: `/${clean.toLowerCase()}/`,
        partOfSpeech: "adjective (superlative)",
        definition: stemObj ? `Superlative form of ${stemObj.word}: ${stemObj.definition}` : `Superlative degree form of ${baseWord}.`,
        hindiMeaning: stemObj ? `${stemObj.hindiMeaning} (सबसे अधिक / Superlative)` : `${baseWord} - Superlative`,
        exampleSentence: `This option is considered the ${clean.toLowerCase()} choice available.`
      };
    }

    if (stemMatch.type === 'past') {
      return {
        word: clean,
        phonetic: `/${clean.toLowerCase()}/`,
        partOfSpeech: "verb (past tense / participle)",
        definition: stemObj ? `Past tense form of ${stemObj.word}: ${stemObj.definition}` : `Past tense form of verb ${baseWord}.`,
        hindiMeaning: stemObj ? `${stemObj.hindiMeaning} (भूतकाल / Past Tense)` : `${baseWord} - Past Tense`,
        exampleSentence: `They ${clean.toLowerCase()} the action smoothly according to schedule.`
      };
    }

    if (stemMatch.type === 'progressive') {
      return {
        word: clean,
        phonetic: `/${clean.toLowerCase()}/`,
        partOfSpeech: "verb (present participle / gerund)",
        definition: stemObj ? `Continuous form of ${stemObj.word}: ${stemObj.definition}` : `Continuous action form of ${baseWord}.`,
        hindiMeaning: stemObj ? `${stemObj.hindiMeaning} (निरंतर क्रिया / Progressive)` : `${baseWord} - Progressive`,
        exampleSentence: `Active participation in ${clean.toLowerCase()} helps build fluency rapidly.`
      };
    }

    if (stemMatch.type === 'adverb') {
      return {
        word: clean,
        phonetic: `/${clean.toLowerCase()}/`,
        partOfSpeech: "adverb",
        definition: stemObj ? `Adverbial form of ${stemObj.word}: ${stemObj.definition}` : `Adverb derived from ${baseWord}.`,
        hindiMeaning: stemObj ? `${stemObj.hindiMeaning} (क्रिया-विशेषण / Adverb)` : `${baseWord} - Adverb`,
        exampleSentence: `The task was executed ${clean.toLowerCase()} with high accuracy.`
      };
    }

    if (stemMatch.type === 'plural') {
      return {
        word: clean,
        phonetic: `/${clean.toLowerCase()}/`,
        partOfSpeech: "noun (plural)",
        definition: stemObj ? `Plural form of ${stemObj.word}: ${stemObj.definition}` : `Plural form of ${baseWord}.`,
        hindiMeaning: stemObj ? `${stemObj.hindiMeaning} (बहुवचन / Plural)` : `${baseWord} - Plural`,
        exampleSentence: `Multiple ${clean.toLowerCase()} were observed during the practice session.`
      };
    }
  }

  // 3. Fallback generation for valid words outside static dictionary
  return {
    word: clean,
    phonetic: `/${clean.toLowerCase()}/`,
    partOfSpeech: "noun / verb / adjective",
    definition: `A valid ${len}-letter English vocabulary word.`,
    hindiMeaning: `${clean} - मान्य अंग्रेज़ी शब्द`,
    exampleSentence: `The word "${clean}" is recognized in standard English vocabulary.`
  };
}



