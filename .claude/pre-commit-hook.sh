#!/bin/bash

# Pre-commit hook - 提交前自动测试
# 用法：在 git commit 前自动运行

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

# 快速测试函数
run_quick_test() {
    log_info "运行 pre-commit 测试..."

    # 检查关键文件
    local files=(
        "src/index.html"
        "CLAUDE.md"
        "docs/CHANGELOG.md"
    )

    for file in "${files[@]}"; do
        if [[ -f "$PROJECT_ROOT/$file" ]]; then
            log_success "✓ $file"
        else
            log_error "✗ $file 缺失"
            return 1
        fi
    done

    # 检查 HTML 语法
    if command -v tidy &> /dev/null; then
        if tidy -q -e "$PROJECT_ROOT/src/index.html" > /dev/null 2>&1; then
            log_success "✓ HTML 语法正确"
        else
            log_error "✗ HTML 语法错误"
            return 1
        fi
    fi

    log_success "Pre-commit 测试通过"
    return 0
}

# 主函数
main() {
    case "${1:-pre-commit}" in
        pre-commit)
            log_info "=== Pre-commit Hook ==="
            if run_quick_test; then
                log_success "可以安全提交"
                exit 0
            else
                log_error "测试失败，请修复后重试"
                exit 1
            fi
            ;;
        *)
            log_error "未知参数: $1"
            exit 1
            ;;
    esac
}

main "$@"