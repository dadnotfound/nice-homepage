@echo off
rem 自动测试和推送脚本 (Windows 版本)
rem 用法: auto-test-and-push.bat

setlocal enabledelayedexpansion

rem 颜色定义 (ANSI颜色代码)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

set "PROJECT_ROOT=%~dp0"

:log_info
echo %BLUE%[INFO]%NC% %~1
goto :eof

:log_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:log_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:log_error
echo %RED%[ERROR]%NC% %~1
goto :eof

:check_changes
call :log_info "检查代码变更..."

git diff --quiet >nul 2>&1
if !errorlevel! neq 0 (
    call :log_info "检测到未提交的变更"
    git diff --name-only
    exit /b 0
) else (
    call :log_warning "没有检测到未提交的变更"
    exit /b 1
)
goto :eof

:run_tests
call :log_info "运行快速测试..."

rem 测试 1: 检查关键文件是否存在
set "critical_files=src/index.html CLAUDE.md docs/CHANGELOG.md src/README.md"

for %%f in (%critical_files%) do (
    if exist "%%f" (
        call :log_success "✓ %%f 存在"
    ) else (
        call :log_error "✗ %%f 缺失"
        exit /b 1
    )
)

rem 测试 2: 检查 Git 状态
git status --porcelain | findstr "^.M" >nul
if !errorlevel! equ 0 (
    call :log_success "✓ 有修改的文件需要提交"
)

exit /b 0
goto :eof

:get_today_date
for /f "tokens=1" %%d in ('date /t') do set "today=%%d"
set "today=%today:/=-%"
echo %today%
goto :eof

:auto_commit
call :log_info "准备自动提交..."

rem 获取今天的日期
call :get_today_date >nul
set /p "today=" <nul

rem 检查 CHANGELOG 是否需要更新
findstr /c:"%today%" docs/CHANGELOG.md >nul
if !errorlevel! neq 0 (
    call :log_info "更新 CHANGELOG.md..."
    echo. >> docs/CHANGELOG.md
    echo ## [未发布] - %today% >> docs/CHANGELOG.md
    echo. >> docs/CHANGELOG.md
    echo - 自动提交的代码变更 >> docs/CHANGELOG.md
)

rem 添加所有文件
git add .

rem 生成提交信息
set "commit_file=%temp%\commit_msg.txt"
echo chore: 自动提交代码变更 > "%commit_file%"
echo. >> "%commit_file%"
echo - 自动检测并提交代码修改 >> "%commit_file%"
echo - 更新变更记录 >> "%commit_file%"
echo - 时间戳: %date% %time% >> "%commit_file%"
echo. >> "%commit_file%"
echo Co-Authored-By: 自动化系统 ^<auto@loop^> >> "%commit_file%"

rem 提交
git commit -F "%commit_file%"
call :log_success "代码已提交"

del "%commit_file%" >nul 2>&1
goto :eof

:auto_push
call :log_info "推送到 GitHub..."

git remote -v | findstr "origin" >nul
if !errorlevel! equ 0 (
    git push origin main
    if !errorlevel! equ 0 (
        call :log_success "✅ 已推送到 GitHub"
        exit /b 0
    ) else (
        call :log_error "❌ 推送到 GitHub 失败"
        exit /b 1
    )
) else (
    call :log_error "❌ 未配置远程仓库"
    exit /b 1
)
goto :eof

:main
call :log_info "=== 自动测试和推送流程 ==="

rem 检查是否有变更
call :check_changes
if !errorlevel! equ 1 (
    call :log_info "没有变更需要处理"
    exit /b 0
)

rem 运行测试
call :run_tests
if !errorlevel! equ 0 (
    call :log_success "所有测试通过"
) else (
    call :log_error "测试失败"
    exit /b 1
)

rem 提交变更
call :auto_commit

rem 推送到 GitHub
call :auto_push
if !errorlevel! equ 0 (
    call :log_success "🎉 自动化流程完成！"
    echo.
    call :log_info "最近的提交："
    git log --oneline -3
) else (
    call :log_error "自动推送失败，请手动处理"
    exit /b 1
)

exit /b 0