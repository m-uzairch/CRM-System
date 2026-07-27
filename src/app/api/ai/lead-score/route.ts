import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { AILeadScoreRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: AILeadScoreRequest = await req.json();
    const { contact, activities, deals } = body;

    // Rule-based heuristic scoring initial calculation
    let recencyScore = 20;
    let dealValueScore = 30;
    let activityVolumeScore = 20;

    // Recency check
    const recentActivity = activities[0];
    if (recentActivity) {
      const daysAgo = (Date.now() - new Date(recentActivity.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      if (daysAgo <= 3) recencyScore = 35;
      else if (daysAgo <= 7) recencyScore = 25;
      else if (daysAgo <= 14) recencyScore = 15;
      else recencyScore = 5;
    }

    // Deal value check
    const totalDealValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
    if (totalDealValue >= 50000) dealValueScore = 40;
    else if (totalDealValue >= 20000) dealValueScore = 30;
    else if (totalDealValue >= 5000) dealValueScore = 20;
    else dealValueScore = 10;

    // Activity volume check
    if (activities.length >= 5) activityVolumeScore = 25;
    else if (activities.length >= 2) activityVolumeScore = 18;
    else activityVolumeScore = 10;

    let baseScore = Math.min(100, recencyScore + dealValueScore + activityVolumeScore);

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are a Lead Scoring AI Specialist in Avex CRM. Evaluate lead conversion probability for contact "${contact.name}" (${contact.email}).

Contact Status: ${contact.status}
Tags: ${contact.tags.join(', ')}
Total Deal Pipeline Value: $${totalDealValue.toLocaleString()}
Total Activities Logged: ${activities.length}
Recent Activities: ${activities.map(a => a.title).join(', ')}

Evaluate engagement signal strength and return a JSON object with this EXACT structure (no code fences, raw JSON only):
{
  "score": number between 0 and 100,
  "rating": "Hot" or "Warm" or "Cold",
  "recommendations": ["Action item 1", "Action item 2"]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const rawText = response.text?.trim() || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            score: parsed.score || baseScore,
            rating: parsed.rating || (baseScore >= 75 ? 'Hot' : baseScore >= 50 ? 'Warm' : 'Cold'),
            breakdown: { recencyScore, dealValueScore, activityVolumeScore },
            recommendations: parsed.recommendations || ['Schedule follow-up discovery call', 'Send updated proposal'],
          });
        }
      } catch (geminiError) {
        console.warn('Gemini Lead Score LLM call failed, using heuristic fallback:', geminiError);
      }
    }

    // Heuristic fallback
    const rating = baseScore >= 75 ? 'Hot' : baseScore >= 50 ? 'Warm' : 'Cold';
    const recommendations = [];
    if (recencyScore < 20) recommendations.push('Re-engage contact with updated project pitch.');
    if (dealValueScore >= 30) recommendations.push('Priority high-value deal — schedule decision-maker call.');
    if (recommendations.length === 0) recommendations.push('Maintain regular check-in cadence.');

    return NextResponse.json({
      score: baseScore,
      rating,
      breakdown: { recencyScore, dealValueScore, activityVolumeScore },
      recommendations,
    });
  } catch (error: any) {
    console.error('Error generating AI lead score:', error);
    return NextResponse.json(
      { error: 'Failed to calculate lead score' },
      { status: 500 }
    );
  }
}
