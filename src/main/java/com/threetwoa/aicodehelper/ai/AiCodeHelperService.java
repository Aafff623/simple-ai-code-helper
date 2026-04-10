package com.threetwoa.aicodehelper.ai;

import dev.langchain4j.service.Result;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.spring.AiService;

import java.lang.invoke.CallSite;
import java.util.List;

/**
 * @Auther: threetwoa
 * @Date: 2026-04-10 - 04 - 10 - 20:56
 * @Description: com.threetwoa.aicodehelper.ai
 * @version: 1.0
 */
// @AiService
public interface AiCodeHelperService {

    @SystemMessage(fromResource = "system-prompt.txt")
    String chat(String userMessage);

    @SystemMessage(fromResource = "system-prompt.txt")
    Report chatForReport(String userMessage);

    // 学习报告
    record Report(String name, List<String> suggestionList) {};

    // 返回封装好的 RAG 结果
    @SystemMessage(fromResource = "system-prompt.txt")
    Result<String> chatWithRag(String userMessage);

}
