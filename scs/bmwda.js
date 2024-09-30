const { adams } = require('../Ibrahim/adams');

// Set a riddle list with questions and answers
const devinettes = [
  {
    question: "I can fly without wings, who am I?",
    reponse: "The weather",
    categorie: "Logic",
    difficulte: "Easy",
  },
  {
    question: "I'm always hungry, the more I eat, the fatter I become. Who am I ?",
    reponse: "A black hole",
    categorie: "Science",
    difficulte: "Medium",
  },
  // ... add more riddles with categories and difficulties
];

// User profiles
const users = {};

// Scorekeeping
const scores = {};

// Riddle categories
const categories = ["Logic", "Wordplay", "History", "Science"];

// Difficulty levels
const difficulties = ["Easy", "Medium", "Hard"];

// Hint system
const hints = {
  "I can fly without wings, who am I?": "Think about the sky",
  // ... add more hints for each riddle
};

// Leaderboards
const leaderboards = {
  topScorers: [],
  mostSolved: [],
  fastestSolveTimes: [],
};

// Riddle of the Day/Week
const riddleOfTheDay = {};
const riddleOfTheWeek = {};

// Multi-Round Games
const multiRoundGames = {};

// Time Attack
const timeAttack = {
  timeLimit: 300000, // 5 minutes
  score: 0,
};

// Themed Riddles
const themedRiddles = {
  holiday: [
    {
      question: "What has keys but can't open locks?",
      reponse: "A piano",
    },
    // ... add more holiday-themed riddles
  ],
  movie: [
    {
      question: "What movie has a character named Luke?",
      reponse: "Star Wars",
    },
    // ... add more movie-themed riddles
  ],
};

// User profiles and scorekeeping
adams({ nomCom: "profile", categorie: "Games" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;
  const userId = dest.split(":")[1];
  if (!users[userId]) {
    users[userId] = {
      score: 0,
      solvedRiddles: [],
      fastestSolveTimes: {},
    };
  }
  await zk.sendMessage(
    dest,
    {
      text: `Your profile: Score - ${users[userId].score}, Solved Riddles - ${users[userId].solvedRiddles.length}`,
    },
    { quoted: ms }
  );
});

// Riddle command
adams({ nomCom: "riddle", categorie: "Games" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;
  const userId = dest.split(":")[1];
  const categorie = commandeOptions.categorie;
  const difficulte = commandeOptions.difficulte;

  // Choose a random riddle based on category and difficulty
  let devinette;
  if (categorie && difficulte) {
    devinette = devinettes.find(
      (riddle) => riddle.categorie === categorie && riddle.difficulte === difficulte
    );
  } else {
    devinette = devinettes[Math.floor(Math.random() * devinettes.length)];
  }

  // Send the riddle question
  await zk.sendMessage(
    dest,
    {
      text: `Riddle: ${devinette.question} . \n You have 30 seconds to think about.`,
    },
    { quoted: ms }
  );

  // Wait 30 seconds before sending the response
  await delay(30000);

  // Answer
  await zk.sendMessage(
    dest,
    {
      text: `The answer was : ${devinette.reponse}`,
    },
    { quoted: ms }
  );

  // Update user score and profile
  users[userId].score += 1;
  users[userId].solvedRiddles.push(devinette.question);
  users[userId].fastestSolveTimes[devinette.question] = Date.now();

  // Update leaderboards
  updateLeaderboards(userId, devinette.question);
});

// Hint command
adams({ nomCom: "hint", categorie: "Games" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;
  const userId = dest.split(":")[1];
  const riddleQuestion = commandeOptions.riddleQuestion;

  // Check if hint exists for the riddle
  if (hints[riddleQuestion]) {
    await zk.sendMessage(
      dest,
      {
        text: ` Hint: ${hints[riddleQuestion]}`,
      },
      { quoted: ms }
    );
  } else {
    await zk.sendMessage(
      dest,
      {
        text: `No hint available for this riddle.`,
      },
      { quoted: ms }
    );
  }
});

