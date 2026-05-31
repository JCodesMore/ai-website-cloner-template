/**
 * Seed data module — used ONLY by instrumentation.ts (startup seeding)
 * and test files. Pages and API routes must use repository functions.
 * @deprecated Do not import from this module in page/route files.
 */
/**
 * yinmaiquan.com Data Layer - Static JSON imports (Next.js native)
 */

import fastProductsJson from '@/data/fastProducts.json';
import companyProductsJson from '@/data/companyProducts.json';
import personProductsJson from '@/data/personProducts.json';
import pledgeProductsJson from '@/data/pledgeProducts.json';
import institutionsJson from '@/data/institutions.json';
import commentsJson from '@/data/comments.json';
import industryArticlesJson from '@/data/industryArticles.json';
import discussionArticlesJson from '@/data/discussionArticles.json';
import opinionArticlesJson from '@/data/opinionArticles.json';
import faqArticlesJson from '@/data/faqArticles.json';
import articleDetailsJson from '@/data/articleDetails.json';
import productDetailsJson from '@/data/productDetails.json';
import institutionDetailsJson from '@/data/institutionDetails.json';
import counselorsJson from '@/data/counselors.json';

import type { Product, Institution, Comment, NewsItem, ArticleDetail, ProductDetail as PDetail, InstitutionDetail, Counselor } from '@/types';

export const fastProducts: Product[] = fastProductsJson as Product[];
export const companyProducts: Product[] = companyProductsJson as Product[];
export const personProducts: Product[] = personProductsJson as Product[];
export const pledgeProducts: Product[] = pledgeProductsJson as Product[];
export const institutions: Institution[] = institutionsJson as Institution[];
export const comments: Comment[] = commentsJson as Comment[];
export const industryArticles: NewsItem[] = industryArticlesJson as NewsItem[];
export const discussionArticles: NewsItem[] = discussionArticlesJson as NewsItem[];
export const opinionArticles: NewsItem[] = opinionArticlesJson as NewsItem[];
export const faqArticles: NewsItem[] = faqArticlesJson as NewsItem[];
export const articleDetails: ArticleDetail[] = articleDetailsJson as ArticleDetail[];
export const productDetails: PDetail[] = (productDetailsJson as any[]).map((d) => ({ ...d, id: Number(d.id) }));
export const institutionDetails: InstitutionDetail[] = institutionDetailsJson as InstitutionDetail[];
export const counselors: Counselor[] = counselorsJson as Counselor[];

export const newsItems: NewsItem[] = industryArticles.slice(0, 4);
export const discussionItems: NewsItem[] = discussionArticles.slice(0, 4);
export const opinionItems: NewsItem[] = opinionArticles.slice(0, 4);
export const faqItems: NewsItem[] = faqArticles.slice(0, 4);
