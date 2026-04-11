package com.threetwoa.aicodehelper.ai;

import com.threetwoa.aicodehelper.ai.tools.InterviewQuestionTool;
import dev.langchain4j.mcp.McpToolProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.MemoryId;
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
    private ChatModel myQwenChatModel;
    @Resource
    private ContentRetriever contentRetriever;
    @Resource
    private McpToolProvider mcpToolProvider;
    @Resource
    private StreamingChatModel qwenStreamingChatModel;

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
                .chatModel(myQwenChatModel)
                .streamingChatModel(qwenStreamingChatModel) // 流式输出支持
                .chatMemoryProvider(MemoryId->MessageWindowChatMemory.withMaxMessages(10)) // 每个用户一个独立的会话记忆
                .chatMemory(chatMemory) // 会话记忆
                .contentRetriever(contentRetriever) // RAG 检索增强生成
                .tools(new InterviewQuestionTool())
                .toolProvider(mcpToolProvider) // MCP 工具调用
                .build();
        return aiCodeHelperService;
    }


}
