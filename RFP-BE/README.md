This service is built using Node.js, Express, Prisma, PostgreSQL, Kafka, and integrates with Mistral/Ollama for LLM responses.

Project Setup:
    Prerequisites:
        Before starting, ensure you have installed:
        Node.js	v18+
        PostgreSQL	13+
        Kafka	Running locally
        npm or yarn	Latest
        Ollama / Mistral server	Running at http://localhost:11434
        Gmail App Password	For SMTP/IMAP

    Steps to Run Project:
    - Start backend first
        - make sure to make envs in backend and frontend using .env.example

        - Install llama locally (commands): 
            - brew install ollama
            - ollama list
            - ollama pull Mistral
            - ollama serve

        - Start Kafka locally (commands):
            - java -version (if not installed then install brew install openjdk@17) and add it to path
            - brew install kafka
            - brew services start kafka

        - Start Backend:
            - npm i
            - npm run dev
        - Start Frontend:
            - npm i
            -npm run dev

    -- NOW TEST EVERYTHING
    

Tech Stack & Key libraries:
    Node.js
    Express.js
    PostgreSQL
    Prisma ORM
    Mistral / Ollama local LLM
    Nodemailer (SMTP sending)
    ImapFlow (email receiving)
    Kafka (async event processing)
    axios
    zod (validation)
    dotenv


API DOCUMENTATION:

1) /activities
   METHOD: GET
   Request Body: None
   Params: None

   Success Message:
   {
     "success": true,
     "data": [
       {
         "id": 12,
         "title": "RFP created",
         "createdAt": "2025-02-05T10:30:22.000Z",
         "timeAgo": "2 hours ago"
       }
     ]
   }



2) /brief-data
   METHOD: GET
   Request Body: None
   Params: None

   Success Message:
   {
     "success": true,
     "data": {
       "rfpsCreated": 50,
       "proposalReceived": 30,
       "vendorCount": 12
     },
     "message": "Data fetched successfully"
   }



3) /get-history
   METHOD: GET
   Request Body: None
   Params: None

   Success Message:
   {
     "success": true,
     "message": "History fetched Successfully",
     "data": [
       {
         "id": 17,
         "prompt": "Create an RFP for software automation...",
         "createdAt": "2025-02-04T12:22:10.000Z",
         "timeAgo": "1 day ago"
       }
     ]
   }



4) /get-history-detail/:id
   METHOD: GET
   Request Body: None
   Params:
     - id (required)

   Success Message:
   {
     "success": true,
     "message": "History details fetched Successfully",
     "data": {
       "id": 17,
       "promptId": 10,
       "rfpJson": { ... },
       "createdAt": "2025-02-05T10:20:10.000Z"
     }
   }


5) /create-prompt
   METHOD: POST
   Request Body:
   {
     "prompt": "Write an RFP for website redesign"
   }
   Params: None

   Success Message:
   {
     "success": true,
     "message": "RFP created successfully",
     "data": {
       "id": 12,
       "promptId": 7,
       "rfpJson": { ... }
     }
   }


6) /send-mail
   METHOD: POST
   Request Body:
   {
     "vendorEmails": ["test@gmail.com", "vendor@xyz.com"],
     "promptId": 7,
     "rfpJson": {
       "title": "Website Redesign",
       ...
     }
   }
   Params: None

   Success Message:
   {
     "success": true,
     "message": "Email sent successfully",
     "messageId": "abc123",
     "accepted": ["test@gmail.com"],
     "rejected": []
   }


7) /get-rfps
   METHOD: GET
   Request Body: None
   Params: None

   Success Message:
   {
     "success": true,
     "data": [
       {
         "id": 7,
         "title": "Website Redesign",
         "timeAgo": "2 hours ago"
       }
     ]
   }


8) /get-rfp/:id
   METHOD: GET
   Request Body: None
   Params:
     - id (required)

   Success Message:
   {
     "success": true,
     "totalReplies": 3,
     "data": [
       {
         "id": 20,
         "promptId": 7,
         "vendorEmail": "vendor@example.com",
         "reply": "...",
         "createdAt": "2025-02-05T10:21:00.000Z"
       }
     ]
   }


