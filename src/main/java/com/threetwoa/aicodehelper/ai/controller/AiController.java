package com.threetwoa.aicodehelper.ai.controller;

import com.threetwoa.aicodehelper.ai.AiCodeHelperService;
import com.threetwoa.aicodehelper.ai.DynamicAiServiceFactory;
import jakarta.annotation.Resource;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

/**
 * ai 接口调用
 */
@RestController
@RequestMapping("/ai")
public class AiController {

    @Resource
    private AiCodeHelperService aiCodeHelperService;

    @Resource
    private DynamicAiServiceFactory dynamicAiServiceFactory;

    /**
     * 传入 message, 返回流式的消息。
     * <p>
     * 可选请求头（BYOK，前端"模型配置"面板下发）：
     * <ul>
     *   <li>X-Model-Api-Key：覆盖模型的 API Key，提供后本次请求走覆盖模型</li>
     *   <li>X-Model-Base-Url：OpenAI 兼容网关地址，缺省 https://api.deepseek.com</li>
     *   <li>X-Model-Name：模型名，缺省 deepseek-v4-flash</li>
     * </ul>
     * 三者均未提供时，走 application-local.yml 中配置的默认 DeepSeek 模型。
     *
     * @param memoryId 会话的id
     * @param message  会话的消息
     * @return 返回 流式消息
     */
    @GetMapping("/chat")
    public Flux<ServerSentEvent<String>> chat(
            int memoryId,
            String message,
            @RequestHeader(value = "X-Model-Api-Key", required = false) String apiKey,
            @RequestHeader(value = "X-Model-Base-Url", required = false) String baseUrl,
            @RequestHeader(value = "X-Model-Name", required = false) String model) {

        // 有覆盖配置走动态模型，否则用默认 DeepSeek bean
        AiCodeHelperService service = dynamicAiServiceFactory.hasOverride(apiKey, baseUrl, model)
                ? dynamicAiServiceFactory.get(apiKey, baseUrl, model)
                : aiCodeHelperService;

        return service.chatStream(memoryId, message)
                .map(chunk -> ServerSentEvent.<String>builder()
                        .data(chunk)
                        .build());
    }
}
