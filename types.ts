export interface PromptInputs {
  simpleIdea: string;
  genre: string;
  style: string;
  subject: string;
  action: string;
  setting: string;
  camera: string;
  mood: string;
  bgm: string;
  sfx: string;
  voice: string;
  dialogue: string;
  duration: number;
  segments: number;
  speakerGender: 'unspecified' | 'male' | 'female' | 'multiple';
  speakerCount: number;
  dialogueStyle: string;
}

export type PromptInputKey = keyof PromptInputs;

export interface SceneDetails {
  scene_number: number;
  description: string;
  camera: string;
  sfx: string;
  dialogue?: string;
}

export interface JsonOutput {
  title: string;
  overall_prompt: string;
  genre: string;
  style: string;
  mood: string;
  bgm: string;
  voice_narration: string;
  total_duration: number;
  dialogue_details: {
    speakers: string;
    style: string;
  };
  scenes: SceneDetails[];
}

export interface GeneratedOutput {
  scenario: string;
  json: JsonOutput;
}


export interface HistoryItem {
  id: number;
  output: GeneratedOutput;
}