import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Code,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Spacer,
  Stack,
  Stat,
  Table,
  Text,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

type SectionId =
  | "overview"
  | "stack"
  | "dirs"
  | "modules"
  | "arch"
  | "run"
  | "highlights"
  | "risks";

export default function SimpleAiCodeHelperAnalysis() {
  const theme = useHostTheme();
  const [section, setSection] = useCanvasState<SectionId>("section", "overview");

  return (
    <Stack gap={20} style={{ padding: 20, maxWidth: 960 }}>
      <Stack gap={8}>
        <Row gap={8} align="center" wrap>
          <Pill active>架构评审</Pill>
          <Pill>只读分析 · 未改业务代码</Pill>
          <Pill>2026-08-04</Pill>
        </Row>
        <H1>simple-ai-code-helper 深度分析</H1>
        <Text tone="secondary">
          基于 Spring Boot + LangChain4j 的 AI 编程面试助手；前端为 Vite 原生
          JS 对话壳，后端提供 SSE 流式对话、RAG、MCP、Tool Calling、会话记忆与输入护轨。
        </Text>
      </Stack>

      <Row gap={6} wrap>
        <Pill active={section === "overview"} onClick={() => setSection("overview")}>
          概览
        </Pill>
        <Pill active={section === "stack"} onClick={() => setSection("stack")}>
          技术栈
        </Pill>
        <Pill active={section === "dirs"} onClick={() => setSection("dirs")}>
          目录
        </Pill>
        <Pill active={section === "modules"} onClick={() => setSection("modules")}>
          核心模块
        </Pill>
        <Pill active={section === "arch"} onClick={() => setSection("arch")}>
          架构
        </Pill>
        <Pill active={section === "run"} onClick={() => setSection("run")}>
          如何运行
        </Pill>
        <Pill active={section === "highlights"} onClick={() => setSection("highlights")}>
          亮点
        </Pill>
        <Pill active={section === "risks"} onClick={() => setSection("risks")}>
          风险/改进
        </Pill>
      </Row>

      <Divider />

      {section === "overview" && <Overview theme={theme} />}
      {section === "stack" && <TechStack />}
      {section === "dirs" && <Directory />}
      {section === "modules" && <CoreModules />}
      {section === "arch" && <Architecture theme={theme} />}
      {section === "run" && <HowToRun />}
      {section === "highlights" && <Highlights />}
      {section === "risks" && <Risks />}
    </Stack>
  );
}

function Overview({
  theme,
}: {
  theme: ReturnType<typeof useHostTheme>;
}) {
  return (
    <Stack gap={16}>
      <Grid columns={4} gap={12}>
        <Stat value="面试助手" label="产品定位" />
        <Stat value="SSE" label="对话协议" />
        <Stat value="3 份 MD" label="RAG 知识库" />
        <Stat value="BYOK" label="前端模型覆盖" />
      </Grid>

      <Callout tone="info" title="一句话结论">
        这是一个偏教学/示例完整度的 LangChain4j 全链路后端，外加一个可用的终端美学前端壳；对话主链路已切到
        DeepSeek（OpenAI 兼容），Qwen/DashScope 主要服务 Embedding。README / CONTEXT
        已在 project-init Full（`chore/maintain-assets`）对齐：非纯后端、默认对话非 Qwen。
      </Callout>

      <Grid columns={2} gap={12}>
        <Card>
          <CardHeader>业务边界</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>聚焦四个方向：</Text>
              <Text>1. 编程学习路线</Text>
              <Text>2. 项目学习建议</Text>
              <Text>3. 求职全流程（简历/投递）</Text>
              <Text>4. 高频面试题与技巧</Text>
              <Text tone="secondary" size="small">
                人设由 <Code>system-prompt.txt</Code> 注入；演示类{" "}
                <Code>AiCodeHelper</Code> 内另有硬编码副本。
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>对外能力</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>
                唯一生产入口：<Code>GET /ai/chat</Code>
              </Text>
              <Text>
                参数：<Code>memoryId</Code> + <Code>message</Code>
              </Text>
              <Text>
                可选头：<Code>X-Model-Api-Key / Base-Url / Name</Code>
              </Text>
              <Text tone="secondary" size="small">
                返回 <Code>text/event-stream</Code>，前端用 fetch + ReadableStream
                解析 SSE。
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Card variant="borderless">
        <CardBody
          style={{
            background: theme.fill.tertiary,
            borderRadius: 8,
            padding: 14,
          }}
        >
          <Text size="small" tone="secondary">
            分析范围：<Code>D:\OneDrive\Desktop\project\simple-ai-code-helper</Code>{" "}
            （含 frontend）；未改动业务代码。
          </Text>
        </CardBody>
      </Card>
    </Stack>
  );
}

