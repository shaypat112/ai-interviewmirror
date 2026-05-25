

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Category =
  | "Arrays & Hashing"
  | "Linked Lists"
  | "Trees & Graphs"
  | "Dynamic Programming"
  | "Sorting & Searching"
  | "System Design"
  | "Concurrency"
  | "Object-Oriented Design"
  | "Databases"
  | "Networking"
  | "Operating Systems"
  | "JavaScript & Frontend"
  | "Backend Engineering"
  | "Behavioral";

export interface Question {
  id: number;
  category: Category;
  difficulty: Difficulty;
  question: string;
}

// --- Question Bank ---

export const questions: Question[] = [
  // Arrays & Hashing
  {
    id: 1,
    category: "Arrays & Hashing",
    difficulty: "Easy",
    question:
      "Explain what a hash map is and describe a real-world problem where you would use one over a plain array.",
  },
  {
    id: 2,
    category: "Arrays & Hashing",
    difficulty: "Medium",
    question:
      "Walk me through how you would find two numbers in an array that add up to a target sum. What is the time complexity of your approach?",
  },
  {
    id: 3,
    category: "Arrays & Hashing",
    difficulty: "Hard",
    question:
      "How would you find the longest consecutive sequence in an unsorted array in O(n) time?",
  },
  {
    id: 4,
    category: "Arrays & Hashing",
    difficulty: "Hard",
    question:
      "Design a data structure that supports insert, delete, and getRandom in O(1) average time.",
  },

  // Linked Lists
  {
    id: 5,
    category: "Linked Lists",
    difficulty: "Easy",
    question:
      "What is a linked list and how does it differ from an array in terms of memory and access time?",
  },
  {
    id: 6,
    category: "Linked Lists",
    difficulty: "Medium",
    question:
      "How would you detect a cycle in a linked list? Explain why your solution works.",
  },
  {
    id: 7,
    category: "Linked Lists",
    difficulty: "Hard",
    question:
      "Reverse a linked list in groups of K nodes. What edge cases would you consider?",
  },

  // Trees & Graphs
  {
    id: 8,
    category: "Trees & Graphs",
    difficulty: "Easy",
    question:
      "Compare depth-first search and breadth-first search. When would you choose one over the other?",
  },
  {
    id: 9,
    category: "Trees & Graphs",
    difficulty: "Medium",
    question:
      "How would you validate whether a binary tree is a valid binary search tree?",
  },
  {
    id: 10,
    category: "Trees & Graphs",
    difficulty: "Hard",
    question:
      "Explain how Dijkstra’s algorithm works and when Bellman-Ford would be a better choice.",
  },
  {
    id: 11,
    category: "Trees & Graphs",
    difficulty: "Hard",
    question:
      "Given a graph of airline flights, how would you find the cheapest route with at most K stops?",
  },

  // Dynamic Programming
  {
    id: 12,
    category: "Dynamic Programming",
    difficulty: "Easy",
    question:
      "What is dynamic programming and what is the difference between memoization and tabulation?",
  },
  {
    id: 13,
    category: "Dynamic Programming",
    difficulty: "Medium",
    question:
      "How would you solve the coin change problem using dynamic programming?",
  },
  {
    id: 14,
    category: "Dynamic Programming",
    difficulty: "Hard",
    question:
      "Explain the optimal solution for longest increasing subsequence and its time complexity.",
  },
  {
    id: 15,
    category: "Dynamic Programming",
    difficulty: "Hard",
    question:
      "How would you optimize the space complexity of the longest common subsequence problem?",
  },

  // Sorting & Searching
  {
    id: 16,
    category: "Sorting & Searching",
    difficulty: "Easy",
    question:
      "Explain how binary search works and why sorted data is required.",
  },
  {
    id: 17,
    category: "Sorting & Searching",
    difficulty: "Medium",
    question:
      "Walk me through merge sort and explain its time and space complexity.",
  },
  {
    id: 18,
    category: "Sorting & Searching",
    difficulty: "Hard",
    question:
      "Find the median of two sorted arrays in O(log n) time.",
  },
  {
    id: 19,
    category: "Sorting & Searching",
    difficulty: "Medium",
    question:
      "How would you implement an autocomplete system optimized for fast prefix lookups?",
  },

  // System Design
  {
    id: 20,
    category: "System Design",
    difficulty: "Easy",
    question:
      "What is caching and why is it important in distributed systems?",
  },
  {
    id: 21,
    category: "System Design",
    difficulty: "Medium",
    question:
      "Design a URL shortener similar to TinyURL. What components would you need?",
  },
  {
    id: 22,
    category: "System Design",
    difficulty: "Hard",
    question:
      "Design a scalable chat system like Discord or Slack. How would you handle real-time messaging and scaling?",
  },
  {
    id: 23,
    category: "System Design",
    difficulty: "Hard",
    question:
      "Design YouTube’s video upload and streaming architecture at a high level.",
  },

  // Concurrency
  {
    id: 24,
    category: "Concurrency",
    difficulty: "Easy",
    question:
      "What is the difference between a process and a thread?",
  },
  {
    id: 25,
    category: "Concurrency",
    difficulty: "Medium",
    question:
      "Explain race conditions and how mutexes or locks prevent them.",
  },
  {
    id: 26,
    category: "Concurrency",
    difficulty: "Hard",
    question:
      "Describe how deadlocks occur and strategies to avoid them in production systems.",
  },

  // Object-Oriented Design
  {
    id: 27,
    category: "Object-Oriented Design",
    difficulty: "Easy",
    question:
      "What are the four principles of object-oriented programming?",
  },
  {
    id: 28,
    category: "Object-Oriented Design",
    difficulty: "Medium",
    question:
      "Design a parking lot system using object-oriented principles.",
  },
  {
    id: 29,
    category: "Object-Oriented Design",
    difficulty: "Hard",
    question:
      "Design an elevator control system. How would you structure the classes and responsibilities?",
  },

  // Databases
  {
    id: 30,
    category: "Databases",
    difficulty: "Easy",
    question:
      "What is the difference between SQL and NoSQL databases?",
  },
  {
    id: 31,
    category: "Databases",
    difficulty: "Medium",
    question:
      "Explain database indexing and the tradeoffs involved.",
  },
  {
    id: 32,
    category: "Databases",
    difficulty: "Hard",
    question:
      "How would you design a database schema for a large-scale e-commerce platform?",
  },

  // Networking
  {
    id: 33,
    category: "Networking",
    difficulty: "Easy",
    question:
      "Explain the difference between HTTP and HTTPS.",
  },
  {
    id: 34,
    category: "Networking",
    difficulty: "Medium",
    question:
      "What happens when you type a URL into a browser and press Enter?",
  },
  {
    id: 35,
    category: "Networking",
    difficulty: "Hard",
    question:
      "Explain how load balancing works and why it is critical for scalability.",
  },

  // Operating Systems
  {
    id: 36,
    category: "Operating Systems",
    difficulty: "Easy",
    question:
      "What is virtual memory and why is it needed?",
  },
  {
    id: 37,
    category: "Operating Systems",
    difficulty: "Medium",
    question:
      "Explain the difference between stack memory and heap memory.",
  },
  {
    id: 38,
    category: "Operating Systems",
    difficulty: "Hard",
    question:
      "Describe how garbage collection works and the tradeoffs it introduces.",
  },

  // JavaScript & Frontend
  {
    id: 39,
    category: "JavaScript & Frontend",
    difficulty: "Easy",
    question:
      "Explain the difference between let, const, and var in JavaScript.",
  },
  {
    id: 40,
    category: "JavaScript & Frontend",
    difficulty: "Medium",
    question:
      "How does the JavaScript event loop work?",
  },
  {
    id: 41,
    category: "JavaScript & Frontend",
    difficulty: "Hard",
    question:
      "How would you optimize a React application suffering from unnecessary re-renders?",
  },

  // Backend Engineering
  {
    id: 42,
    category: "Backend Engineering",
    difficulty: "Easy",
    question:
      "What is a REST API and what makes an API RESTful?",
  },
  {
    id: 43,
    category: "Backend Engineering",
    difficulty: "Medium",
    question:
      "Explain authentication vs authorization. How does JWT authentication work?",
  },
  {
    id: 44,
    category: "Backend Engineering",
    difficulty: "Hard",
    question:
      "Design a rate limiter for a public API used by millions of users.",
  },

  // Behavioral
  {
    id: 45,
    category: "Behavioral",
    difficulty: "Easy",
    question:
      "Tell me about yourself and why you are interested in software engineering.",
  },
  {
    id: 46,
    category: "Behavioral",
    difficulty: "Medium",
    question:
      "Tell me about a difficult technical problem you solved. How did you approach debugging it?",
  },
  {
    id: 47,
    category: "Behavioral",
    difficulty: "Medium",
    question:
      "Describe a situation where you had to quickly learn a new technology or framework.",
  },
  {
    id: 48,
    category: "Behavioral",
    difficulty: "Hard",
    question:
      "Tell me about a time you disagreed with a teammate on a technical decision. What happened?",
  },
  {
    id: 49,
    category: "Behavioral",
    difficulty: "Hard",
    question:
      "Describe a major failure or mistake in a project. What did you learn from it?",
  },
];

// Dynamically derived categories

export const categories: Category[] = [
  "Arrays & Hashing",
  "Linked Lists",
  "Trees & Graphs",
  "Dynamic Programming",
  "Sorting & Searching",
  "System Design",
  "Concurrency",
  "Object-Oriented Design",
  "Databases",
  "Networking",
  "Operating Systems",
  "JavaScript & Frontend",
  "Backend Engineering",
  "Behavioral",
];