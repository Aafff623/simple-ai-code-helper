package com.threetwoa.aicodehelper.ai.model;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.chat.listener.ChatModelListener;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import jakarta.annotation.Resource;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * DeepSeek 对话模型配置。
 * <p>
 * DeepSeek 提供 OpenAI 兼容 API，因此复用 langchain4j-open-ai 的实现，
 * 只需把 baseUrl 指向 DeepSeek 网关即可。
 * <p>
 * 同时提供流式与非流式两个 bean：
 * - {@code deepSeekStreamingChatModel} 供前端流式对话（AiController /ai/chat）使用
 * - {@code deepSeekChatModel} 供非流式接口（chat / chatForReport / chatWithRag）使用
 */
@Configuration
@ConfigurationProperties(prefix = "deepseek")
@Data
public class DeepSeekChatModelConfig {

    /** DeepSeek API Key，真实值请放入 application-local.yml */
    private String apiKey;

    /** DeepSeek OpenAI 兼容网关地址，如 https://api.deepseek.com */
    private String baseUrl;

    /** 模型名，如 deepseek-v4-flash */
    private String modelName;

    @Resource
    private ChatModelListener chatModelListener;

    @Bean
    public ChatModel deepSeekChatModel() {
        return OpenAiChatModel.builder()
                .apiKey(apiKey)
                .baseUrl(baseUrl)
                .modelName(modelName)
                .listeners(List.of(chatModelListener))
                .build();
    }

    @Bean
    public StreamingChatModel deepSeekStreamingChatModel() {
        return OpenAiStreamingChatModel.builder()
                .apiKey(apiKey)
                .baseUrl(baseUrl)
                .modelName(modelName)
                .listeners(List.of(chatModelListener))
                .build();
    }
}
