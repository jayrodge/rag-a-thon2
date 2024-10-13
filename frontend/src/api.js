// API data for user's work over a period of time (2015-2024)
const workTypes = [
  "Research Paper",
  "Patents",
  "News Article",
  "Work Performance",
  "Letter of Recommendation",
  "Statement of Purpose",
  "Hackathon",
  "Grant Detail",
  "Educational Record"
];

const workTitles = {
  "Research Paper": [
    "A Survey on Generative Models in AI - Published by Stanford University",
    "Improving Training Efficiency for Generative AI at OpenAI",
    "Multi-Modal Learning in Neural Networks - MIT Research Paper"
  ],
  "Patents": [
    "AI-Powered Chatbot System for Retail Customer Service - Amazon Patent",
    "Generative Text-to-Image System for E-Commerce - Shopify Innovation"
  ],
  "News Article": [
    "How Generative AI is Revolutionizing Healthcare - Forbes",
    "The Future of AI in Business - Interview with IBM AI Lead",
    "Breakthrough in Generative AI by Google Research"
  ],
  "Work Performance": [
    "Led Development of AI Platform for Healthcare Analytics at Google",
    "Optimized Performance of Generative AI Model at Microsoft Research"
  ],
  "Letter of Recommendation": [
    "LOR for Senior AI Engineer Position at DeepMind",
    "LOR for PhD in Machine Learning - Stanford University"
  ],
  "Statement of Purpose": [
    "SOP for MS in AI at Carnegie Mellon University",
    "SOP for PhD in Generative Models at MIT"
  ],
  "Hackathon": [
    "Winner of OpenAI Hackathon 2021 - Developed Generative AI System",
    "Champion of Generative AI Challenge 2022 - Google AI"
  ],
  "Grant Detail": [
    "Research Grant for AI-Powered Healthcare Systems from National Institutes of Health",
    "Generative AI Research Grant from the European Research Council"
  ],
  "Educational Record": [
    "Master’s in AI from Stanford University",
    "PhD in Machine Learning from MIT"
  ]
};

const workDescriptions = {
  "Research Paper": [
    "This paper provides a comprehensive survey of recent advancements in generative AI models, focusing on applications in computer vision and natural language processing, with case studies from leading tech companies such as OpenAI and DeepMind.",
    "This paper introduces novel training techniques for improving the efficiency and scalability of generative models. The research was carried out in collaboration with OpenAI and Google Brain.",
    "In this work, researchers from MIT explore the intersection of multi-modal learning, enabling AI systems to process and integrate data from multiple sources, such as text, images, and speech."
  ],
  "Patents": [
    "This patent outlines an innovative chatbot system that leverages AI to automate customer service for e-commerce platforms. It was developed and patented by Amazon for its retail operations.",
    "This Shopify patent details a system that generates product images from textual descriptions, allowing e-commerce businesses to streamline their creative processes."
  ],
  "News Article": [
    "Forbes covers how generative AI models are being used to revolutionize healthcare, with a focus on IBM’s Watson Health platform and its applications in diagnostics and personalized treatment.",
    "An in-depth interview with IBM’s AI Lead, exploring how AI and generative technologies are transforming industries like finance, retail, and healthcare.",
    "This article highlights a significant breakthrough by Google Research in the field of generative AI, discussing the implications for natural language processing and creative industries."
  ],
  "Work Performance": [
    "At Google, I led a team of engineers in developing an AI platform that provided predictive healthcare analytics to hospitals, using machine learning models trained on vast medical datasets.",
    "While at Microsoft Research, I optimized the performance of a generative AI model designed to produce human-like text, resulting in a 30% reduction in training time and a significant improvement in output quality."
  ],
  "Letter of Recommendation": [
    "This LOR recommends the candidate for a senior AI engineer position at DeepMind, highlighting their contributions to AI research, particularly in the field of reinforcement learning and generative models.",
    "A letter written by a professor from Stanford University, recommending the candidate for a PhD program in machine learning, citing their groundbreaking research in generative models."
  ],
  "Statement of Purpose": [
    "In this SOP, the candidate outlines their motivations for pursuing an MS in AI at Carnegie Mellon University, detailing their previous research in generative models and their future aspirations to work in the healthcare sector.",
    "The SOP focuses on the candidate’s desire to pursue a PhD in generative models at MIT, referencing their work with OpenAI and their plans to contribute to multi-modal learning systems."
  ],
  "Hackathon": [
    "Developed a generative AI system that creates personalized shopping experiences for users, which won the top prize at the 2021 OpenAI Hackathon.",
    "Participated in the Google AI Generative AI Challenge in 2022, where I developed a model capable of generating realistic 3D images from text descriptions, securing the first prize."
  ],
  "Grant Detail": [
    "Awarded a research grant from the National Institutes of Health to develop AI-powered systems for analyzing patient data and predicting disease outcomes.",
    "This research grant from the European Research Council supports the development of generative AI models that can create high-quality content across multiple modalities (text, images, and video)."
  ],
  "Educational Record": [
    "Completed a Master’s in AI from Stanford University, with a focus on machine learning, generative models, and their applications in healthcare and business.",
    "Earned a PhD in Machine Learning from MIT, with a dissertation focused on generative models for image synthesis and their real-world applications in industries such as fashion and e-commerce."
  ]
};

// Helper function to generate a random date between 2015-2024
const getRandomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

// Helper function to get random work type, title, and description
const getRandomWork = () => {
  const workType = workTypes[Math.floor(Math.random() * workTypes.length)];
  const workTitle = workTitles[workType][Math.floor(Math.random() * workTitles[workType].length)];
  const workDescription = workDescriptions[workType][Math.floor(Math.random() * workDescriptions[workType].length)];

  return { workType, workTitle, workDescription };
};

// Generate work data for 60-70 entries
const generateWorkData = () => {
  const workData = [];
  for (let i = 0; i < 65; i++) {
    const { workType, workTitle, workDescription } = getRandomWork();
    const date_of_entry = getRandomDate(new Date(2015, 0, 1), new Date(2024, 11, 31));
    const year = new Date(date_of_entry).getFullYear(); // Extract year from date

    const entry = {
      year: year,
      work_type: workType,
      work_title: workTitle,
      work_description: workDescription,
      date_of_entry: date_of_entry
    };

    workData.push(entry);
  }
  return workData;
};

// API function simulation
export const getWorkData = () => {
  return generateWorkData();
};
