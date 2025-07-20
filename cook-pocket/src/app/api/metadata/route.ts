import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const getMetaContent = (name: string): string => {
      const meta = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
      return meta?.getAttribute('content') || '';
    };

    const title = 
      getMetaContent('og:title') ||
      getMetaContent('twitter:title') ||
      document.querySelector('title')?.textContent ||
      new URL(url).hostname;

    const image = 
      getMetaContent('og:image') ||
      getMetaContent('twitter:image') ||
      '';

    const description = 
      getMetaContent('og:description') ||
      getMetaContent('twitter:description') ||
      getMetaContent('description') ||
      '';

    return NextResponse.json({
      title: title.trim(),
      image: image.trim(),
      description: description.trim()
    });

  } catch (error) {
    console.error('Error fetching metadata:', error);
    
    const urlObj = new URL(url);
    return NextResponse.json({
      title: urlObj.hostname,
      image: '',
      description: ''
    });
  }
}