export interface MetaData {
  title: string;
  image: string;
  description?: string;
}

export async function fetchMetadata(url: string): Promise<MetaData> {
  try {
    const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching metadata:', error);
    const urlObj = new URL(url);
    return {
      title: urlObj.hostname,
      image: '',
      description: ''
    };
  }
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return new URL(url).toString();
  } catch {
    return url;
  }
}