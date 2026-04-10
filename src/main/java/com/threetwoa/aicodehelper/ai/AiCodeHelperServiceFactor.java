package com.threetwoa.aicodehelper.ai;

import dev.langchain4j.model.chat.ChatModel;
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

    /**
     * 创建 AI Service 的实现类,  使用 java 反射机制创建代理对象
     * @return
     */
    @Bean
    public AiCodeHelperService aiCodeHelperService(){
        return AiServices.create(AiCodeHelperService.class, qwenChatModel);
    }


}
