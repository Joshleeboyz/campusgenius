
const studyTopics = [
  {
    title: "Photosynthesis",
    keywords: ["photosynthesis", "chlorophyll", "plants make food"],
    answer: "Photosynthesis is the process by which green plants use sunlight, water and carbon dioxide to produce glucose and release oxygen. It takes place mainly in chloroplasts, which contain chlorophyll. Equation: Carbon dioxide + Water → Glucose + Oxygen, in the presence of light and chlorophyll."
  },
  {
    title: "Cell Biology",
    keywords: ["cell biology", "cell", "cell organelles", "mitochondria", "nucleus"],
    answer: "A cell is the basic structural and functional unit of life. The nucleus contains genetic material, mitochondria release energy through cellular respiration, ribosomes make proteins, and the cell membrane regulates movement of substances into and out of the cell."
  },
  {
    title: "Human Heart",
    keywords: ["human heart", "heart function", "circulation", "blood circulation"],
    answer: "The heart is a muscular organ that pumps blood. It has four chambers: the right atrium, right ventricle, left atrium and left ventricle. The right side pumps blood to the lungs, while the left side pumps oxygenated blood to the body."
  },
  {
    title: "Human Digestive System",
    keywords: ["digestive system", "digestion", "digestive organs"],
    answer: "The digestive system breaks food into smaller substances that the body can absorb. The mouth begins mechanical digestion, the stomach mixes food with gastric juices, the small intestine completes most digestion and absorbs nutrients, and the large intestine absorbs water and forms faeces."
  },
  {
    title: "Respiration",
    keywords: ["respiration", "cellular respiration", "aerobic respiration"],
    answer: "Cellular respiration releases energy from glucose. Aerobic respiration uses oxygen and produces carbon dioxide, water and energy in the form of ATP. It occurs through several stages, including glycolysis and the Krebs cycle."
  },
  {
    title: "Human Skeleton",
    keywords: ["skeleton", "skeletal system", "bones", "functions of bones"],
    answer: "The human skeleton supports the body, protects internal organs, helps movement with muscles, produces blood cells in bone marrow and stores minerals such as calcium and phosphorus. An adult human skeleton typically contains 206 bones."
  },
  {
    title: "Chemistry: Atoms",
    keywords: ["atom", "atomic structure", "protons", "neutrons", "electrons"],
    answer: "An atom is the smallest unit of an element that retains its chemical identity. Protons have a positive charge, neutrons have no charge, and electrons have a negative charge. Protons and neutrons are found in the nucleus, while electrons occupy regions around it."
  },
  {
    title: "Acids and Bases",
    keywords: ["acid", "base", "acids and bases", "ph scale"],
    answer: "Acids donate hydrogen ions in aqueous solution, while bases accept hydrogen ions or produce hydroxide ions, depending on the definition used. The pH scale measures acidity and alkalinity: below 7 is acidic, 7 is neutral, and above 7 is alkaline at ordinary reference conditions."
  },
  {
    title: "Chemical Bonding",
    keywords: ["chemical bonding", "ionic bond", "covalent bond"],
    answer: "Chemical bonds hold atoms together. Ionic bonding involves electrostatic attraction between oppositely charged ions, usually after electron transfer. Covalent bonding involves atoms sharing electron pairs. Metallic bonding involves positive metal ions surrounded by delocalised electrons."
  },
  {
    title: "Mathematics: Arithmetic Mean",
    keywords: ["arithmetic mean", "average", "calculate mean"],
    answer: "To calculate the arithmetic mean, add all the values and divide by the number of values. Example: the mean of 2, 4, 6 and 8 is (2 + 4 + 6 + 8) ÷ 4 = 5."
  },
  {
    title: "Fractions and Percentages",
    keywords: ["fraction", "fractions", "percentage", "percentages", "calculate percentage"],
    answer: "A fraction represents part of a whole. To convert a fraction to a percentage, multiply it by 100%. Example: 3/4 × 100% = 75%. To find 20% of 150, calculate 20/100 × 150 = 30."
  },
  {
    title: "Algebra",
    keywords: ["algebra", "solve for x", "linear equation", "equation"],
    answer: "Algebra uses symbols to represent numbers. To solve 2x + 4 = 10, subtract 4 from both sides to get 2x = 6, then divide both sides by 2. Therefore, x = 3."
  },
  {
    title: "Newton's Laws of Motion",
    keywords: ["newton", "laws of motion", "force and motion"],
    answer: "Newton's first law describes inertia: an object remains at rest or moves uniformly unless acted on by a resultant external force. The second law relates resultant force, mass and acceleration: F = ma. The third law states that forces occur in equal and opposite pairs acting on different bodies."
  },
  {
    title: "Electricity",
    keywords: ["electricity", "electric current", "ohms law", "resistance", "voltage"],
    answer: "Electric current is the rate of flow of electric charge. Voltage is electrical potential difference, and resistance opposes current. Ohm's law states V = IR, where V is voltage, I is current and R is resistance, for a conductor under constant physical conditions."
  },
  {
    title: "English Grammar",
    keywords: ["english grammar", "parts of speech", "noun", "verb", "adjective"],
    answer: "The main parts of speech include nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions and interjections. A noun names a person, place, thing or idea; a verb expresses an action or state; and an adjective describes a noun or pronoun."
  },
  {
    title: "Reading Comprehension",
    keywords: ["comprehension", "reading comprehension", "understanding passage"],
    answer: "For reading comprehension, read the passage carefully, identify its main idea, note supporting details and understand unfamiliar words from context. Answer from information in the passage, pay attention to question wording and avoid choosing an answer that introduces unsupported information."
  },
  {
    title: "Health Information Management",
    keywords: ["health information management", "health records", "medical records", "him"],
    answer: "Health Information Management involves collecting, organising, storing, protecting and maintaining health information. It supports accurate documentation, confidentiality, healthcare administration, research and informed decision-making. Professionals must follow applicable privacy rules and institutional procedures."
  },
  {
    title: "Medical Terminology",
    keywords: ["medical terminology", "medical terms", "prefix", "suffix"],
    answer: "Medical terminology uses word roots, prefixes and suffixes to describe body structures, diseases, procedures and treatments. For example, 'cardio' relates to the heart, 'hyper-' means excessive or above normal, and '-itis' commonly indicates inflammation. Interpret terms using their full context."
  },
  {
    title: "Confidentiality in Healthcare",
    keywords: ["confidentiality", "patient privacy", "health data privacy"],
    answer: "Confidentiality in healthcare means protecting patients' personal and medical information from unauthorised access or disclosure. Health workers should access only information needed for their duties, use approved systems, follow applicable privacy laws and disclose information only when properly authorised or legally required."
  },
  {
    title: "Understanding CGPA",
    keywords: ["cgpa", "gpa", "grade point average", "calculate cgpa"],
    answer: "CGPA means Cumulative Grade Point Average. It is generally calculated by dividing the total quality points earned by the total credit units attempted. Quality points are commonly calculated as course credit units multiplied by the grade point earned. Use your institution's official grading scale and rules."
  },
  {
    title: "Effective Study Methods",
    keywords: ["study tips", "how to study", "reading timetable", "study methods"],
    answer: "Use active recall by testing yourself without looking at your notes, spaced repetition by reviewing material over several days, and practice questions to identify weak areas. Break large topics into manageable sections, take short breaks and set realistic study goals."
  },
  {
    title: "Exam Preparation",
    keywords: ["exam preparation", "prepare for exam", "examination tips", "cbt tips"],
    answer: "Create a revision timetable based on your exam dates and difficult topics. Practise past questions, review mistakes, check the exam instructions and sleep adequately. During a CBT exam, read each question carefully, manage your time and review answers when permitted."
  },
  {
    title: "Scholarship Application",
    keywords: ["scholarship", "scholarships", "apply for scholarship"],
    answer: "A strong scholarship application usually includes accurate personal and academic details, required supporting documents and a clear statement explaining your educational goals and financial need where relevant. Verify eligibility, deadlines and application instructions through the scholarship provider's official website."
  },
  {
    title: "Career Planning",
    keywords: ["career guidance", "career planning", "choose a career", "career options"],
    answer: "Start career planning by identifying your interests, strengths and preferred working environment. Research the qualifications, daily responsibilities and employment pathways of different careers. Speak with lecturers or professionals, gain relevant experience and set practical short-term and long-term goals."
  }
];

function findStudyAnswer(question) {
  const text = String(question || "").toLowerCase().trim();

  if (!text) {
    return "Please enter a question or topic you want to study.";
  }

  const normalise = value =>
    value.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();

  const normalisedQuestion = normalise(text);

  const matches = studyTopics
    .map(topic => {
      const score = topic.keywords.reduce((total, keyword) => {
        const key = normalise(keyword);
        return total + (normalisedQuestion.includes(key) ? key.split(" ").length : 0);
      }, 0);

      return { topic, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (matches.length > 0) {
    const topic = matches[0].topic;

    return `${topic.title}\n\n${topic.answer}\n\nStudy tip: Explain this topic in your own words, then practise answering a question about it.`;
  }

  return "I don't have a prepared answer for that question yet. Try asking about Biology, Chemistry, Mathematics, Physics, English, Health Information Management, medical terminology, CGPA or exam preparation. This assistant uses a prepared study library rather than a live generative AI model.";
}

window.CampusGeniusStudyAssistant = {
  findStudyAnswer,
  topics: studyTopics.map(topic => topic.title)
};
