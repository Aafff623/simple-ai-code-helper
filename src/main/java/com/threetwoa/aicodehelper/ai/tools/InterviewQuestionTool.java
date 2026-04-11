package com.threetwoa.aicodehelper.ai.tools;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class InterviewQuestionTool {

    /**
     * 从公开搜索页获取关键词相关的面试题链接（用于 tool calling 演练）
     *
     * @param keyword 搜索关键词（如"redis"、"java多线程"）
     * @return 面试题列表，若失败则返回错误信息
     */
    @Tool(name = "interviewQuestionSearch", value = """
            Retrieves relevant interview-question resources from public web search results based on a keyword.
             Use this tool when the user asks for interview questions about specific technologies,
             programming concepts, or job-related topics. The input should be a clear search term.
             """
    )
    public String searchInterviewQuestions(@P(value = "the keyword to search") String keyword) {
        List<String> questions = new ArrayList<>();
        // 使用 DuckDuckGo 的 HTML 搜索页，公开可访问且不依赖登录状态
        String encodedKeyword = URLEncoder.encode(keyword + " 面试题", StandardCharsets.UTF_8);
        String url = "https://duckduckgo.com/html/?q=" + encodedKeyword;
        // 发送请求并解析页面
        Document doc;
        try {
            doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0")
                    .timeout(5000)
                    .get();
        } catch (IOException e) {
            log.error("search web error", e);
            return "暂时无法获取面试题，请稍后重试";
        }
        // 提取搜索结果标题与链接
        Elements questionElements = doc.select("a.result__a");
        questionElements.stream()
                .limit(10)
                .forEach(el -> questions.add(el.text().trim() + " - " + el.absUrl("href")));

        if (questions.isEmpty()) {
            return "未找到相关面试题，请尝试更具体的关键词";
        }
        return String.join("\n", questions);
    }
}
