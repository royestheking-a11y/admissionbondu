export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  resourceType: string;
  bytes?: number;
  format?: string;
  width?: number;
  height?: number;
}

function getConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env missing: set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET");
  }

  return { cloudName, uploadPreset };
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const { cloudName, uploadPreset } = getConfig();

  const resourceType = file.type.startsWith("image/") ? "image" : "raw";
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed (${res.status}): ${text}`);
  }

  const json: any = await res.json();
  return {
    publicId: json.public_id,
    secureUrl: json.secure_url,
    resourceType: json.resource_type,
    bytes: json.bytes,
    format: json.format,
    width: json.width,
    height: json.height,
  };
}

