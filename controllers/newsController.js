const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');

let newsCache = [];

// 뉴스 데이터를 가져오는 함수
async function fetchNews() {
  try {
    const query = encodeURIComponent("코인빨래");
    const url = `https://search.naver.com/search.naver?where=news&query=${query}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Referer": "https://search.naver.com",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const newsItems = [];

    $('.news_wrap').each((index, element) => {
      const titleElement = $(element).find('.news_tit');
      const imageElement = $(element).find('.thumb.api_get img');
      const excerptElement = $(element).find('.dsc_txt_wrap');

      const title = titleElement.text().trim();
      const link = titleElement.attr('href');
      const image = imageElement.attr('src') || '이미지 없음';
      const excerpt = excerptElement.text().trim();
      newsItems.push({ title, link, image, excerpt });
    });

    newsCache = newsItems; // 최신 뉴스 데이터로 캐시 업데이트
  } catch (error) {
    console.error(error);
  }
}

// 초기 뉴스 데이터 가져오기
fetchNews();

// 12시간마다 뉴스 데이터 갱신
cron.schedule('0 */12 * * *', fetchNews);

// 라우터 설정
router.get('/', (req, res) => {
  try {
    res.render('getNews', { newsItems: newsCache });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while fetching news.');
  }
});

module.exports = router;

