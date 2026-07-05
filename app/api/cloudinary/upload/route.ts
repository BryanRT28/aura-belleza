import crypto from 'crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

function signCloudinaryParams(params: Record<string, string>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return crypto.createHash('sha1').update(`${payload}${apiSecret}`).digest('hex');
}

export async function POST(request: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Falta configurar CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY o CLOUDINARY_API_SECRET',
        },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: 'Falta el archivo de imagen' },
        { status: 400 },
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { ok: false, error: 'El archivo debe ser una imagen' },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, error: 'La imagen no debe superar los 10 MB' },
        { status: 400 },
      );
    }

    const timestamp = Math.round(Date.now() / 1000).toString();
    const uploadParams = {
      folder: 'aura-belleza/simulaciones',
      timestamp,
    };
    const signature = signCloudinaryParams(uploadParams, apiSecret);

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('api_key', apiKey);
    cloudinaryFormData.append('timestamp', timestamp);
    cloudinaryFormData.append('folder', uploadParams.folder);
    cloudinaryFormData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      },
    );

    const data = (await response.json()) as CloudinaryUploadResponse;

    if (!response.ok || !data.secure_url) {
      return NextResponse.json(
        {
          ok: false,
          error: data.error?.message || 'Cloudinary no pudo subir la imagen',
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      imageUrl: data.secure_url,
      publicId: data.public_id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error inesperado al subir la imagen';

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
