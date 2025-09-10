import { GoogleGenAI, Type } from '@google/genai';
// FIX: Import `QuestionCategory` as a value because it's an enum used at runtime in the switch statement.
import { QuestionCategory, type AptitudeQuestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPromptForCategory = (category: QuestionCategory): string => {
    const coreInstruction = `You are an expert aptitude test creator for top-tier consulting firms like McKinsey, BCG, and Bain. 
    Generate a single, challenging multiple-choice question for the category: "${category}".
    The question must be high-quality and representative of what a candidate would face in a real screening test.
    Provide 4 distinct multiple-choice options. One option must be clearly correct.
    The 'answer' field must exactly match one of the provided options.
    Provide a detailed, step-by-step 'explanation' for the correct answer.`;

    switch (category) {
        case QuestionCategory.NUMERICAL:
            return `${coreInstruction} The question MUST involve interpreting data from a chart. Generate relevant data for a bar, pie, or line chart. The chart data should be realistic for a business context. For example, revenue by region, market share, or production units.`;
        case QuestionCategory.LOGICAL:
            return `${coreInstruction} The question should be a classic logical reasoning problem, like a pattern recognition (e.g., series of numbers or figures), a syllogism, or a logical deduction puzzle. Do not ask for visual patterns that require images.`;
        case QuestionCategory.VERBAL:
            return `${coreInstruction} The question should consist of a short passage (2-4 sentences) followed by a question that requires critical reasoning, inference, or identifying the main idea based ONLY on the provided text.`;
        case QuestionCategory.CASE_STUDY:
            return `${coreInstruction} The question should be a mini-case study. Present a brief business scenario (e.g., a company facing declining profits) and ask a question that requires business acumen to answer, such as identifying a potential cause, suggesting a good next step for analysis, or calculating a simple business metric like profit margin.`;
        default:
            return coreInstruction;
    }
};


const responseSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING, description: "The main text of the question." },
        options: {
            type: Type.ARRAY,
            description: "An array of 4 multiple-choice options.",
            items: { type: Type.STRING }
        },
        answer: { type: Type.STRING, description: "The correct option from the 'options' array." },
        explanation: { type: Type.STRING, description: "A detailed step-by-step explanation of how to arrive at the correct answer." },
        questionType: { type: Type.STRING, description: "The category of the question." },
        chartData: {
            type: Type.OBJECT,
            description: "Data for rendering a chart, if applicable (especially for Numerical Reasoning).",
            nullable: true,
            properties: {
                type: { type: Type.STRING, description: "Type of chart, e.g., 'bar', 'pie', 'line'." },
                data: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            value: { type: Type.NUMBER }
                        },
                        required: ["name", "value"]
                    }
                },
                dataKey: { type: Type.STRING, description: "The key in the data objects that holds the numerical value (e.g., 'value')." }
            }
        }
    },
    required: ["question", "options", "answer", "explanation", "questionType"]
};


export const generateAptitudeQuestion = async (category: QuestionCategory): Promise<AptitudeQuestion> => {
    try {
        const prompt = getPromptForCategory(category);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 1,
            }
        });
        
        const text = response.text.trim();
        const questionJson = JSON.parse(text);

        // Basic validation
        if (!questionJson.question || !questionJson.options || questionJson.options.length !== 4) {
            throw new Error("Received malformed question data from API.");
        }
        
        return questionJson as AptitudeQuestion;

    } catch (error) {
        console.error(`Error generating question for category ${category}:`, error);
        throw new Error('Failed to communicate with the AI model.');
    }
};