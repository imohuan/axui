# Orca 多子代理任务替换指南

> 本文档的目标读者：需要在任务中使用多个子代理的 agent（协调者）。
>
> 核心结论：**不要使用当前会话内置的子代理工具（如 `spawn_agent`）来编排多个子任务。** 请改用 Orca 的编排模式：一个协调者 + 多个独立 agent 终端，通过 Run / Task / Dispatch 和消息协作。

---

## 0. 开始之前：必须加载 Orca 编排技能

**任何操作之前，第一步必须执行下面的命令，把 Orca 编排的完整技能说明加载到当前会话：**

```bash
orca skills get orchestration
```

这条命令会输出当前版本 Orca 的完整编排指南（Run / Task / Dispatch / worker-start / check 等全部命令和规则）。

**必须遵守：**

- 每次接到需要多子代理/多任务协作的任务，先执行上面的命令，再动手。
- 技能的说明以这条命令的实际输出为准，不要凭记忆或旧文档猜命令。
- 如果命令报错，先确认 `orca` 可执行文件正确（必要时用 `orca status --json` 检查 Orca 是否在运行）。
- 只有在确实加载了这份技能说明之后，才继续下面的步骤。

---

## 1. 替换思路

把"创建子代理、等它回报"换成 Orca 的三件套：

| 原来的子代理模式 | Orca 编排模式 |
| --- | --- |
| 创建子代理（spawn_agent） | 创建 Task（子任务），派 Dispatch（worker） |
| 子代理自己返回结果 | worker 发送 `worker_done` 消息 |
| 靠会话内部机制协作 | 靠 Orca Run / Task / Dispatch 状态和消息协作 |

Orca 明确要求：**不要用非 Orca 的子代理工具做编排**。那些工具不会产生 Orca 的任务/派发记录、不会注入生命周期协议、也没有 `worker_done` 权限和决策门。所以这不是"二选一"，而是必须替换。

---

## 2. 完整流程（协调者视角）

### 第一步：创建总任务空间（Run）

Run 是协调者的命名空间和收件箱，先创建一次：

```bash
orca orchestration run-create --objective "整个任务的目标" --json
```

### 第二步：为每个子任务创建 Task

```bash
orca orchestration task-create --spec "子任务 A 要做什么" --json
orca orchestration task-create --spec "子任务 B 要做什么" --json
```

有依赖关系时：

```bash
orca orchestration task-create --spec "子任务 C（依赖 A 完成）" --deps '["<task_a_id>"]' --json
```

### 第三步：给每个 Task 派一个 worker（agent 终端）

在现有工作区开新的 agent 终端（最常用）：

```bash
orca orchestration worker-start --task <task_a> --worktree current --agent codex --json
orca orchestration worker-start --task <task_b> --worktree current --agent claude --json
```

需要独立工作区时：

```bash
orca orchestration worker-start --task <task_id> --worktree new-top-level --name <名字> --agent codex --setup run --json
```

要点：

- 先创建好 Run 和所有 Task，再启动所有 worker，然后再等待。
- `--agent` 支持 codex、claude、opencode 等已安装的 TUI agent。
- 每个 worker 是独立的 agent 会话（有自己的终端），不再是你的子代理。

### 第四步：协调者等待 worker 完成

```bash
orca orchestration check --wait --types worker_done,escalation,question --timeout-ms 900000 --json
```

收到消息后：

- `worker_done`：某个子任务完成，处理完结果后继续等下一个。
- `question`：worker 有问题，用 `orca orchestration reply --id <msg_id> --body "<回答>" --json` 回答，然后继续等。
- `escalation`：worker 需要协调者介入，先看消息内容再决定。

处理完一批消息后，原子确认并继续等待：

```bash
orca orchestration check --ack <delivery_id> --wait --types worker_done,escalation,question --timeout-ms 900000 --json
```

> 注意：`check --wait` 的超时只是检查点，不是失败。长任务经常要 15-60 分钟，超时后继续滚动等待即可，除非收到 `worker_done` / `escalation`、终端退出，或用户明确要求停止。

---

## 3. worker 的行为（被派发的一方）

worker 收到带编排协议的提示后，完成工作后从自己的终端发送完成消息：

```bash
orca orchestration send --type worker_done --subject "完成" --body "做了什么、发现了什么、还剩下什么" --task-id <task_id> --dispatch-id <dispatch_id> --outcome succeeded --files-modified "path/a" --json
```

失败时：

```bash
orca orchestration send --type worker_done --subject "失败" --body "原因和现状" --task-id <task_id> --dispatch-id <dispatch_id> --outcome failed --json
```

长任务可发送心跳：

```bash
orca orchestration send --type heartbeat --subject "alive" --payload '{"taskId":"<task_id>","dispatchId":"<dispatch_id>","phase":"implementing"}' --json
```

发完 `worker_done` 后结束回合，在 agent 提示符处待命，等待协调者再次派活。

---

## 4. 常用检查命令

```bash
orca orchestration task-list --json          # 查看所有子任务状态
orca orchestration task-list --ready --json  # 查看可以派发的任务
orca orchestration inbox --json              # 查看收件箱消息
orca orchestration dispatch-show --task <task_id> --json  # 查看某个任务的派发情况
orca terminal list --json                    # 查看所有终端（worker）
```

Task 状态：`pending`（等待）、`ready`（可派发）、`dispatched`（已派出）、`completed`（完成）、`failed`（失败）、`blocked`（阻塞）。

---

## 5. 注意事项

- **必须加载技能**：每次执行前先运行 `orca skills get orchestration`，以当前版本输出为准。
- **不要混用**：不要用 `spawn_agent` 之类的内置子代理工具代替 Orca 编排；那样没有 Orca 的任务记录和生命周期协议。
- **区分全权交接**：如果用户只是说"交给另一个 agent / worktree"（handoff），那是全权交接，不是编排，不要创建 Task / Dispatch / 等 worker_done。
- **只等该等的**：heartbeat 和终端活动只说明 worker 还活着，不代表完成；不要因为"还没消息"就停止、关闭或重启 worker。
- **用 `--wait` 代替轮询**：协调者等待时用 `orca orchestration check --wait`，不要用 sleep 轮询。
- **恢复有前提**：worker 失败后的重试，要用 `worker-start --task <task> --retry-of <dispatch_id>` 显式指定位置和 agent，不要自动猜。

---

## 6. 快速示例（完整流程）

假设任务"修复登录页 CSS"拆成两个子任务：

```bash
# 0. 必须先加载技能
orca skills get orchestration

# 1. 创建 Run
orca orchestration run-create --objective "修复登录页 CSS" --json

# 2. 创建子任务
orca orchestration task-create --spec "修复登录按钮样式" --json
orca orchestration task-create --spec "修复表单布局" --json

# 3. 启动两个 worker（同一工作区，两个独立终端）
orca orchestration worker-start --task <task_a> --worktree current --agent codex --json
orca orchestration worker-start --task <task_b> --worktree current --agent claude --json

# 4. 等结果
orca orchestration check --wait --types worker_done,escalation,question --timeout-ms 900000 --json
```

全部 Task 变成 `completed` 后，任务完成。
