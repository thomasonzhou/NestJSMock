import { Controller, Get, Query } from '@nestjs/common';
import * as cheerio from 'cheerio';
import ky from 'ky';

@Controller('scraper')
export class ScraperController {
    @Get('opengraph')
    async getOpenGraph(@Query('url') url: string) {
        const response = await ky.get(url);
        const $ = cheerio.load(await response.text());
        const metaTags = $('meta[property^="og:"]');
        const data = {}
        metaTags.each((_, tag) => {
            const property = $(tag).attr('property');
            const content = $(tag).attr('content');
            data[property.replace('og', '')] = content;
        });
        return data;
    }
}