function TechStack() {
  return (
    <Stack gap={16}>
      <H2>技术栈</H2>
      <Table
        headers={["层", "选型", "版本/说明"]}
        rows={[
          ["运行时", "JDK", "21"],
          ["后端框架", "Spring Boot Web", "3.5.13"],
          ["AI 框架", "LangChain4j (+ spring / reactor / mcp / dashscope / open-ai)", "1.1.0 / 1.1.0-beta7"],
          ["对话模型", "DeepSeek（OpenAI 兼容）", "deepseek-v4-flash 默认"],
          ["向量模型", "DashScope Qwen Embedding", "starter 自动配置"],
          ["网页解析", "Jsoup", "1.20.1"],
          ["构建", "Maven Wrapper", "mvnw / mvnw.cmd"],
          ["前端构建", "Vite", "^6.3.5"],
          ["前端运行时", "原生 JS（无 React/Vue）", "app.js ~494 行"],
          ["图标", "Tabler Icons（本地 CSS）", "frontend/assets/icons"],
        ]}
        striped
        stickyHeader
      />
      <H3>密钥与配置</H3>
      <Table
        headers={["配置项", "用途", "存放"]}
        rows={[
          ["deepseek.*", "流式/同步对话", "application-local.yml"],
          ["langchain4j.community.dashscope.*", "Embedding / 遗留 Qwen Chat Bean", "application-local.yml"],
          ["bigmodel.api-key", "智谱 Web Search MCP", "application-local.yml"],
        ]}
        rowTone={["info", "neutral", "warning"]}
      />
      <Text tone="secondary" size="small">
        Source: pom.xml · application.yml · frontend/package.json · 源码扫读
      </Text>
    </Stack>
  );
}

