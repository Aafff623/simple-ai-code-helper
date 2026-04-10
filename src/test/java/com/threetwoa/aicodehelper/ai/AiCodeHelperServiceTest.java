package com.threetwoa.aicodehelper.ai;

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

}