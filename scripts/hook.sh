#!/bin/bash
# Digital Space - Claude Code Hook 脚本
# 在对话结束后自动更新状态

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 读取对话内容（从 stdin 或环境变量）
CONVERSATION="${CLAUDE_CONVERSATION:-$(cat)}"

if [ -z "$CONVERSATION" ]; then
    echo "No conversation content"
    exit 0
fi

# 调用 Python 脚本更新状态
cd "$PROJECT_DIR"
python3 scripts/update_state.py "$CONVERSATION"

# 可选：自动提交并推送
# if command -v git &> /dev/null; then
#     git add data/state.json
#     git commit -m "chore: update state $(date +%Y-%m-%d)" || true
#     git push || true
# fi

echo "Digital Space state updated"