9) /get-templates
   METHOD: GET
   Request Body: None
   Params: None

   Success Message:
   {
     "success": true,
     "data": [
       {
         "id": 1,
         "name": "Default Template",
         "systemPrompt": "..."
       },
       {
         "id": 2,
         "name": "Technical Template",
         "systemPrompt": "..."
       }
     ]
   }


10) /save-template
    METHOD: POST
    Request Body:
    {
      "templateId": 2
    }
    Params: None

    Success Message:
    {
      "success": true,
      "message": "Template saved successfully"
    }


11) /get-saved-template
    METHOD: GET
    Request Body: None
    Params: None

    Success Message (when template is selected):
    {
      "success": true,
      "data": {
        "id": 2,
        "message":"Template Fetched",
        "name": "Technical Template",
        "systemPrompt": "..."
      }
    }

    Success Message (when no template has been selected yet):
    {
      "success": true,
      "message": "No template selected till now"
    }

12) /create-vendor
    METHOD: POST
    Request Body:
    {
      "name": "John Doe",
      "email": "john@example.com",
      "category": "IT Services"
    }
    Params: None

    Success Message:
    {
      "success": true,
      "message": "Vendor created successfully",
      "vendor": {
        "id": 5,
        "name": "John Doe",
        "email": "john@example.com",
        "category": "IT Services"
      }
    }


13) /vendors
    METHOD: GET
    Request Body: None
    Params:
      - search (optional)

    Success Message:
    {
      "success": true,
      "message": "Vendor fetched successfully"
      "vendors": [
        {
          "id": 1,
          "name": "Tech Corp",
          "email": "techcorp@gmail.com",
          "category": "Software"
        },
        {
          "id": 2,
          "name": "BuildCo",
          "email": "buildco@gmail.com",
          "category": "Construction"
        }
      ]
    }


14) /vendors/:id
    METHOD: DELETE
    Request Body: None
    Params:
      - id (required)

    Success Message:
    {
      "success": true,
      "message": "Vendor deleted successfully"
    }



MORE DETAILS:
    I have used Gmail App Password for SMTP because it is free, but it comes with limitations. Since Gmail can be slow and may fail occasionally, it’s better to integrate a backup email service to ensure users never face disruptions.

    For the AI model, instead of relying on cloud-based LLMs like ChatGPT or Gemini, I used a local LLM (Llama) since it is free and suitable for local development. However, the downside is that deploying a local model in production can be significantly more expensive than using an API, but due to the lack of an API key and the project's local setup requirement, I opted for Llama.

    For scoring the prompts, I built a system based on several evaluation criteria, including completeness of the response, technical feasibility, experience, communication quality, and differentiators. These factors help generate a more structured and meaningful scoring output.

    Regarding AI-assisted development, I used ChatGPT. ChatGPT specifically helped with understanding project better and how can I stand out among all candidates and offering UI ideas, but all core logic and implementation were written by me.

    In terms of learning, I was new to the concept of capturing email replies using IMAP. When I first ran my IMAP listener, I realized it fetches all emails from the day the Gmail account was created, which resulted in a massive log output.

    Because of the limited time, I used console.log for important logging instead of implementing a proper logger like Winston or Pino. A structured logger can always be added later, but for now, console logging allowed me to track essential events quickly.

    When the IMAP listener detects a new email, the email is captured instantly. Instead of calling an external API or endpoint to process it, I designed the system so that the local LLM directly generates a score for the email. To achieve fast and modern asynchronous processing, I used event-driven architecture with Kafka.

    Kafka acts as a messaging queue:
    When an email reply is received, an event is produced.
    A consumer listens to that event and triggers the scoring workflow using the local LLM.
    This approach ensures high performance, loose coupling, and scalability.

    I also used Kafka for the activity section. Any significant user action produces an activity event, and the consumer stores it in the activity table, ensuring that activity logging is efficient and consistent.
    For the database, I chose PostgreSQL. Although certain modern tech stacks use NoSQL databases like MongoDB for storing prompts or conversational data, I intentionally selected PostgreSQL because many companies are now using Postgres even for semi-structured data. PostgreSQL’s JSON and JSONB support makes it powerful enough to store scoring results, prompt structures, and AI-generated responses without compromising relational integrity.

    To further improve the LLM output quality, I introduced domain selection. If the user wants scoring or responses tailored to a specific domain, the selected domain influences the prompt given to the LLM. This results in more accurate, context-aware, and domain-specific responses.

