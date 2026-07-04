import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const REPLICATE_ENDPOINT =
  'https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions';

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 20;

type ReplicatePrediction = {
  status?: string;
  output?: string | string[] | null;
  error?: string | null;
  urls?: {
    get?: string;
  };
};

const treatmentPrompts: Record<string, string> = {
  rinoplastia:
    "Apply a subtle, realistic rhinoplasty simulation to the nose. Preserve the person's identity, facial structure, skin texture, lighting, expression, and background. The result must look natural and medically plausible, not exaggerated.",
  botox:
    "Apply a subtle botox-like facial rejuvenation effect. Reduce expression lines naturally while preserving the person's identity, skin texture, lighting, facial expression, and background. The result must look realistic, not artificial.",
  lifting:
    "Apply a subtle facial lifting simulation. Slightly improve firmness and facial contour while preserving the person's identity, natural skin texture, lighting, expression, and background. Keep the result realistic and medically plausible.",
  'lifting facial':
    "Apply a subtle facial lifting simulation. Slightly improve firmness and facial contour while preserving the person's identity, natural skin texture, lighting, expression, and background. Keep the result realistic and medically plausible.",
  implantes:
    "Apply a realistic hair restoration simulation. Increase hair density naturally while preserving the person's identity, hairline realism, lighting, face shape, and background. Avoid exaggerated or artificial results.",
  'implantes capilares':
    "Apply a realistic hair restoration simulation. Increase hair density naturally while preserving the person's identity, hairline realism, lighting, face shape, and background. Avoid exaggerated or artificial results.",
};

function normalizeTreatment(treatment: string) {
  return treatment
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function buildPrompt(treatment: string) {
  const normalizedTreatment = normalizeTreatment(treatment);

  return (
    treatmentPrompts[normalizedTreatment] ??
    `Apply a subtle and realistic aesthetic simulation for ${treatment}. Preserve the person's identity, skin texture, lighting, expression, and background. Keep the result natural and medically plausible.`
  );
}

function extractResultImageUrl(output: ReplicatePrediction['output']) {
  if (typeof output === 'string' && output.length > 0) {
    return output;
  }

  if (Array.isArray(output)) {
    return output.find((item) => typeof item === 'string' && item.length > 0) ?? null;
  }

  return null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function replicateErrorMessage(data: ReplicatePrediction, fallback: string) {
  return typeof data.error === 'string' && data.error.length > 0 ? data.error : fallback;
}

async function parseReplicateResponse(response: Response) {
  try {
    return (await response.json()) as ReplicatePrediction;
  } catch {
    return {};
  }
}

async function fetchPrediction(url: string, token: string) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  const data = await parseReplicateResponse(response);

  if (!response.ok) {
    throw new Error(replicateErrorMessage(data, 'Replicate no pudo procesar la solicitud'));
  }

  return data;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      imageUrl?: unknown;
      treatment?: unknown;
    };

    const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '';
    const treatment = typeof body.treatment === 'string' ? body.treatment.trim() : '';

    if (!imageUrl || !treatment) {
      return NextResponse.json(
        { ok: false, error: 'Falta imageUrl o treatment' },
        { status: 400 },
      );
    }

    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'Falta configurar REPLICATE_API_TOKEN en el servidor' },
        { status: 500 },
      );
    }

    const prompt = buildPrompt(treatment);

    // En produccion, imageUrl debe ser una URL publica de Cloudinary o similar.
    const replicateResponse = await fetch(REPLICATE_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'wait',
      },
      body: JSON.stringify({
        input: {
          prompt,
          input_image: imageUrl,
          aspect_ratio: 'match_input_image',
          output_format: 'jpg',
          safety_tolerance: 2,
          prompt_upsampling: false,
        },
      }),
    });

    let prediction = await parseReplicateResponse(replicateResponse);

    if (!replicateResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: replicateErrorMessage(prediction, 'Replicate rechazo la solicitud'),
        },
        { status: 502 },
      );
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      return NextResponse.json(
        {
          ok: false,
          error: replicateErrorMessage(prediction, 'La simulacion de IA no pudo completarse'),
        },
        { status: 502 },
      );
    }

    let resultImageUrl = extractResultImageUrl(prediction.output);

    const pollingUrl = prediction.urls?.get;

    if (!resultImageUrl && pollingUrl) {
      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
        await sleep(POLL_INTERVAL_MS);
        prediction = await fetchPrediction(pollingUrl, token);

        if (prediction.status === 'succeeded') {
          resultImageUrl = extractResultImageUrl(prediction.output);
          break;
        }

        if (prediction.status === 'failed' || prediction.status === 'canceled') {
          return NextResponse.json(
            {
              ok: false,
              error: replicateErrorMessage(
                prediction,
                'La simulacion de IA no pudo completarse',
              ),
            },
            { status: 502 },
          );
        }
      }
    }

    if (!resultImageUrl) {
      return NextResponse.json(
        {
          ok: false,
          error: 'La IA tardo demasiado en generar la imagen. Intentalo nuevamente.',
        },
        { status: 504 },
      );
    }

    return NextResponse.json({
      ok: true,
      originalImageUrl: imageUrl,
      resultImageUrl,
      treatment,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error inesperado al procesar la simulacion';

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
