package com.threetwoa.aicodehelper;

import com.threetwoa.aicodehelper.ai.AiCodeHelper;
import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.data.message.TextContent;
import dev.langchain4j.data.message.UserMessage;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AiCodeHelperApplicationTests {

    @Resource
    private AiCodeHelper aiCodeHelper;

    /**
     * 文本输出交互测试
     */
    @Test
    void chat() {
        aiCodeHelper.chat("hi, 我是threetwoa, 告诉我一个通俗的趣味的 spring 的知识");
    }

    /**
     * 多模态 图片测试
     */
    @Test
    void chatWithMessage() {
        UserMessage userMessage = UserMessage.from(
                TextContent.from("描述图片"),
                // 输出 编程导航的 logo 进行测试其多模态能力
                ImageContent.from("https://www.codefather.cn/logo.png")
        );
        aiCodeHelper.chatWithMessage(userMessage);
    }

}
