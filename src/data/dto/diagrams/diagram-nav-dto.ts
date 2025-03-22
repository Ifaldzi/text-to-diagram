export interface DiagramNavDto {
  id: string;
  title: string;
  isActive?: boolean;
  isFolder?: boolean;
  items?: {
    id: string;
    title: string;
    isActive?: boolean;
  }[];
}
