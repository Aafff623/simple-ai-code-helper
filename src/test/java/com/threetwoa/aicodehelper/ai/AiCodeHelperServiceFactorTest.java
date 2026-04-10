package com.threetwoa.aicodehelper.ai;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * @Auther: threetwoa
 * @Date: 2026-04-10 - 04 - 10 - 21:16
 * @Description: com.threetwoa.aicodehelper.ai
 * @version: 1.0
 */
@SpringBootTest
class AiCodeHelperServiceFactorTest {

    @Resource
    private AiCodeHelperService aiCodeHelperService;

    /**
     * 测试会话记忆
     */
    @Test
    void chatWithMemory() {
        String result = aiCodeHelperService.chat("hi, 你是谁? 我是threetwoa");
        System.out.println(result);
        result = aiCodeHelperService.chat("hi, 我是谁来着?");
        System.out.println(result);
    }

}