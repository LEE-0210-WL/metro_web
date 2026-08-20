#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
线路百科 links 批量配置工具
用法: python config_links.py
"""

import os
import re
import glob
import shutil


# ==================== 两种预设配置 ====================

OPERATING_PRESET = [
    {"icon": "📋", "text": "线路仪表盘",   "url": "dashboard",         "param": True,  "show": True},
    {"icon": "📰", "text": "进度跟踪",     "url": "progress-tracking", "param": False, "show": False},
    {"icon": "📊", "text": "客流查询",     "url": "passenger-flow",    "param": True,  "show": True},
    {"icon": "🚇", "text": "车辆信息",     "url": "trains",            "param": False, "show": True},
    {"icon": "🏗️", "text": "建设历程",     "url": "history",           "param": False, "show": False},
    {"icon": "🚻", "text": "卫生间查询",   "url": "toilet",            "param": True,  "show": True},
    {"icon": "🎨", "text": "线路色号",     "url": "line-colors",       "param": False, "show": True},
    {"icon": "📷", "text": "照片",         "url": "photos",            "param": True,  "show": True},
]

CONSTRUCTION_PRESET = [
    {"icon": "📋", "text": "线路仪表盘",   "url": "dashboard",         "param": True,  "show": True},
    {"icon": "📰", "text": "进度跟踪",     "url": "progress-tracking", "param": False, "show": True},
    {"icon": "📊", "text": "客流查询",     "url": "passenger-flow",    "param": True,  "show": False},
    {"icon": "🚇", "text": "车辆信息",     "url": "trains",            "param": False, "show": True},
    {"icon": "🏗️", "text": "建设历程",     "url": "history",           "param": False, "show": False},
    {"icon": "🚻", "text": "卫生间查询",   "url": "toilet",            "param": True,  "show": False},
    {"icon": "🎨", "text": "线路色号",     "url": "line-colors",       "param": False, "show": True},
    {"icon": "📷", "text": "照片",         "url": "photos",            "param": True,  "show": False},
]

BACKUP_SUFFIX = ".links.bak"


def extract_line_id(filename):
    base = os.path.basename(filename)
    m = re.match(r'line ([0-9a-zA-Z]+)\.html', base)
    return m.group(1) if m else None


def find_links_block(lines):
    start = None
    indent = ""
    for i, line in enumerate(lines):
        m = re.match(r'(\s*)const\s+links\s*=\s*\[', line)
        if m:
            start = i
            indent = m.group(1)
            break
    if start is None:
        return None, None, None

    depth = 0
    end = None
    for i in range(start, len(lines)):
        for ch in lines[i]:
            if ch == '[':
                depth += 1
            elif ch == ']':
                depth -= 1
                if depth == 0:
                    end = i
                    break
        if end is not None:
            break
    return start, end, indent


def parse_existing_links(lines, start, end):
    block = "".join(lines[start:end+1])
    result = {}
    pattern = r'^\s*(//)?\s*\{\s*icon:\s*"([^"]+)",\s*text:\s*"([^"]+)",\s*url:\s*`([^`]+)`\s*\}'
    for line in block.split('\n'):
        m = re.match(pattern, line.strip())
        if m:
            commented, icon, text, url = m.groups()
            has_param = "?line=" in url or "${LINE_ID}" in url
            result[text] = {"show": not bool(commented), "param": has_param}
    return result


def ask(entry, current):
    print(f"\n【{entry['icon']} {entry['text']}】  默认url: {entry['url']}")
    
    show_default = "Y" if current.get("show", entry["show"]) else "N"
    show = input(f"  是否显示? [{show_default}/n] > ").strip().lower()
    if show == "":
        show = show_default.lower() == "y"
    else:
        show = show in ("y", "yes", "是")
    
    if not show:
        return {"show": False, "param": current.get("param", entry["param"])}
    
    param_default = "Y" if current.get("param", entry["param"]) else "N"
    param = input(f"  是否加 ?line=${{LINE_ID}} 参数? [{param_default}/n] > ").strip().lower()
    if param == "":
        param = param_default.lower() == "y"
    else:
        param = param in ("y", "yes", "是")
    
    return {"show": True, "param": param}


def generate_block(entries, line_id, indent):
    body = indent + "  "
    lines = [f"{indent}const links = ["]
    for e in entries:
        url = f"{e['url']}?line=${{LINE_ID}}" if e["param"] else e["url"]
        js = f'{{ icon: "{e["icon"]}", text: "{e["text"]}", url: `{url}` }}'
        if e["show"]:
            lines.append(f"{body}{js},")
        else:
            lines.append(f"{body}// {js},")
    lines.append(f"{indent}];")
    return "\n".join(lines)


def apply_to_file(filepath, preset, dry_run=False):
    line_id = extract_line_id(filepath)
    if not line_id:
        return False, f"跳过（无法识别线路ID）: {filepath}"

    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start, end, indent = find_links_block(lines)
    if start is None:
        return False, f"跳过（未找到 links）: {filepath}"

    new_block = generate_block(preset, line_id, indent)
    
    if dry_run:
        return True, f"[预览] {filepath}\n{new_block}"

    bak = filepath + BACKUP_SUFFIX
    if not os.path.exists(bak):
        shutil.copy2(filepath, bak)

    new_lines = lines[:start] + [new_block + "\n"] + lines[end+1:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    return True, f"已更新: {filepath}"


def interactive_single(filepath):
    line_id = extract_line_id(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start, end, indent = find_links_block(lines)
    if start is None:
        print(f"错误: {filepath} 中未找到 const links = [ ... ] 块")
        return

    existing = parse_existing_links(lines, start, end) if start is not None else {}

    print(f"\n{'='*50}")
    print(f"正在配置: {filepath}")
    print("提示: 直接回车使用方括号中的默认值")
    print(f"{'='*50}")

    configured = []
    for entry in OPERATING_PRESET:
        current = existing.get(entry["text"], {})
        cfg = ask(entry, current)
        configured.append({
            "icon": entry["icon"],
            "text": entry["text"],
            "url": entry["url"],
            "show": cfg["show"],
            "param": cfg["param"],
        })

    print(f"\n{'='*50}")
    print("预览生成结果:")
    preview = generate_block(configured, line_id, indent)
    print(preview)
    print(f"{'='*50}")

    confirm = input("\n确认写入? [Y/n] > ").strip().lower()
    if confirm in ("n", "no", "否"):
        print("已取消")
        return

    bak = filepath + BACKUP_SUFFIX
    if not os.path.exists(bak):
        shutil.copy2(filepath, bak)
        print(f"已备份: {bak}")

    new_lines = lines[:start] + [preview + "\n"] + lines[end+1:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"已更新: {filepath}")


def batch_apply(files, preset, preset_name):
    print(f"\n{'='*50}")
    print(f"批量应用【{preset_name}】预设")
    print(f"{'='*50}")
    print("\n可用线路:")
    for i, f in enumerate(files, 1):
        lid = extract_line_id(f)
        print(f"  {i:2d}. {lid:>4s}")

    print("\n输入要应用的线路编号（多个用空格分隔，如: 1 3 5 6z）")
    sel = input("或直接输入 all 应用全部 > ").strip()

    if sel.lower() == "all":
        targets = files
    else:
        ids = sel.split()
        targets = [f for f in files if extract_line_id(f) in ids]

    if not targets:
        print("未选择有效线路")
        return

    print(f"\n即将应用到 {len(targets)} 个文件:")
    for f in targets:
        print(f"  - {f}")

    confirm = input("\n确认? [Y/n] > ").strip().lower()
    if confirm in ("n", "no", "否"):
        print("已取消")
        return

    for f in targets:
        ok, msg = apply_to_file(f, preset)
        print(msg)

    print("\n批量应用完成")


def main():
    files = sorted(glob.glob("line *.html"), key=lambda x: extract_line_id(x) or "")
    if not files:
        print("当前目录未找到 line *.html 文件")
        return

    while True:
        print(f"\n{'='*50}")
        print("线路百科 Links 配置工具")
        print(f"{'='*50}")
        print("\n可用线路:")
        for i, f in enumerate(files, 1):
            lid = extract_line_id(f)
            print(f"  {i:2d}. {lid:>4s}")

        print(f"\n{'='*50}")
        print("操作选项:")
        print("  1. 逐个交互配置单条线路")
        print("  2. 批量应用【已开通】预设")
        print("  3. 批量应用【建设中】预设")
        print("  4. 退出")
        print(f"{'='*50}")

        choice = input("\n请选择 [1-4] > ").strip()

        if choice == "1":
            lid = input("请输入线路ID (如 1, 6z, 13) > ").strip()
            filepath = f"line {lid}.html"
            if not os.path.exists(filepath):
                print(f"错误: 未找到 {filepath}")
                continue
            interactive_single(filepath)

        elif choice == "2":
            batch_apply(files, OPERATING_PRESET, "已开通线路")

        elif choice == "3":
            batch_apply(files, CONSTRUCTION_PRESET, "建设中线路")

        elif choice == "4":
            print("退出")
            break

        else:
            print("无效选项")


if __name__ == "__main__":
    main()