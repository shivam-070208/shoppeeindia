export type Deal = {
  id: string;
  name?: string;
  description?: string;
  imageUrl: string;
  originalPrice: number;
  dealPrice: number;
  discountPercent: number;
  affiliateUrl: string;
  expiryDate: string | Date;
  createdAt: string | Date;
  specs?: Record<string, string> | null;
  storeId: string;
  categoryId: string;
  store?: { id: string; name: string; slug: string; logoUrl: string };
  category?: { id: string; name: string; slug: string };
};
