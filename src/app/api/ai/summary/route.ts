import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { AISummaryRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: AISummaryRequest = await req.json();
    const { contactName, activities, notes } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are an executive AI assistant in Avex CRM. Summarize the current status and relationship context for contact "${contactName}".

Activities log:
${activities.map(a => `- [${a.type}] ${a.title}: ${a.description} (${a.timestamp})`).join('\n')}

Notes:
${notes.map(n => `- ${n.content} (by ${n.author})`).join('\n')}

Provide a clear, professional 2-3 sentence executive summary explaining where things stand, key recent progress, and recommended next steps. Do not include markdown code block quotes.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text?.trim();
        if (text) {
          return NextResponse.json({ summary: text });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to local summary heuristic:', geminiError);
      }
    }

    // Heuristic Fallback summary if Gemini API key is missing or errored
    const recentActivity = activities[0];
    const recentNote = notes[0];

    let fallbackSummary = `${contactName} is actively engaged in the pipeline.`;
    if (recentActivity) {
      fallbackSummary += ` Latest update: ${recentActivity.title} (${recentActivity.description}).`;
    }
    if (recentNote) {
      fallbackSummary += ` Note context: "${recentNote.content}".`;
    }

    return NextResponse.json({ summary: fallbackSummary });
  } catch (error: any) {
    console.error('Error generating AI summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI summary' },
      { status: 500 }
    );
  }
}
