"use server";

import { CloudinaryFolder } from "@/data/cloudinary-folder";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { slugify } from "@/utils/slugify";

export async function createStoreAction(formData: FormData) {
  const name = formData.get("name") as string;
  const logoFile = formData.get("logo") as File;

  const slug = slugify(name);

  const bytes = await logoFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await uploadToCloudinary(buffer, CloudinaryFolder.STORE);
  if (!result) {
    return {
      success: false,
      message: "Server Side Error",
    };
  }

  await prisma.store.create({
    data: {
      name,
      slug,
      logoUrl: result.secure_url,
    },
  });

  return { success: true, store: { name, logoUrl: result.secure_url } };
}
