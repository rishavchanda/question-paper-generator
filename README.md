# Question Paper Generator API

This is a Question Paper Generator API built using Node.js and MongoDB.

### Deployed live at [https://question-paper-generator-h2ex.onrender.com](https://question-paper-generator-h2ex.onrender.com)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rishavchanda/question-paper-generator
   cd question-paper-generator
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up MongoDB:**

   - Make sure MongoDB is installed and running on your machine or you can use my mongo db test url.
   - Create a `.env` file in the root directory with the following content:

     ```env
     MONGO_URL=mongodb://localhost:27017/question-paper-generator
     ```

     or

     ```
     MONGO_URL = "mongodb+srv://rishavchanda0:ig7l04xeVw7MbQa1@cluster0.u09mcoa.mongodb.net/?retryWrites=true&w=majority"
     ```

## Running the Application

```bash
npm start
```

## API Endpoints

### Questions

| Method | Endpoint              | Description                        | Request Body | Response Body |
| ------ | --------------------- | ---------------------------------- | ------------ | ------------- |
| `POST` | `/api/addQuestions`   | Create a new question              | JSON         | JSON          |
| `GET`  | `/api/generate-paper` | Get questions according to request | JSON         | JSON          |

### 1. Create a new question

**Endpoint:** `POST /api/addQuestions`

**Description:** Create a new question.

**Request Body Example:**

```json
{
  "question": "What is the speed of light?",
  "subject": "Physics",
  "topic": "Waves",
  "difficulty": "Easy",
  "marks": 5
}
```

**Response Body Example:**

```json
{
  "message": "Question added successfully"
}
```

### 2. Get all questions

**Endpoint:** `GET /api/generate-paper`

**Description:** Get questions according to request.

**Request Body Example 1:**

```json
{
  "totalMarks": 100,
  "difficultyDistribution": {
    "Easy": 30,
    "Medium": 60,
    "Hard": 10
  }
}
```

**Response Body Example:**

```json
{
  "total_questions": 15,
  "total_marks": 100,
  "distribution": {
    "Easy": {
      "targetMarks": 20,
      "currentMarks": 20,
      "count": 4,
      "topics": {}
    },
    "Medium": {
      "targetMarks": 50,
      "currentMarks": 50,
      "count": 7,
      "topics": {}
    },
    "Hard": {
      "targetMarks": 30,
      "currentMarks": 30,
      "count": 4,
      "topics": {}
    }
  },
  "questions": [...]
}
```

**Request Body Example 2:**

```json
{
  "totalMarks": 100,
  "difficultyDistribution": {
    "Easy": 30,
    "Medium": 60,
    "Hard": 10
  },
  "topicDistribution": {
    "Physics": 40,
    "Chemistry": 30,
    "Mathematics": 30
  }
}
```

**Response Body Example:**

```json
{
  "total_questions": 17,
  "total_marks": 100,
  "distribution": {
    "Easy": {
      "targetMarks": 30,
      "currentMarks": 30,
      "count": 5,
      "topics": {
        "Physics": {
          "targetMarks": 12,
          "currentMarks": 12,
          "count": 2
        },
        "Chemistry": {
          "targetMarks": 9,
          "currentMarks": 6,
          "count": 1
        },
        "Mathematics": {
          "targetMarks": 9,
          "currentMarks": 6,
          "count": 1
        }
      }
    },
    "Medium": {
      "targetMarks": 60,
      "currentMarks": 60,
      "count": 10,
      "topics": {
        "Physics": {
          "targetMarks": 24,
          "currentMarks": 24,
          "count": 4
        },
        "Chemistry": {
          "targetMarks": 18,
          "currentMarks": 18,
          "count": 4
        },
        "Mathematics": {
          "targetMarks": 18,
          "currentMarks": 18,
          "count": 4
        }
      }
    },
    "Hard": {
      "targetMarks": 10,
      "currentMarks": 10,
      "count": 2,
      "topics": {
        "Physics": {
          "targetMarks": 4,
          "currentMarks": 1,
          "count": 1
        },
        "Chemistry": {
          "targetMarks": 3,
          "currentMarks": 1,
          "count": 1
        },
        "Mathematics": {
          "targetMarks": 3,
          "currentMarks": 1,
          "count": 1
        }
      }
    }
  },
  "questions": [...]
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
