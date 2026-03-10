package com.example.hirewave.service;

import com.example.hirewave.dto.VnJobNewsDTO;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.net.URLConnection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class VnJobNewsService {

    private static final String VNE_RSS_NEWS = "https://vnexpress.net/rss/viec-lam.rss";
    private static final String VNE_RSS_TIPS = "https://vnexpress.net/rss/giao-duc.rss";
    private static final String SOURCE = "VnExpress";

    public List<VnJobNewsDTO> fetchVnExpressJobNews() {
        return fetchFromRss(VNE_RSS_NEWS, SOURCE);
    }

    public List<VnJobNewsDTO> fetchVnExpressTips() {
        return fetchFromRss("https://vnexpress.net/rss/giao-duc.rss", "VnExpress");
    }

    private List<VnJobNewsDTO> fetchFromRss(String rssUrl, String source) {
        try {
            URL feedUrl = new URL(rssUrl);
            URLConnection connection = feedUrl.openConnection();
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            SyndFeed feed;
            try (XmlReader reader = new XmlReader(connection)) {
                feed = new SyndFeedInput().build(reader);
            }

            List<VnJobNewsDTO> result = new ArrayList<>();
            SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            for (SyndEntry entry : feed.getEntries()) {
                String title = entry.getTitle();
                String link = entry.getLink();
                String desc = entry.getDescription() != null ? entry.getDescription().getValue() : "";

                String pubDate = "";
                if (entry.getPublishedDate() != null) {
                    pubDate = fmt.format(entry.getPublishedDate());
                }

                result.add(new VnJobNewsDTO(title, desc, link, pubDate, source));
            }

            return result;
        } catch (Exception e) {
            log.error("Cannot read RSS: {}", rssUrl, e);
            return Collections.emptyList();
        }
    }

}