import { BaseModel } from "./base-model";

export interface Diagram extends BaseModel {
  title: string;
  content: string;
  isFolder: boolean;
  parentId?: string | null;
}
