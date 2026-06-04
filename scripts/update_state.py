#!/usr/bin/env python3
"""
Digital Space - 状态更新脚本
根据对话内容分析并更新 state.json
"""

import json
import sys
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
STATE_FILE = PROJECT_ROOT / "data" / "state.json"


def load_state():
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


def analyze_conversation(conversation_text):
    text_lower = conversation_text.lower()

    # 能量值分析
    energy_high = ["完成", "搞定", "成功", "太棒了", "不错", "好", "厉害"]
    energy_low = ["累了", "麻烦", "问题", "报错", "失败", "难", "烦"]

    energy_score = 0.5
    for kw in energy_high:
        if kw in text_lower:
            energy_score += 0.08
    for kw in energy_low:
        if kw in text_lower:
            energy_score -= 0.08
    energy_score = max(0.1, min(1.0, energy_score))

    # 关注领域分析
    focus_areas = []
    area_keywords = {
        "AI": ["ai", "人工智能", "模型", "训练", "机器学习", "claude", "gpt"],
        "CRM": ["crm", "会员", "客户", "营销", "用户运营"],
        "数据分析": ["数据", "分析", "报表", "统计", "指标"],
        "品牌": ["品牌", "市场", "推广", "活动", "传播"],
        "技术": ["代码", "开发", "编程", "bug", "部署", "前端", "后端"],
        "生活": ["休息", "娱乐", "电影", "旅行", "美食"],
        "汉堡王": ["汉堡王", "burger king", "快餐", "餐饮"],
        "会员体系": ["会员", "积分", "等级", "权益", "复购"],
    }

    for area, keywords in area_keywords.items():
        weight = sum(1 for kw in keywords if kw in text_lower)
        if weight > 0:
            focus_areas.append({"name": area, "weight": weight})

    if focus_areas:
        total = sum(a["weight"] for a in focus_areas)
        for area in focus_areas:
            area["weight"] = round(area["weight"] / total, 2)

    # 情绪温度分析
    mood_warm = ["开心", "满意", "好", "棒", "喜欢", "期待", "兴奋"]
    mood_cool = ["不好", "差", "烦", "累", "难", "失望", "焦虑"]

    mood_score = 0.5
    for kw in mood_warm:
        if kw in text_lower:
            mood_score += 0.08
    for kw in mood_cool:
        if kw in text_lower:
            mood_score -= 0.08
    mood_score = max(0.1, min(1.0, mood_score))

    # 思维活跃度
    thinking_intensity = min(1.0, len(conversation_text) / 1500)

    # 工作/生活平衡
    work_kw = ["工作", "项目", "任务", "会议", "报告", "需求", "上线"]
    life_kw = ["休息", "娱乐", "生活", "家人", "朋友", "电影", "旅行"]

    work_count = sum(1 for kw in work_kw if kw in text_lower)
    life_count = sum(1 for kw in life_kw if kw in text_lower)
    total = work_count + life_count

    if total > 0:
        work_ratio = work_count / total
        life_ratio = life_count / total
    else:
        work_ratio = 0.5
        life_ratio = 0.5

    # 提取近期话题（取出现频率高的关键词）
    topics = []
    topic_candidates = [
        "会员体系", "AI自动化", "用户生命周期", "数据驱动",
        "品牌策略", "CRM优化", "用户增长", "内容营销",
        "汉堡王", "入职准备", "行业研究", "竞品分析",
        "前端开发", "部署上线", "代码重构", "技术选型"
    ]
    for topic in topic_candidates:
        if topic in conversation_text:
            topics.append(topic)

    return {
        "energy": {
            "value": round(energy_score, 2),
            "delta": 0,
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
        "topics": topics[:4] if topics else None,
    }


def get_energy_label(value):
    if value >= 0.8: return "充沛"
    elif value >= 0.6: return "充盈"
    elif value >= 0.4: return "平稳"
    elif value >= 0.2: return "低沉"
    else: return "疲惫"


def get_mood_label(temperature):
    if temperature >= 0.8: return "炽热"
    elif temperature >= 0.6: return "温暖"
    elif temperature >= 0.4: return "平和"
    elif temperature >= 0.2: return "冷静"
    else: return "冷峻"


def get_thinking_label(intensity):
    if intensity >= 0.8: return "高度活跃"
    elif intensity >= 0.6: return "活跃"
    elif intensity >= 0.4: return "平稳"
    elif intensity >= 0.2: return "沉静"
    else: return "休憩"


def update_state(new_dimensions):
    state = load_state()

    old_energy = state["dimensions"]["energy"]["value"]
    new_energy = new_dimensions["energy"]["value"]
    new_dimensions["energy"]["delta"] = round(new_energy - old_energy, 2)

    state["dimensions"]["energy"] = new_dimensions["energy"]
    state["dimensions"]["focus"] = new_dimensions["focus"]
    state["dimensions"]["mood"] = new_dimensions["mood"]
    state["dimensions"]["thinking"] = new_dimensions["thinking"]
    state["dimensions"]["balance"] = new_dimensions["balance"]

    if new_dimensions.get("topics"):
        state["recent"]["topics"] = new_dimensions["topics"]

    state["lastUpdated"] = datetime.now().astimezone().isoformat()

    save_state(state)
    return state


def main():
    if len(sys.argv) > 1:
        conversation = " ".join(sys.argv[1:])
    else:
        conversation = sys.stdin.read()

    if not conversation.strip():
        print("No conversation content provided")
        sys.exit(1)

    dimensions = analyze_conversation(conversation)
    state = update_state(dimensions)

    print(f"✓ State updated: {state['lastUpdated']}")
    print(f"  Energy: {state['dimensions']['energy']['label']} ({state['dimensions']['energy']['value']})")
    print(f"  Mood: {state['dimensions']['mood']['label']} ({state['dimensions']['mood']['temperature']})")
    print(f"  Topics: {state['recent']['topics']}")


if __name__ == "__main__":
    main()
