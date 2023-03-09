import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';


@Controller('scraper')
export class ScraperController {
    @Get('/opengraph')
    async getOpenGraph(@Query('url') url: string) {
        const response = await axios.get(url);
        const $ = cheerio.load(await response.data);
        const metaTags = $('meta[property^="og:"]');
        const data = {}
        metaTags.each((_, tag) => {
            const property = $(tag).attr('property');
            const content = $(tag).attr('content');
            data[property.replace('og:', '').replace(':', '_')] = content;
        });
        return data;
    }
}
