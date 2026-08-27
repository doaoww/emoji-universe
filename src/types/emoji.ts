export interface RawEmoji {
  name: string;
  category: string;
  group: string;
  htmlCode: string[];
  unicode: string[];
}

export interface Emoji {
  slug: string;
  name: string;
  char: string;
  category: string;
  group: string;
  description: string;
  unicode: string;
  htmlCode: string;
}

export interface EmojiListResponse {
  emojis: Emoji[];
  categories: string[];
  total: number;
}
