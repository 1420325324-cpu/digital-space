#!/usr/bin/env python3
"""
Digital Space - 状态更新脚本
根据对话内容分析并更新 state.json
"""

import json
import sys
from datetime import datetime
from pathlib import Path

# 项目根目录
PROJECT_ROOT = Path(__file__).parent.parent
STATE_FILE = PROJECT_ROOT / "data" / "state.json"


def load_state():
    """加载当前状态"""
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_state(state):
    """保存状态"""
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


def analyze_conversation(conversation_text):
    """
    分析对话内容，提取维度数据
    返回: dict with dimension updates
    """
    # 简单的关键词分析（后续可以接入更复杂的 NLP）
    text_lower = conversation_text.lower()

    # 能量值分析
    energy_keywords_high = ["完成", "搞定", "成功", "太棒了", "不错", "好"]
    energy_keywords_low = ["累了", "麻烦", "问题", "报错", "失败"]

    energy_score = 0.5
    for kw in energy_keywords_high:
        if kw in text_lower:
            energy_score += 0.1
    for kw in energy_keywords_low:
        if kw in text_lower:
            energy_score -= 0.1
    energy_score = max(0.1, min(1.0, energy_score))

    # 关注领域分析
    focus_areas = []
    area_keywords = {
        "AI": ["ai", "人工智能", "模型", "训练", "机器学习"],
        "CRM": ["crm", "会员", "客户", "营销"],
        "数据分析": ["数据", "分析", "报表", "统计"],
        "品牌": ["品牌", "市场", "推广", "活动"],
        "技术": ["代码", "开发", "编程", "bug"],
        "生活": ["休息", "娱乐", "电影", "旅行"],
    }

    for area, keywords in area_keywords.items():
        weight = sum(1 for kw in keywords if kw in text_lower)
        if weight > 0:
            focus_areas.append({"name": area, "weight": weight})

    # 归一化权重
    if focus_areas:
        total = sum(a["weight"] for a in focus_areas)
        for area in focus_areas:
            area["weight"] = round(area["weight"] / total, 2)

    # 情绪温度分析
    mood_warm = ["开心", "满意", "好", "棒", "喜欢"]
    mood_cool = ["不好", "差", "烦", "累", "难"]

    mood_score = 0.5
    for kw in mood_warm:
        if kw in text_lower:
            mood_score += 0.1
    for kw in mood_cool:
        if kw in text_lower:
            mood_score -= 0.1
    mood_score = max(0.1, min(1.0, mood_score))

    # 思维活跃度（基于对话长度和复杂度）
    thinking_intensity = min(1.0, len(conversation_text) / 2000)

    # 工作/生活平衡
    work_keywords = ["工作", "项目", "任务", "会议", "报告"]
    life_keywords = ["休息", "娱乐", "生活", "家人", "朋友"]

    work_count = sum(1 for kw in work_keywords if kw in text_lower)
    life_count = sum(1 for kw in life_keywords if kw in text_lower)
    total = work_count + life_count

    if total > 0:
        work_ratio = work_count / total
        life_ratio = life_count / total
    else:
        work_ratio = 0.5
        life_ratio = 0.5

    return {
        "energy": {
            "value": round(energy_score, 2),
            "delta": 0,  # 需要与上次比较
            "label": get_energy_label(energy_score),
        },
        "focus": {
            "areas": focus_areas if focus_areas else [{"name": "探索", "weight": 1.0}],
        },
        "mood": {
            "temperature": round(mood_score, 2),
            "label": get_mood_label(mood_score),
        },
        "thinking": {
            "intensity": round(thinking_intensity, 2),
            "label": get_thinking_label(thinking_intensity),
        },
        "balance": {
            "work": round(work_ratio, 2),
            "life": round(life_ratio, 2),
        },
    }


def get_energy_label(value):
    """能量值标签"""
    if value >= 0.8:
        return "充沛"
    elif value >= 0.6:
        return "充盈"
    elif value >= 0.4:
        return "平稳"
    elif value >= 0.2:
        return "低沉"
    else:
        return "疲惫"


def get_mood_label(temperature):
    """情绪温度标签"""
    if temperature >= 0.8:
        return "炽热"
    elif temperature >= 0.6:
        return "温暖"
    elif temperature >= 0.4:
        return "平和"
    elif temperature >= 0.2:
        return "冷静"
    else:
        return "冷峻"


def get_thinking_label(intensity):
    """思维活跃度标签"""
    if intensity >= 0.8:
        return "高度活跃"
    elif intensity >= 0.6:
        return "活跃"
    elif intensity >= 0.4:
        return "平稳"
    elif intensity >= 0.2:
        return "沉静"
    else:
        return "休憩"


def update_state(new_dimensions):
    """更新状态"""
    state = load_state()

    # 计算能量变化
    old_energy = state["dimensions"]["energy"]["value"]
    new_energy = new_dimensions["energy"]["value"]
    new_dimensions["energy"]["delta"] = round(new_energy - old_energy, 2)

    # 更新维度
    state["dimensions"] = new_dimensions

    # 更新时间
    state["lastUpdated"] = datetime.now().astimezone().isoformat()

    save_state(state)
    return state


def main():
    """主函数"""
    if len(sys.argv) > 1:
        # 从命令行参数获取对话内容
        conversation = " ".join(sys.argv[1:])
    else:
        # 从 stdin 读取
        conversation = sys.stdin.read()

    if not conversation.strip():
        print("No conversation content provided")
        sys.exit(1)

    # 分析对话
    dimensions = analyze_conversation(conversation)

    # 更新状态
    state = update_state(dimensions)

    print(f"State updated: {state['lastUpdated']}")
    print(f"Energy: {state['dimensions']['energy']['label']} ({state['dimensions']['energy']['value']})")
    print(f"Mood: {state['dimensions']['mood']['label']} ({state['dimensions']['mood']['temperature']})")


if __name__ == "__main__":
    main()
