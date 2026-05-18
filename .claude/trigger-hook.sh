#!/bin/bash

# Hook 触发脚本
# 用于手动触发和测试 Hook

set -e

HOOKS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$HOOKS_DIR/.." && pwd)"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 使用说明
show_usage() {
    cat << EOF
Hook 触发脚本

用法:
    $0 <hook_name> [args...]

可用 Hook:
    onFileChange <file_path>     - 触发文件变更 Hook
    onLoopStart                  - 触发 Loop 启动 Hook
    onLoopSuccess               - 触发 Loop 成功 Hook
    onLoopError <error_msg>     - 触发 Loop 失败 Hook
    onBeforeCommit              - 触发提交前 Hook
    onAfterPush                 - 触发推送后 Hook

示例:
    $0 onFileChange src/index.html
    $0 onLoopSuccess
    $0 onBeforeCommit
EOF
}

# 触发 onFileChange Hook
trigger_on_file_change() {
    local file_path="$1"
    if [[ -z "$file_path" ]]; then
        log_error "请指定文件路径"
        exit 1
    fi

    log_info "触发 onFileChange Hook: $file_path"

    # 模拟文件变更
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] 文件变更检测到: $file_path" >> "$PROJECT_ROOT/hook.log"

    # 运行测试
    if [[ -f "$PROJECT_ROOT/auto-test-and-push.sh" ]]; then
        log_info "运行自动测试..."
        "$PROJECT_ROOT/auto-test-and-push.sh"
    fi

    log_success "onFileChange Hook 完成"
}

# 触发 onLoopStart Hook
trigger_on_loop_start() {
    log_info "触发 onLoopStart Hook"

    # 显示启动消息
    echo "🔄 Loop 启动中..." | tee -a "$PROJECT_ROOT/hook.log"

    # 更新状态（如果有）
    if [[ -f "$PROJECT_ROOT/.loop-status" ]]; then
        echo "starting" > "$PROJECT_ROOT/.loop-status"
    fi

    log_success "onLoopStart Hook 完成"
}

# 触发 onLoopSuccess Hook
trigger_on_loop_success() {
    log_info "触发 onLoopSuccess Hook"

    # 显示成功消息
    echo "✅ Loop 测试通过" | tee -a "$PROJECT_ROOT/hook.log"

    # 播放声音（如果有）
    if command -v afplay &> /dev/null; then
        afplay /System/Library/Sounds/Ping.aiff &> /dev/null || true
    fi

    # 更新状态
    if [[ -f "$PROJECT_ROOT/.loop-status" ]]; then
        echo "success" > "$PROJECT_ROOT/.loop-status"
    fi

    log_success "onLoopSuccess Hook 完成"
}

# 触发 onLoopError Hook
trigger_on_loop_error() {
    local error_msg="$1"
    if [[ -z "$error_msg" ]]; then
        error_msg="未知错误"
    fi

    log_info "触发 onLoopError Hook: $error_msg"

    # 显示错误消息
    echo "❌ Loop 测试失败: $error_msg" | tee -a "$PROJECT_ROOT/hook.log"

    # 播放错误声音
    if command -v afplay &> /dev/null; then
        afplay /System/Library/Sounds/Basso.aiff &> /dev/null || true
    fi

    # 更新状态
    if [[ -f "$PROJECT_ROOT/.loop-status" ]]; then
        echo "error" > "$PROJECT_ROOT/.loop-status"
    fi

    log_success "onLoopError Hook 完成"
}

# 触发 onBeforeCommit Hook
trigger_on_before_commit() {
    log_info "触发 onBeforeCommit Hook"

    # 运行 pre-commit 测试
    if [[ -f "$HOOKS_DIR/pre-commit-hook.sh" ]]; then
        "$HOOKS_DIR/pre-commit-hook.sh" pre-commit
        log_success "Pre-commit 测试通过"
    else
        log_warning "Pre-commit 脚本不存在"
    fi

    log_success "onBeforeCommit Hook 完成"
}

# 触发 onAfterPush Hook
trigger_on_after_push() {
    log_info "触发 onAfterPush Hook"

    # 显示推送成功消息
    echo "🎉 代码已推送到 GitHub" | tee -a "$PROJECT_ROOT/hook.log"

    # 获取最新提交
    if command -v git &> /dev/null; then
        local latest_commit=$(git log -1 --pretty=format:"%h - %s")
        echo "最新提交: $latest_commit" | tee -a "$PROJECT_ROOT/hook.log"

        # 打开 GitHub
        local repo_url=$(git remote get-url origin 2>/dev/null || echo "")
        if [[ -n "$repo_url" ]]; then
            local github_url=$(echo "$repo_url" | sed -E 's/.*github\.com[:/]([^\/]+\/[^\/]+).*/https:\/\/github.com\/\1/')
            log_info "GitHub URL: $github_url"
        fi
    fi

    # 更新状态
    if [[ -f "$PROJECT_ROOT/.loop-status" ]]; then
        echo "pushed" > "$PROJECT_ROOT/.loop-status"
    fi

    log_success "onAfterPush Hook 完成"
}

# 主函数
main() {
    local hook_name="$1"

    if [[ -z "$hook_name" ]]; then
        show_usage
        exit 1
    fi

    case "$hook_name" in
        onFileChange)
            trigger_on_file_change "$2"
            ;;
        onLoopStart)
            trigger_on_loop_start
            ;;
        onLoopSuccess)
            trigger_on_loop_success
            ;;
        onLoopError)
            trigger_on_loop_error "$2"
            ;;
        onBeforeCommit)
            trigger_on_before_commit
            ;;
        onAfterPush)
            trigger_on_after_push
            ;;
        --help|-h)
            show_usage
            ;;
        *)
            log_error "未知的 Hook: $hook_name"
            show_usage
            exit 1
            ;;
    esac
}

main "$@"