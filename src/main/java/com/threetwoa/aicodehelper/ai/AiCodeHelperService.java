package com.threetwoa.aicodehelper.ai;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.spring.AiService;

/**
 * @Auther: threetwoa
 * @Date: 2026-04-10 - 04 - 10 - 20:56
 * @Description: com.threetwoa.aicodehelper.ai
 * @version: 1.0
 */
// @AiService
public interface AiCodeHelperService {

    @SystemMessage(fromResource = "system-prompt.txt")
    String chat(String userMessage);

}
