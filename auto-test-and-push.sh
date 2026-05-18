#!/bin/bash

# 自动测试和推送脚本
# 用法：./auto-test-and-push.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

# 检查是否有变更
check_changes() {
    log_info "检查代码变更..."

    if ! git diff --quiet 2>/dev/null; then
        log_info "检测到未提交的变更"
        git diff --name-only
        return 0
    else
        log_warning "没有检测到未提交的变更"
        return 1
    fi
}

# 快速测试
run_tests() {
    log_info "运行快速测试..."

    # 测试 1: 检查 HTML 语法
    if command -v tidy &> /dev/null; then
        log_info "检查 HTML 语法..."
        if tidy -q -e "$PROJECT_ROOT/src/index.html" > /dev/null 2>&1; then
            log_success "✓ HTML 语法正确"
        else
            log_warning "⚠ HTML 语法有问题"
        fi
    fi

    # 测试 2: 检查关键文件是否存在
    local critical_files=(
        "src/index.html"
        "CLAUDE.md"
        "docs/CHANGELOG.md"
        "src/README.md"
    )

    for file in "${critical_files[@]}"; do
        if [[ -f "$PROJECT_ROOT/$file" ]]; then
            log_success "✓ $file 存在"
        else
            log_error "✗ $file 缺失"
            return 1
        fi
    done

    # 测试 3: 检查 Git 状态
    cd "$PROJECT_ROOT"
    if git status --porcelain | grep -q "^.M"; then
        log_success "✓ 有修改的文件需要提交"
    fi
}

# 获取今天的日期
get_today_date() {
    date +%Y-%m-%d
}

# 自动提交
auto_commit() {
    log_info "准备自动提交..."

    # 获取今天的日期
    today=$(get_today_date)

    # 检查 CHANGELOG 是否需要更新
    if ! grep -q "$today" "$PROJECT_ROOT/docs/CHANGELOG.md" 2>/dev/null; then
        log_info "更新 CHANGELOG.md..."
        echo "" >> "$PROJECT_ROOT/docs/CHANGELOG.md"
        echo "## [未发布] - $today" >> "$PROJECT_ROOT/docs/CHANGELOG.md"
        echo "" >> "$PROJECT_ROOT/docs/CHANGELOG.md"
        echo "- 自动提交的代码变更" >> "$PROJECT_ROOT/docs/CHANGELOG.md"
    fi

    # 添加所有文件
    git add .

    # 生成提交信息
    commit_msg=$(cat <<EOF
chore: 自动提交代码变更

- 自动检测并提交代码修改
- 更新变更记录
- 时间戳: $(date '+%Y-%m-%d %H:%M:%S')

Co-Authored-By: 自动化系统 <auto@loop>
EOF
)

    # 提交
    echo "$commit_msg" | git commit -F -
    log_success "代码已提交"
}

# 推送到 GitHub
auto_push() {
    log_info "推送到 GitHub..."

    if git remote -v | grep -q "origin"; then
        if git push origin main; then
            log_success "✅ 已推送到 GitHub"
            return 0
        else
            log_error "❌ 推送到 GitHub 失败"
            return 1
        fi
    else
        log_error "❌ 未配置远程仓库"
        return 1
    fi
}

# 主函数
main() {
    log_info "=== 自动测试和推送流程 ==="

    cd "$PROJECT_ROOT"

    # 检查是否有变更
    if ! check_changes; then
        log_info "没有变更需要处理"
        exit 0
    fi

    # 运行测试
    if run_tests; then
        log_success "所有测试通过"
    else
        log_error "测试失败"
        exit 1
    fi

    # 提交变更
    auto_commit

    # 推送到 GitHub
    if auto_push; then
        log_success "🎉 自动化流程完成！"
        echo ""
        log_info "最近的提交："
        git log --oneline -3
    else
        log_error "自动推送失败，请手动处理"
        exit 1
    fi
}

# 运行主函数
main "$@"