function Directory() {
  return (
    <Stack gap={16}>
      <H2>目录结构（关键路径）</H2>
      <Grid columns={2} gap={12}>
        <Card>
          <CardHeader>后端</CardHeader>
          <CardBody>
            <Stack gap={4}>
              <Text size="small">
                <Code>src/main/java/.../AiCodeHelperApplication.java</Code>
              </Text>
              <Text size="small">
                <Code>ai/controller/AiController.java</Code>
              </Text>
              <Text size="small">
                <Code>ai/AiCodeHelperService.java</Code>
              </Text>
              <Text size="small">
                <Code>ai/AiCodeHelperServiceFactor.java</Code>
              </Text>
              <Text size="small">
                <Code>ai/DynamicAiServiceFactory.java</Code>
              </Text>
              <Text size="small">
                <Code>ai/model/DeepSeekChatModelConfig.java</Code>
              </Text>
              <Text size="small">
                <Code>ai/model/QwenChatModelConfig.java</Code>
              </Text>
              <Text size="small">
                <Code>ai/rag/RagConfig.java</Code>
              </Text>
              <Text size="small">
                <Code>ai/mcp/McpConfig.java</Code>
              </Text>
              <Text size="small">
                <Code>ai/tools/InterviewQuestionTool.java</Code>
              </Text>
              <Text size="small">
                <Code>ai/guardrail/SafeInputGuardrail.java</Code>
              </Text>
              <Text size="small">
                <Code>resources/docs/*.md</Code> · RAG 语料
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>前端 & 文档</CardHeader>
          <CardBody>
            <Stack gap={4}>
              <Text size="small">
                <Code>frontend/index.html</Code> · 壳与模板
              </Text>
              <Text size="small">
                <Code>frontend/app.js</Code> · 会话 / SSE / BYOK
              </Text>
              <Text size="small">
                <Code>frontend/styles.css</Code> · 新粗野主义终端风
              </Text>
              <Text size="small">
                <Code>frontend/vite.config.js</Code> · 端口 5173
              </Text>
              <Text size="small">
                <Code>README.md</Code> · DeepSeek + frontend + Showcase
              </Text>
              <Text size="small">
                <Code>CONTEXT.md</Code> · 领域术语表
              </Text>
              <Text size="small">
                <Code>docs/</Code> · agents / PRD / ADR
              </Text>
              <Text size="small">
                <Code>AGENTS.md</Code> · <Code>CLAUDE.md</Code>
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>
      <Callout tone="info" title="文档同步状态">
        project-init Full 后：README / CONTEXT 已写明 Vite 前端与 DeepSeek 主对话；Preview
        Gallery 省略、Showcase 三连已引用。本 Canvas 仍为只读架构评审（未改业务代码）。
      </Callout>
    </Stack>
  );
}

function CoreModules() {
  return (
    <Stack gap={16}>
      <H2>核心模块</H2>
      <Table
        headers={["模块", "职责", "关键类"]}
        rows={[
          ["API 入口", "SSE 流式对话；按 Header 切换默认/动态模型", "AiController"],
          ["AiService 接口", "声明系统提示、护轨、chat/report/RAG/stream", "AiCodeHelperService"],
          ["默认工厂", "装配 DeepSeek + Memory + RAG + Tool + MCP", "AiCodeHelperServiceFactor"],
          ["动态工厂", "BYOK：按 apiKey/baseUrl/model 缓存 AiService", "DynamicAiServiceFactory"],
          ["DeepSeek 配置", "OpenAI 兼容同步/流式 ChatModel Bean", "DeepSeekChatModelConfig"],
          ["Qwen 配置", "遗留 myQwenChatModel（监听器示例）", "QwenChatModelConfig"],
          ["RAG", "加载 docs → 切段 → 向量化 → Top5/score≥0.75", "RagConfig"],
          ["MCP", "智谱 web_search SSE 工具提供者", "McpConfig"],
          ["本地工具", "Jsoup 爬 DuckDuckGo 面试题链接", "InterviewQuestionTool"],
          ["护轨", "敏感词 kill/evil 拦截", "SafeInputGuardrail"],
          ["监听", "请求/响应/错误日志", "ChatModelListenerConfig"],
          ["CORS", "全路径跨域，供 Vite 联调", "CorsConfig"],
          ["演示 Service", "直接调 qwenChatModel，非 Controller 主路径", "AiCodeHelper"],
          ["前端壳", "会话列表、SSE、主题、模型配置弹窗", "frontend/app.js"],
        ]}
        striped
        stickyHeader
      />
      <H3>前端能力细节</H3>
      <Grid columns={2} gap={12}>
        <Card>
          <CardHeader trailing={<Pill tone="info" size="sm">持久化</Pill>}>
            localStorage
          </CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text size="small">
                <Code>ai-helper-settings</Code>：后端地址 / 服务商 / 模型 / Key
              </Text>
              <Text size="small">
                <Code>ai-helper-conversations</Code>：仅元数据（id/title/time）
              </Text>
              <Text tone="secondary" size="small">
                消息正文未落盘；刷新后侧栏有会话名，内容需重新聊。
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader trailing={<Pill tone="success" size="sm">BYOK</Pill>}>
            内置服务商
          </CardHeader>
          <CardBody>
            <Text size="small">
              DeepSeek · 通义千问 · 智谱 · Moonshot · OpenAI · 硅基流动（均为
              OpenAI 兼容网关预设）。
            </Text>
          </CardBody>
        </Card>
      </Grid>
    </Stack>
  );
}

function Architecture({
  theme,
}: {
  theme: ReturnType<typeof useHostTheme>;
}) {
  return (
    <Stack gap={16}>
      <H2>架构与请求链路</H2>
      <Card>
        <CardHeader>主链路（流式对话）</CardHeader>
        <CardBody>
          <Stack gap={6}>
            <Text size="small">
              浏览器 Vite:5173 → <Code>fetch GET /ai/chat</Code>（可选 BYOK Headers）
            </Text>
            <Text size="small">
              → <Code>AiController</Code> 判断 hasOverride(apiKey)
            </Text>
            <Text size="small">
              → 默认 <Code>aiCodeHelperService</Code> 或{" "}
              <Code>DynamicAiServiceFactory.get(...)</Code>
            </Text>
            <Text size="small">
              → LangChain4j AiService：System Prompt → Input Guardrail → Memory → RAG
              Retriever → Tools / MCP → StreamingChatModel
            </Text>
            <Text size="small">
              → Reactor <Code>Flux&lt;ServerSentEvent&lt;String&gt;&gt;</Code> → 前端逐块渲染
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Grid columns={3} gap={12}>
        <Card>
          <CardHeader>对话层</CardHeader>
          <CardBody>
            <Text size="small">
              DeepSeek Streaming / Chat；BYOK 时动态 OpenAi*ChatModel，缓存于
              ConcurrentHashMap。
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>增强层</CardHeader>
          <CardBody>
            <Text size="small">
              内存 EmbeddingStore + Qwen Embedding；段落切分 1000/200；检索
              maxResults=5, minScore=0.75。
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>工具层</CardHeader>
          <CardBody>
            <Text size="small">
              InterviewQuestionTool（爬虫）+ 智谱 MCP web_search；模型自主决定是否调用。
            </Text>
          </CardBody>
        </Card>
      </Grid>

      <Callout tone="neutral" title="双路径注意">
        <Code>AiCodeHelperService</Code>（工厂装配，Controller 使用）与{" "}
        <Code>AiCodeHelper</Code>（直接 ChatModel 演示）并存；另有{" "}
        <Code>myQwenChatModel</Code> vs starter <Code>qwenChatModel</Code>。讨论「用哪个模型」时需指明 Bean。
      </Callout>

      <div
        style={{
          padding: 12,
          borderRadius: 8,
          border: `1px solid ${theme.stroke.secondary}`,
          fontFamily: "ui-monospace, monospace",
          fontSize: 12,
          color: theme.text.secondary,
          whiteSpace: "pre-wrap",
          lineHeight: 1.5,
        }}
      >
        {`Frontend (Vite)
  │  GET /ai/chat?memoryId&message
  │  Headers: X-Model-* (optional BYOK)
  ▼
AiController
  ├─ default → AiCodeHelperServiceFactor bean (DeepSeek)
  └─ override → DynamicAiServiceFactory cache
        │
        ├─ SafeInputGuardrail
        ├─ MessageWindowChatMemory (10)
        ├─ ContentRetriever (RAG / Qwen Embedding)
        ├─ InterviewQuestionTool (Jsoup)
        └─ McpToolProvider (BigModel web_search)
              ▼
        StreamingChatModel → SSE chunks`}
      </div>
    </Stack>
  );
}

function HowToRun() {
  return (
    <Stack gap={16}>
      <H2>如何运行</H2>
      <Grid columns={2} gap={12}>
        <Stat value="8080" label="后端默认端口" />
        <Stat value="5173" label="前端 Vite 端口" />
      </Grid>

      <H3>1. 后端</H3>
      <Stack gap={8}>
        <Text>
          前置：JDK 21+；准备 DashScope（Embedding）、DeepSeek（对话）、智谱 BigModel（MCP）密钥。
        </Text>
        <Text size="small">
          复制{" "}
          <Code>
            src/main/resources/application-local.yml.example
          </Code>{" "}
          → <Code>application-local.yml</Code> 并填真实 Key（已被 gitignore）。
        </Text>
        <Text size="small">
          在项目根目录执行：<Code>mvnw.cmd spring-boot:run</Code>
        </Text>
        <Text tone="secondary" size="small">
          必须从仓库根启动：RagConfig 相对路径{" "}
          <Code>src/main/resources/docs</Code> 加载知识库；启动时重建内存向量库。
        </Text>
        <Text size="small">
          冒烟：{" "}
          <Code>
            curl -N
            "http://localhost:8080/ai/chat?memoryId=1&message=如何准备Java并发面试"
          </Code>
        </Text>
      </Stack>

      <H3>2. 前端</H3>
      <Stack gap={8}>
        <Text size="small">
          <Code>cd frontend && npm install && npm run dev</Code>
        </Text>
        <Text size="small">
          浏览器打开 Vite 地址；设置面板可改后端地址或切换 BYOK 服务商。
        </Text>
        <Text size="small">
          测试：<Code>./mvnw test</Code>（多为需真实密钥的 SpringBootTest 集成测）。
        </Text>
      </Stack>

      <Callout tone="warning" title="打包注意">
        打成可执行 jar 后，文件系统相对路径的 RAG 加载会失效——README 已标注为已知限制。
      </Callout>
    </Stack>
  );
}

function Highlights() {
  return (
    <Stack gap={16}>
      <H2>亮点</H2>
      <Grid columns={2} gap={12}>
        <Card>
          <CardHeader>LangChain4j 能力拼盘完整</CardHeader>
          <CardBody>
            <Text size="small">
              声明式 AiService、流式 Reactor、RAG、Tool、MCP、Memory、Guardrail、Listener
              一条链路打通，适合作为学习样板。
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>对话模型可插拔（BYOK）</CardHeader>
          <CardBody>
            <Text size="small">
              前端内置多家 OpenAI 兼容服务商；后端 DynamicAiServiceFactory
              按配置缓存实例，默认 DeepSeek 与覆盖模型共存。
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>密钥分离规范</CardHeader>
          <CardBody>
            <Text size="small">
              application.yml 占位 + local profile + example 模板 + gitignore，降低密钥进库风险。
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>前端产品完成度</CardHeader>
          <CardBody>
            <Text size="small">
              会话侧栏、快捷 Prompt、SSE 停止/复制、深浅色、模型徽章、移动侧栏与快捷键
              Ctrl/Cmd+K——非占位页。
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>领域文档齐全</CardHeader>
          <CardBody>
            <Text size="small">
              CONTEXT 术语表、agents 协作约定、前端 PRD、README 视觉资产，利于多 Agent
              协作。
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>RAG 语料贴合场景</CardHeader>
          <CardBody>
            <Text size="small">
              Java 面试 / AI 面试 / 简历指南三份 Markdown，切段时注入文件名提升召回可解释性。
            </Text>
          </CardBody>
        </Card>
      </Grid>
    </Stack>
  );
}

function Risks() {
  return (
    <Stack gap={16}>
      <H2>风险与改进建议</H2>
      <Table
        headers={["优先级", "问题", "影响", "建议"]}
        columnAlign={["center", "left", "left", "left"]}
        rows={[
          [
            "P0",
            "memoryId：前端 Date.now() vs 后端 int",
            "毫秒时间戳远超 Integer.MAX，可能导致绑定失败或异常会话",
            "改为 long，或前端用自增小整数 / UUID 映射表",
          ],
          [
            "P0",
            "BYOK baseUrl 无白名单（源码已注明 SSRF）",
            "公网暴露时可被诱导访问内网",
            "限制协议/域名；勿对公网开放；加鉴权",
          ],
          [
            "P1",
            "API Key 经请求头到后端，浏览器存 localStorage",
            "XSS 即丢钥；日志/代理可能泄露",
            "收紧 CSP；日志脱敏；生产改服务端托管密钥",
          ],
          [
            "P1",
            "CORS allowedOriginPatterns=* + credentials",
            "任意源可带凭证跨域调用",
            "收紧为 Vite 开发源与已知前端域",
          ],
          [
            "P1",
            "MCP Key 拼进 SSE URL Query",
            "易进代理/访问日志",
            "改 Header 鉴权（若平台支持）",
          ],
          [
            "P1",
            "RAG 相对路径 + 内存向量库",
            "jar 部署失败；每次冷启动重建成本",
            "classpath 加载；持久化向量库；启动缓存",
          ],
          [
            "P2",
            "护轨仅 kill/evil",
            "安全演示级，难挡真实注入/越狱",
            "扩展词表 + 输出护轨 + 限流",
          ],
          [
            "P2",
            "前端会话消息不持久化",
            "刷新丢对话正文",
            "localStorage/IndexedDB 存消息或后端会话库",
          ],
          [
            "P2",
            "文档层曾与实现漂移（已修）",
            "历史 README「纯后端 / Qwen 对话」误导新人",
            "已在 chore/maintain-assets 对齐；后续改栈须同步 CONTEXT",
          ],
          [
            "P2",
            "集成测试依赖真实密钥与外网",
            "CI 难稳定跑通",
            "Mock ChatModel / 分 profile 跳过联网测",
          ],
          [
            "P3",
            "类名 Factor 拼写、未使用 chatMemory 局部变量",
            "可读性/维护噪音",
            "重命名与清理死代码",
          ],
          [
            "P3",
            "爬虫依赖 DuckDuckGo HTML 选择器",
            "页面变更即工具失效",
            "降级策略或改官方 Search API",
          ],
        ]}
        rowTone={[
          "danger",
          "danger",
          "warning",
          "warning",
          "warning",
          "warning",
          "info",
          "info",
          "info",
          "info",
          "neutral",
          "neutral",
        ]}
        striped
        stickyHeader
      />

      <Callout tone="danger" title="部署边界">
        当前更适合本地单人学习演示。在未做鉴权、SSRF 防护、密钥托管与 CORS
        收紧前，不建议把后端直接暴露到公网。
      </Callout>

      <Row gap={8} align="center">
        <Text tone="secondary" size="small">
          Source: 仓库源码静态审阅 · 2026-08-04
        </Text>
        <Spacer />
        <Pill tone="neutral" size="sm">
          未执行运行时渗透
        </Pill>
      </Row>
    </Stack>
  );
}
