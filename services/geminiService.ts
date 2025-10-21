import { GoogleGenAI, Type } from "@google/genai";
import { PromptInputs, PromptInputKey, GeneratedOutput, JsonOutput } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative title for the video concept." },
    overall_prompt: { type: Type.STRING, description: "A single, complete narrative prompt text that synthesizes all scenes and elements into a cohesive paragraph. This is the main scenario text." },
    genre: { type: Type.STRING },
    style: { type: Type.STRING },
    mood: { type: Type.STRING },
    bgm: { type: Type.STRING, description: "Description of the background music." },
    voice_narration: { type: Type.STRING, description: "Description of any voiceover or narration." },
    total_duration: { type: Type.NUMBER, description: "The total duration of the video in seconds." },
    dialogue_details: {
      type: Type.OBJECT,
      description: "Details about the dialogue speakers and style.",
      properties: {
        speakers: { type: Type.STRING, description: "Description of the speakers (e.g., 'One male, one female', 'Two speakers')." },
        style: { type: Type.STRING, description: "The style of the dialogue (e.g., 'Whispering', 'Argumentative')." }
      },
      required: ["speakers", "style"]
    },
    scenes: {
      type: Type.ARRAY,
      description: "An array of scene objects, with each object detailing a specific segment of the video.",
      items: {
        type: Type.OBJECT,
        properties: {
          scene_number: { type: Type.INTEGER },
          description: { type: Type.STRING, description: "A detailed visual and narrative description of this specific scene." },
          camera: { type: Type.STRING, description: "Camera shot and movement for this scene." },
          sfx: { type: Type.STRING, description: "Sound effects for this scene." },
          dialogue: { type: Type.STRING, description: "Any dialogue spoken in this scene. Should be an empty string if there is no dialogue." },
        },
        required: ["scene_number", "description", "camera", "sfx", "dialogue"],
      },
    },
  },
  required: ["title", "overall_prompt", "genre", "style", "mood", "bgm", "voice_narration", "total_duration", "dialogue_details", "scenes"],
};

function getSpeakerDetails(inputs: PromptInputs): string {
    switch(inputs.speakerGender) {
        case 'male': return 'One male speaker.';
        case 'female': return 'One female speaker.';
        case 'multiple': return `${inputs.speakerCount} speakers.`;
        case 'unspecified':
        default: return 'Not specified.';
    }
}

