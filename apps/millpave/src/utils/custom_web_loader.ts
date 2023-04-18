import { Sku } from '@prisma/client';
import type { CheerioAPI, load as LoadT } from 'cheerio';
import { Document } from 'langchain/document';
import { BaseDocumentLoader } from 'langchain/document_loaders';
import type { DocumentLoader } from 'langchain/document_loaders';
import { formatPrice } from './format';
import { extractDetail } from './product';
import { PaverDetails } from '../types/product';

export class CustomWebLoader
	extends BaseDocumentLoader
	implements DocumentLoader
{
	constructor(public webPath: string) {
		super();
	}

	static async _scrape(url: string): Promise<CheerioAPI> {
		const { load } = await CustomWebLoader.imports();

		const response = await fetch(url);
		const html = await response.text();

		return load(html);
	}

	async scrape(): Promise<CheerioAPI> {
		return CustomWebLoader._scrape(this.webPath);
	}

	async load(): Promise<Document[]> {
		const $ = await this.scrape();

		$('*:not(span), span.block').each(function () {
			$(this).prepend(' ');
			$(this).append(' ');
		});

		const title = $('h1').text().replace(/\s+/g, ' ').trim();

		const content = $('#__next')
			.clone()
			.find('header, footer, del, [data-ai-hidden="true"]')
			.remove()
			.end()
			.text();

		const data = JSON.parse($('#__NEXT_DATA__').text()) as {
			props: {
				pageProps: {
					trpcState: {
						json: {
							queries: {
								state: { data: { skus: Sku[]; productDetails: PaverDetails } };
							}[];
						};
					};
				};
			};
		};

		let skuString = '';

		const skus =
			data.props.pageProps?.trpcState.json.queries[0]?.state.data.skus;
		const productDetails =
			data.props.pageProps?.trpcState.json.queries[0]?.state.data
				.productDetails;

		if (skus && productDetails) {
			for (const sku of skus) {
				skuString += ` ${sku.displayName}: JMD $${sku.price} per ${
					sku.unit
				} and ${formatPrice(
					sku.price / extractDetail(productDetails, 'pcs_per_sqft')
				)}. `;
			}
		}

		const cleanedContent = (content + skuString).replace(/\s+/g, ' ').trim();

		const contentLength = cleanedContent?.match(/\b\w+\b/g)?.length ?? 0;

		const metadata = { source: this.webPath, title, contentLength };

		return [new Document({ pageContent: cleanedContent, metadata })];
	}

	static async imports(): Promise<{
		load: typeof LoadT;
	}> {
		try {
			const { load } = await import('cheerio');
			return { load };
		} catch (e) {
			console.error(e);
			throw new Error(
				'Please install cheerio as a dependency with, e.g. `pnpm add cheerio`'
			);
		}
	}
}
