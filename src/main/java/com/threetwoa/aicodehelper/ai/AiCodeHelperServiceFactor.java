package com.threetwoa.aicodehelper.ai;

import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @Auther: threetwoa
 * @Date: 2026-04-10 - 04 - 10 - 20:58
 * @Description: com.threetwoa.aicodehelper.ai
 * @version: 1.0
 */
@Configuration
public class AiCodeHelperServiceFactor {

    @Resource
    private ChatModel qwenChatModel;
    @Resource
    private ContentRetriever contentRetriever;

    /**
     * 创建 AI Service 的实现类,  使用 java 反射机制创建代理对象
     * @return
     */
    @Bean
    public AiCodeHelperService aiCodeHelperService(){
        // 会话记忆 (设定最多每个用户支持 10 条)
        MessageWindowChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);
        // 构造 AI Service
        AiCodeHelperService aiCodeHelperService = AiServices.builder(AiCodeHelperService.class)
                .chatModel(qwenChatModel)
                .chatMemory(chatMemory) // 会话记忆
                .contentRetriever(contentRetriever) // RAG 检索增强生成
                .build();
        return aiCodeHelperService;
    }


}