// Riddle submission command
adams({ nomCom: "submitriddle", categorie: "Games" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;
  const userId = dest.split(":")[1];
  const riddleQuestion = commandeOptions.riddleQuestion;
  const riddleAnswer = commandeOptions.riddleAnswer;

  // Add the riddle to the list
  devinettes.push({
    question: riddleQuestion,
    reponse: riddleAnswer,
    categorie: "User Submitted",
    difficulte: "Medium",
  });

  await zk.sendMessage(
    dest,
    {
      text: `Riddle submitted successfully!`,
    },
    { quoted: ms }
  );
});

// Riddle of the Day/Week command
adams({ nomCom: "riddleoftheday", categorie: "Games" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;
  const userId = dest.split(":")[1];

  // Choose a random riddle from the list
  const devinette = devinettes[Math.floor(Math.random() * devinettes.length)];

  // Send the riddle question
  await zk.sendMessage(
    dest,
    {
      text: `Riddle of the Day: ${devinette.question}`,
    },
    { quoted: ms }
  );

  // Wait 30 seconds before sending the response
  await delay(30000);

  // Answer
  await zk.sendMessage(
    dest,
    {
      text: `The answer was : ${devinette.reponse}`,
    },
    { quoted: ms }
  );
});

// Multi-Round Games command
adams({ nomCom: "multiround", categorie: "Games" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;
  const userId = dest.split(":")[1];

  // Start a new multi-round game
  multiRoundGames[userId] = {
    score: 0,
    currentRound: 1,
    riddles: [],
  };

  // Send the first riddle question
  await zk.sendMessage(
    dest,
    {
      text: `Multi-Round Game started! Round 1: ${devinettes[0].question}`,
    },
    { quoted: ms }
  );

  // Wait 30 seconds before sending the response
  await delay(30000);

  // Answer
  await zk.sendMessage(
    dest,
    {
      text: `The answer was : ${devinettes[0].reponse}`,
    },
    { quoted: ms }
  );

  // Update user score and profile
  users[userId].score += 1;
  users[userId].solvedRiddles.push(devinettes[0].question);
  users[userId].fastestSolveTimes[devinettes[0].question] = Date.now();

  // Update leaderboards
  updateLeaderboards(userId, devinettes[0].question);
});

// Time Attack command
adams({ nomCom: "timeattack", categorie: "Games" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;
  const userId = dest.split(":")[1];

  // Start a new time attack game
  timeAttack.score = 0;
  timeAttack.startTime = Date.now();

  // Send the first riddle question
  await zk.sendMessage(
    dest,
    {
      text: `Time Attack started! You have 5 minutes to solve as many riddles as possible. Here's your first riddle: ${devinettes[0].question}`,
    },
    { quoted: ms }
  );

  // Wait 5 minutes before ending the game
  await delay(timeAttack.timeLimit);

  // End the game and update user score and profile
  timeAttack.endTime = Date.now();
  timeAttack.score = users[userId].score;
  users[userId].score += timeAttack.score;
  users[userId].solvedRiddles.push(devinettes[0].question);
  users[userId].fastestSolveTimes[devinettes[0].question] = Date.now();

  // Update leaderboards
  updateLeaderboards(userId, devinettes[0].question);
});

// Themed Riddles command
adams({ nomCom: "themedriddles", categorie: "Games" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;
  const userId = dest.split(":")[1];
  const theme = commandeOptions.theme;

  // Choose a random riddle from the themed list
  const devinette = themedRiddles[theme][Math.floor(Math.random() * themedRiddles[theme].length)];

  // Send the riddle question
  await zk.sendMessage(
    dest,
    {
      text: `Themed Riddle: ${devinette.question}`,
    },
    { quoted: ms }
  );

  // Wait 30 seconds before sending the response
  await delay(30000);

  // Answer
  await zk.sendMessage(
    dest,
    {
      text: `The answer was : ${devinette.reponse}`,
    },
    { quoted: ms }
  );
});

// Update leaderboards function
function updateLeaderboards(userId, riddleQuestion) {
  // Update top scorers leaderboard
  if (!leaderboards.topScorers.includes(userId)) {
    leaderboards.topScorers.push(userId);
  }

  // Update most solved riddles leaderboard
  if (!leaderboards.mostSolved.includes(userId)) {
    leaderboards.mostSolved.push(userId);
  }

  // Update fastest solve times leaderboard
  if (!leaderboards.fastestSolveTimes.includes(userId)) {
    leaderboards.fastestSolveTimes.push(userId);
  }
}

// Delay function
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}