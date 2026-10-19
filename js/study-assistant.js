
const studyTopics = [
  {
    keywords: ["photosynthesis", "chlorophyll", "plants make food"],
    title: "Photosynthesis",
    answer:
      "Photosynthesis is the process by which green plants use sunlight, water and carbon dioxide to make glucose (food), releasing oxygen. It mainly occurs in the chloroplasts, where chlorophyll absorbs light energy."
  },
  {
    keywords: ["human heart", "heart function", "circulation"],
    title: "The Human Heart",
    answer:
      "The human heart is a muscular organ that pumps blood around the body. The right side sends blood to the lungs, while the left side pumps oxygen-rich blood to the rest of the body. It has four chambers: two atria and two ventricles."
  },
  {
    keywords: ["mean", "average", "arithmetic mean"],
    title: "Arithmetic Mean",
    answer:
      "The arithmetic mean is calculated by adding all the values and dividing by the number of values. Example: the mean of 2, 4 and 6 is (2 + 4 + 6) ÷ 3 = 4."
  },
  {
    keywords: ["health information management", "him"],
    title: "Health Information Management",
    answer:
      "Health Information Management involves collecting, organising, protecting and maintaining health records. It supports accurate documentation, confidentiality, healthcare administration and informed decision-making."
  },
  {
    keywords: ["study tips", "how to study", "reading timetable"],
    title: "Effective Study Tips",
    answer:
      "Set a clear goal for each study session, study in short focused blocks, practise recalling information without looking at your notes, answer past questions, take breaks and review difficult topics regularly."
  },
  {
    keywords: ["cgpa", "grade point", "gpa"],
    title: "Understanding CGPA",
    answer:
      "CGPA means Cumulative Grade Point Average. It is generally calculated by dividing the total quality points earned by the total credit units attempted. Always use your institution's official grading rules."
  }
];

function findStudyAnswer(question) {
  const text = question.toLowerCase().trim();

  if (!text) {
    return "Please type a question or topic you want to study.";
  }

  const match = studyTopics.find(topic =>
    topic.keywords.some(keyword => text.includes(keyword))
  );

  if (match) {
    return `${match.title}\n\n${match.answer}\n\nTip: Try explaining this topic in your own words, then test yourself with a question.`;
  }

  return "I don't have a prepared explanation for that topic yet. Try asking about photosynthesis, the human heart, arithmetic mean, Health Information Management, study tips or CGPA. More topics can be added to the study library.";
}

window.CampusGeniusStudyAssistant = {
  findStudyAnswer
};
