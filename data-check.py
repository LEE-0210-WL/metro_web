import json
import re
import sys
import os

def strip_js_comments(text):
    """移除 JS 中的 // 和 /* */ 注释"""
    # 移除 /* */ 注释（包括多行）
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.DOTALL)
    # 移除 // 行注释
    lines = []
    for line in text.split("\n"):
        # 小心处理字符串中的 //
        new_line = ""
        in_string = False
        string_char = None
        i = 0
        while i < len(line):
            ch = line[i]
            if not in_string and ch in ('"', "'"):
                in_string = True
                string_char = ch
                new_line += ch
            elif in_string and ch == string_char:
                # 检查是否是转义
                if i > 0 and line[i-1] == "\\":
                    new_line += ch
                else:
                    in_string = False
                    string_char = None
                    new_line += ch
            elif not in_string and ch == "/" and i + 1 < len(line) and line[i+1] == "/":
                break  # 遇到 //，截断
            else:
                new_line += ch
            i += 1
        lines.append(new_line)
    return "\n".join(lines)

def extract_json_from_js(filepath):
    """从 JS 文件中提取 JSON 数组，支持带注释的文件"""
    with open(filepath, "r", encoding="utf-8") as f:
        raw = f.read()

    # 先去掉注释
    content = strip_js_comments(raw)
    content = content.strip()

    # 找第一个 [ 和配对的最后一个 ]
    start = content.find("[")
    if start == -1:
        raise ValueError("文件中未找到 '[' 起始符")

    # 用括号计数找匹配的 ]
    depth = 0
    in_string = False
    string_char = None
    end = -1
    for i in range(start, len(content)):
        ch = content[i]
        if not in_string and ch in ('"', "'"):
            in_string = True
            string_char = ch
        elif in_string and ch == string_char:
            if content[i-1] != "\\":
                in_string = False
                string_char = None
        elif not in_string:
            if ch == "[":
                depth += 1
            elif ch == "]":
                depth -= 1
                if depth == 0:
                    end = i
                    break

    if end == -1:
        raise ValueError("未找到匹配的 ']' 结束符")

    json_str = content[start:end + 1]
    # 处理尾随逗号
    json_str = re.sub(r",(\s*[}\]])", r"\1", json_str)

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON 解析失败: {e}")
        print("出错位置附近:")
        print(json_str[max(0, e.pos - 80):e.pos + 80])
        raise

def is_date_outdated(open_date_str):
    if not open_date_str:
        return False, ""
    s = str(open_date_str)
    flags = []
    keywords = ["预计", "规划中", "待定", "TBD"]
    for kw in keywords:
        if kw in s:
            flags.append(f"含'{kw}'")
    year_matches = re.findall(r"20(\d{2})", s)
    for ym in year_matches:
        year = 2000 + int(ym)
        if year <= 2025 and any(k in s for k in ["预计", "规划", "计划"]):
            flags.append(f"年份{year}已过期")
        elif year == 2026 and "预计" in s:
            if any(m in s for m in ["6月", "上半年", "一季度", "Q1", "Q2"]):
                flags.append("2026上半年已过期")
    return len(flags) > 0, "; ".join(flags)

def format_table(lines):
    headers = ["ID", "名称", "别名", "类别", "里程(km)", "站点数", "开通日期", "状态标记"]
    col_widths = [6, 24, 24, 10, 10, 8, 38, 30]

    def pad(s, w):
        s = str(s) if s is not None else "-"
        cn_count = sum(1 for c in s if "\u4e00" <= c <= "\u9fff")
        return s + " " * max(0, w - len(s) - cn_count)

    header_line = " | ".join(pad(h, w) for h, w in zip(headers, col_widths))
    print(header_line)
    print("-" * len(header_line))

    outdated_count = 0
    for line in lines:
        cat = line.get("category", "?")
        cat_display = "已开通" if cat == "operating" else ("建设中" if cat == "construction" else cat)
        open_date = line.get("openDate", "")
        is_outdated, flag = is_date_outdated(open_date)
        if is_outdated:
            outdated_count += 1
            flag_display = f"[!] {flag}"
        else:
            flag_display = "OK" if cat == "operating" else "-"

        row = [
            line.get("id", "?"),
            line.get("name", "")[:22],
            line.get("alias", "")[:22],
            cat_display,
            line.get("lengthKm", "-"),
            line.get("stationCount", "-"),
            str(open_date)[:36] if open_date else "-",
            flag_display[:28]
        ]
        print(" | ".join(pad(v, w) for v, w in zip(row, col_widths)))

    print(f"\n总计: {len(lines)} 条线路")
    print(f"标记为可能过期: {outdated_count} 条")
    return outdated_count

def export_csv(lines, filepath):
    import csv
    with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["id", "name", "alias", "category", "lengthKm", "stationCount",
                         "openDate", "formationCode", "maxSpeedKmh", "outdated_flag"])
        for line in lines:
            is_outdated, flag = is_date_outdated(line.get("openDate", ""))
            writer.writerow([
                line.get("id", ""), line.get("name", ""), line.get("alias", ""),
                line.get("category", ""), line.get("lengthKm", ""),
                line.get("stationCount", ""), line.get("openDate", ""),
                line.get("formationCode", ""), line.get("maxSpeedKmh", ""),
                flag if is_outdated else ""
            ])
    print(f"CSV 已导出: {filepath}")

def export_md(lines, filepath):
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("# 深圳地铁线路数据审计\n\n")
        f.write("| ID | 名称 | 别名 | 类别 | 里程(km) | 站点数 | 开通日期 | 状态 |\n")
        f.write("|---|---|---|---|---|---|---|---|\n")
        for line in lines:
            cat = "已开通" if line.get("category") == "operating" else "建设中"
            open_date = line.get("openDate", "")
            is_outdated, flag = is_date_outdated(open_date)
            status = f"`{flag}`" if is_outdated else ("OK" if cat == "已开通" else "-")
            f.write(f"| {line.get('id','')} | {line.get('name','')} | {line.get('alias','')} | {cat} | {line.get('lengthKm','-')} | {line.get('stationCount','-')} | {open_date} | {status} |\n")
    print(f"Markdown 已导出: {filepath}")

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print(f"用法: python {os.path.basename(__file__)} <all-lines-enhanced.js> [--csv out.csv] [--md out.md]")
        sys.exit(1)

    js_path = sys.argv[1]
    if not os.path.exists(js_path):
        print(f"错误: 文件不存在 {js_path}")
        sys.exit(1)

    print(f"正在解析: {js_path}\n")
    lines = extract_json_from_js(js_path)

    def sort_key(line):
        sid = str(line.get("id", ""))
        try:
            return (0, int(sid))
        except ValueError:
            return (1, sid)
    lines.sort(key=sort_key)

    outdated = format_table(lines)

    if "--csv" in sys.argv:
        idx = sys.argv.index("--csv")
        if idx + 1 < len(sys.argv):
            export_csv(lines, sys.argv[idx + 1])
    if "--md" in sys.argv:
        idx = sys.argv.index("--md")
        if idx + 1 < len(sys.argv):
            export_md(lines, sys.argv[idx + 1])

    sys.exit(1 if outdated > 0 else 0)

if __name__ == "__main__":
    main()