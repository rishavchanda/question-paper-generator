// QuestionController.js
import QuestionModel from "../models/Question.js";

// Add Question
export const addQuestion = async (req, res) => {
  const { question, subject, topic, difficulty, marks } = req.body;

  if (!question || !subject || !topic || !difficulty || !marks) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newQuestion = new QuestionModel({
      question,
      subject,
      topic,
      difficulty,
      marks,
    });
    await newQuestion.save();

    return res.status(201).json({ message: "Question added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Generate Question Paper
export const generateQuestionPaper = async (req, res) => {
  const {
    totalMarks,
    difficultyDistribution,
    topicDistribution = {},
  } = req.body;

  if (!totalMarks || !difficultyDistribution) {
    return res
      .status(400)
      .json({ error: "Total marks and difficulty distribution are required" });
  }

  try {
    const generatedPaper = await generatePaperFromDB(
      totalMarks,
      difficultyDistribution,
      topicDistribution
    );
    return res.status(200).json(generatedPaper);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const generatePaperFromDB = async (
  totalMarks,
  difficultyDistribution,
  topicDistribution
) => {
  const distribution = {};
  const questionPaper = [];

  for (const [difficulty, percentage] of Object.entries(
    difficultyDistribution
  )) {
    const marks = Math.ceil((percentage / 100) * totalMarks);
    distribution[difficulty] = {
      targetMarks: marks,
      currentMarks: 0,
      count: 0,
      topics: topicDistribution ? {} : undefined,
    };
  }

  // Added topics and their distributions if topicDistribution is provided
  if (topicDistribution) {
    for (const [topic, topicPercentage] of Object.entries(topicDistribution)) {
      for (const difficulty of Object.keys(difficultyDistribution)) {
        const topicMarks = Math.ceil(
          (topicPercentage / 100) * distribution[difficulty].targetMarks
        );
        distribution[difficulty].topics[topic] = {
          targetMarks: topicMarks,
          currentMarks: 0,
          count: 0,
        };
      }
    }
  }

  // Sorted the difficulty levels by the difference between targetMarks and currentMarks in descending order
  const sortedDifficulties = Object.entries(distribution).sort(
    ([, a], [, b]) =>
      b.targetMarks - b.currentMarks - (a.targetMarks - a.currentMarks)
  );

  for (let [
    difficulty,
    { targetMarks, currentMarks, topics },
  ] of sortedDifficulties) {
    const questions = await QuestionModel.find({ difficulty }).sort({
      marks: -1,
    });

    for (const question of questions) {
      if (currentMarks + question.marks <= targetMarks) {
        questionPaper.push(question);
        currentMarks += question.marks;
        distribution[difficulty].count += 1;
        distribution[difficulty].currentMarks = currentMarks;

        // Incrementing topic counts if topicDistribution is provided
        if (topicDistribution) {
          for (const topic of Object.keys(topics)) {
            const topicDistribution = topics[topic];
            if (
              topicDistribution.currentMarks + question.marks <=
              topicDistribution.targetMarks
            ) {
              topicDistribution.count += 1;
              topicDistribution.currentMarks += question.marks;
            }
          }
        }
      }
    }
  }

  // Calculating the remaining marks to distribute
  let remainingMarks =
    totalMarks -
    Object.values(distribution).reduce(
      (acc, { currentMarks }) => acc + currentMarks,
      0
    );

  console.log(distribution);

  console.log(remainingMarks);

  // If the total marks are not met we will add questions from other difficulty levels
  if (remainingMarks > 0) {
    const questions = await QuestionModel.find({
      marks: { $lte: remainingMarks },
    }).sort({ marks: -1 });

    for (const question of questions) {
      if (remainingMarks > 0) {
        questionPaper.push(question);
        remainingMarks -= question.marks;
        distribution[question.difficulty].count += 1;
        distribution[question.difficulty].currentMarks += question.marks;

        // Incrementing topic counts if topicDistribution is provided
        if (topicDistribution) {
          for (const topic of Object.keys(
            distribution[question.difficulty].topics
          )) {
            const topicDistribution =
              distribution[question.difficulty].topics[topic];
            if (
              topicDistribution.currentMarks + question.marks <=
              topicDistribution.targetMarks
            ) {
              topicDistribution.count += 1;
              topicDistribution.currentMarks += question.marks;
            }
          }
        }
      }
    }
  }

  const result = {
    total_questions: questionPaper.length,
    total_marks: questionPaper.reduce((acc, { marks }) => acc + marks, 0),
    distribution,
    questions: questionPaper,
  };

  return result;
};
