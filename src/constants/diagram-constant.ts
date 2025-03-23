export enum SAVE_STATUS {
  SAVING = "Saving",
  SAVED = "Saved",
}

export const DEFAULT_MARKDOWN = `graph TD
  A[Start] --> B{Decision?}
  B -- Yes --> C[Action 1]
  B -- No --> D[Action 2]
  C --> E[End]
  D --> E`;
