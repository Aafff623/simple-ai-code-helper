package com.threetwoa.aicodehelper.ai;

import com.threetwoa.aicodehelper.ai.guardrail.SafeInputGuardrail;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.Result;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.guardrail.InputGuardrails;
import dev.langchain4j.service.spring.AiService;
import reactor.core.publisher.Flux;

import java.lang.invoke.CallSite;
import java.util.List;

/**
 * @Auther: threetwoa
 * @Date: 2026-04-10 - 04 - 10 - 20:56
 * @Description: com.threetwoa.aicodehelper.ai
 * @version: 1.0
 */
// @AiService
@InputGuardrails(SafeInputGuardrail.class) // 使用自定义的输入护轨进行安全检测
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

    // 流式对话输出 (参数注解: 实现用户会话隔离效果)
    @SystemMessage(fromResource = "system-prompt.txt")
    Flux<String> chatStream(@MemoryId int memoryId, @UserMessage String userMessage);

}