export async function generateVideoPrompt(inputs: PromptInputs, language: 'en' | 'ko'): Promise<GeneratedOutput> {
  const languageName = language === 'ko' ? 'Korean' : 'English';
  
  const speakerDetails = getSpeakerDetails(inputs);

  const geminiPrompt = `
    You are an expert prompt engineer specializing in creating detailed, vivid, and effective prompts for AI video generation models.
    Your task is to take a user's inputs and generate a comprehensive video prompt, structured as a JSON object. The entire output, including all text fields in the JSON, must be in ${languageName}.

    The final JSON must conform to the provided schema. It should detail visual elements, camera movements, lighting, mood, and all audio cues (BGM, SFX, voice, dialogue). The total video duration should be exactly ${inputs.duration} seconds, and it must be structured into exactly ${inputs.segments} distinct scenes.

    User's inputs:
    - Core Idea: "${inputs.simpleIdea}"
    - Genre: "${inputs.genre || 'not specified'}"
    - Style: "${inputs.style || 'not specified'}"
    - Subject: "${inputs.subject || 'not specified'}"
    - Action: "${inputs.action || 'not specified'}"
    - Setting: "${inputs.setting || 'not specified'}"
    - Camera: "${inputs.camera || 'not specified'}"
    - Mood: "${inputs.mood || 'not specified'}"
    - BGM: "${inputs.bgm || 'not specified'}"
    - SFX: "${inputs.sfx || 'not specified'}"
    - Voice/Narration: "${inputs.voice || 'not specified'}"
    - Dialogue Speaker Details: "${speakerDetails}"
    - Dialogue Style: "${inputs.dialogueStyle || 'not specified'}"
    - Dialogue Content: "${inputs.dialogue || 'not specified'}"

    Instructions:
    1.  Create a creative title based on the core idea.
    2.  Write a cohesive, narrative 'overall_prompt' that synthesizes all elements into a single paragraph. This will be the main scenario text.
    3.  Divide the concept into exactly ${inputs.segments} scenes. For each scene in the 'scenes' array, provide a detailed description, camera direction, and relevant sound effects.
    4.  Distribute the total duration of ${inputs.duration} seconds logically across the scenes.
    5.  **Crucially, you must generate appropriate dialogue for each scene that requires it.** The dialogue should be based on the core idea, the scene's specific action, and the user's dialogue settings (speakers, style, and content). 
        - If the user provided specific 'Dialogue Content', use it as a guide and distribute or adapt it logically across the scenes.
        - If 'Dialogue Content' is empty or "not specified", you MUST create original dialogue that fits the scene and the overall narrative. If a scene has no dialogue, the 'dialogue' field for that scene must be an empty string.
    6.  Populate the 'dialogue_details' object based on the dialogue inputs.
    7.  If any other input field is 'not specified', use your creative expertise to infer appropriate details that complement the core idea.
    8.  The final output must be ONLY the generated JSON object that strictly follows the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: geminiPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    const jsonOutput: JsonOutput = JSON.parse(response.text);

    return {
      scenario: jsonOutput.overall_prompt,
      json: jsonOutput,
    };
  } catch (error) {
    console.error("Error generating prompt with Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`An error occurred: ${errorMessage}. Please check your API key and network connection.`);
  }
}

export async function getSuggestion(field: PromptInputKey, inputs: PromptInputs, language: 'en' | 'ko'): Promise<string> {
  if (!inputs.simpleIdea) return '';
  
  const languageName = language === 'ko' ? 'Korean' : 'English';
  let geminiPrompt = '';

  if (field === 'dialogue') {
      const speakerDetails = getSpeakerDetails(inputs);
      geminiPrompt = `
      You are a creative screenwriter assistant.
      Your task is to generate a short, sample dialogue that is **directly inspired by** the user's video concept.

      User's video concept:
      - Core Idea: "${inputs.simpleIdea}"
      - Speaker Details: "${speakerDetails}"
      - Dialogue Style: "${inputs.dialogueStyle || 'Natural conversation'}"
      - Genre: "${inputs.genre || 'not specified'}"
      - Mood: "${inputs.mood || 'not specified'}"

      Instructions:
      1. The dialogue must be in ${languageName}.
      2. The dialogue must be concise and **directly reflect the core idea, genre, mood, and dialogue style**. It should feel like a key moment from the story.
      3. The output must be ONLY the dialogue text itself. Do not include character names unless it's essential for understanding (e.g. "John, look out!"). Do not add quotation marks around the entire output.
      
      Example for core idea "two detectives investigating a crime scene", style "Tense whisper":
      "Did you see that? Over there, in the shadows."
      "Stay quiet. We're not alone."
      `;
  } else {
    const fieldTranslations = {
      en: {
        genre: "Genre", style: "Style", subject: "Subject", action: "Action/Scene",
        setting: "Setting/Environment", camera: "Camera Shot/Movement", mood: "Mood/Lighting",
        bgm: "Background Music (BGM)", sfx: "Sound Effects (SFX)", voice: "Voice / Narration",
        dialogueStyle: "Dialogue Style", dialogue: "Dialogue Content"
      },
      ko: {
        genre: "장르", style: "스타일", subject: "주제", action: "액션/장면",
        setting: "배경/환경", camera: "카메라 샷/움직임", mood: "분위기/조명",
        bgm: "배경음악 (BGM)", sfx: "음향 효과 (SFX)", voice: "보이스 / 나레이션",
        dialogueStyle: "대화 스타일", dialogue: "대화 내용"
      }
    };
    if (['simpleIdea', 'duration', 'segments', 'speakerGender', 'speakerCount'].includes(field)) return '';
    const fieldName = fieldTranslations[language][field as keyof typeof fieldTranslations['en']];
    const genreContext = (field === 'bgm' || field === 'sfx') && inputs.genre 
      ? `The specified genre is: "${inputs.genre}".` 
      : '';
    
    geminiPrompt = `
      You are a creative assistant for video prompt generation.
      Your task is to provide a single, creative, and concise suggestion for a specific part of a video prompt.

      The user's core idea is: "${inputs.simpleIdea}"
      ${genreContext}
      The category you need to generate a suggestion for is: "${fieldName}"

      Instructions:
      1. The suggestion must be in ${languageName}.
      2. Be specific and imaginative.
      3. The output must be ONLY the suggestion text itself. Do not include labels, quotation marks, or any introductory phrases like "Here is a suggestion:".
      
      Example for the "Background Music (BGM)" category based on core idea "a knight fighting a dragon" and genre "dark fantasy":
      Output: "A haunting, orchestral score with deep drums and faint choral chants, building to a crescendo."
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: geminiPrompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error(`Error getting suggestion for ${field}:`, error);
     if (error instanceof Error) {
        return `Error: ${error.message}`;
    }
    return "An unknown error occurred.";
  }
}