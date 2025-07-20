// タグを分割するためのユーティリティ関数
export function splitTags(input: string): string[] {
  return input
    .split(/[,、]/) // カンマと日本語の読点の両方で分割
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

// タグ配列を文字列に結合する関数
export function joinTags(tags: string[]): string {
  return tags.join('、'); // 日本語の読点で結合
}

// タグの数をチェックする関数
export function validateTagCount(input: string, maxCount: number = 5): boolean {
  const tags = splitTags(input);
  return tags.length <= maxCount;
}

// タグの文字列から実際のタグ数を取得する関数
export function getTagCount(input: string): number {
  return splitTags(input).length;
}