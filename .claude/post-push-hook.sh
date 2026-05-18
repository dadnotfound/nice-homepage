#!/bin/bash

# Post-push hook - 推送后处理
# 用法：在 git push 后自动执行

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

log_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

# 获取最新提交信息
get_latest_commit() {
    git log -1 --pretty=format:"%h - %s" HEAD
}

# 打开 GitHub 页面
open_github() {
    local repo_url=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ -n "$repo_url" ]]; then
        # 提取 GitHub URL
        local github_url=$(echo "$repo_url" | sed -E 's/.*github\.com[:/]([^\/]+\/[^\/]+).*/https:\/\/github.com\/\1/')
        if [[ -n "$github_url" ]]; then
            log_info "打开 GitHub: $github_url"
            # 在不同系统中打开
            case "$(uname)" in
                Darwin) open "$github_url" ;;
                Linux) xdg-open "$github_url" ;;
                CYGWIN*|MINGW*|MSYS*) start "$github_url" ;;
            esac
        fi
    fi
}

# 发送桌面通知
send_notification() {
    # 检查 notify-send 命令是否存在
    if command -v notify-send &> /dev/null; then
        local commit_msg=$(get_latest_commit)
        notify-send "推送成功！" "$commit_msg" -i "terminal"
    fi
}

# 主函数
main() {
    log_info "=== Post-push Hook ==="
    log_success "🎉 代码推送成功！"

    # 显示最新提交
    log_info "最新提交：$(get_latest_commit)"

    # 执行各种动作
    send_notification
    open_github

    log_success "所有 post-push 动作已完成"
}

main "$@"