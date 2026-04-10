package com.threetwoa.aicodehelper.ai;

import dev.langchain4j.service.Result;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * @Auther: threetwoa
 * @Date: 2026-04-10 - 04 - 10 - 21:02
 * @Description: com.threetwoa.aicodehelper.ai
 * @version: 1.0
 */
@SpringBootTest
class AiCodeHelperServiceTest {

    @Resource
    private AiCodeHelperService aiCodeHelperService;

    @Test
    void chat() {
        String result = aiCodeHelperService.chat("你好，我是threetwoa");
        System.out.println(result);
    }

    /**
     * 输出 学习报告 json 格式 (根据 Prompt 设计让大模型自动拆分)
     */
    @Test
    void chatForReport() {
        String userMessage = "你好, 我是 threetwoa, 我学习过 java spring, mysql 等, 帮我分析一下我的学习情况, 给我一些建议";
        AiCodeHelperService.Report report = aiCodeHelperService.chatForReport(userMessage);
        System.out.println("学习报告:" + report);
    }

    /**
     * 利用 RAG 检索增强生成输出结果
     */
    @Test
    void chatForRag() {
        String userMessage = "你好, 我是 threetwoa, 我学习过 java spring, mysql,redis等, 准备校招面试了, 但是不知道高频面试题有哪些? ";
        Result<String> result = aiCodeHelperService.chatWithRag(userMessage);
        System.out.println("RAG 检索参考来源" + result.sources());
        System.out.println("RAG 检索增强生成结果:" + result.content());
    }
}