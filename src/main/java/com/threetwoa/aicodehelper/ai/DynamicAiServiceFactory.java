package com.threetwoa.aicodehelper.ai;

import com.threetwoa.aicodehelper.ai.tools.InterviewQuestionTool;
import dev.langchain4j.mcp.McpToolProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.chat.listener.ChatModelListener;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 按前端传入的模型配置（BYOK）动态构建 AiCodeHelperService。
 * <p>
 * 复用容器里的单例 contentRetriever / mcpToolProvider / chatModelListener，
 * 只替换对话模型（OpenAI 兼容）。相同配置的实例会被缓存，避免重复创建。
 * <p>
 * 安全提示：baseUrl 由客户端传入，存在 SSRF 风险，仅适用于本地单人使用，
 * 请勿将该后端暴露到公网。
 */
@Component
public class DynamicAiServiceFactory {

    @Resource
    private ContentRetriever contentRetriever;
    @Resource
    private McpToolProvider mcpToolProvider;
    @Resource
    private ChatModelListener chatModelListener;

    private final Map<String, AiCodeHelperService> cache = new ConcurrentHashMap<>();

    /**
     * 是否提供了可用的模型覆盖配置（apiKey 与 model 至少要有 apiKey）。
     */
    public boolean hasOverride(String apiKey, String baseUrl, String model) {
        return StringUtils.hasText(apiKey);
    }

    /**
     * 获取（或构建并缓存）指定模型配置对应的 AiCodeHelperService。
     *
     * @param apiKey  必填，覆盖模型的 API Key
     * @param baseUrl 可选，OpenAI 兼容网关地址，缺省 https://api.deepseek.com
     * @param model   可选，模型名，缺省 deepseek-v4-flash
     */
    public AiCodeHelperService get(String apiKey, String baseUrl, String model) {
        String resolvedBaseUrl = StringUtils.hasText(baseUrl) ? baseUrl.trim() : "https://api.deepseek.com";
        String resolvedModel = StringUtils.hasText(model) ? model.trim() : "deepseek-v4-flash";
        String cacheKey = apiKey + "|" + resolvedBaseUrl + "|" + resolvedModel;

        return cache.computeIfAbsent(cacheKey, k -> build(apiKey.trim(), resolvedBaseUrl, resolvedModel));
    }

    private AiCodeHelperService build(String apiKey, String baseUrl, String model) {
        ChatModel chatModel = OpenAiChatModel.builder()
                .apiKey(apiKey)
                .baseUrl(baseUrl)
                .modelName(model)
                .listeners(List.of(chatModelListener))
                .build();
        StreamingChatModel streamingChatModel = OpenAiStreamingChatModel.builder()
                .apiKey(apiKey)
                .baseUrl(baseUrl)
                .modelName(model)
                .listeners(List.of(chatModelListener))
                .build();

        return AiServices.builder(AiCodeHelperService.class)
                .chatModel(chatModel)
                .streamingChatModel(streamingChatModel)
                .chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(10))
                .contentRetriever(contentRetriever)
                .tools(new InterviewQuestionTool())
                .toolProvider(mcpToolProvider)
                .build();
    }
}
