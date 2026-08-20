import json
import sys
from pathlib import Path


def find_json_array(content):
    """找到 ALL_LINES_ENHANCED 后的 JSON 数组"""
    markers = [
        'const ALL_LINES_ENHANCED = ',
        'var ALL_LINES_ENHANCED = ',
        'let ALL_LINES_ENHANCED = ',
    ]
    idx = -1
    for m in markers:
        idx = content.find(m)
        if idx != -1:
            break
    if idx == -1:
        raise ValueError("找不到 ALL_LINES_ENHANCED 声明")
    
    start = idx + len(markers[0])
    while start < len(content) and content[start] in ' \\t\\n\\r':
        start += 1
    
    if content[start] != '[':
        raise ValueError("ALL_LINES_ENHANCED 后面不是 '[' 开头")
    
    bracket_count = 0
    in_string = False
    escape = False
    array_end = -1
    
    for i, ch in enumerate(content[start:], start):
        if escape:
            escape = False
            continue
        if ch == '\\\\':
            escape = True
            continue
        if ch == '"' and not in_string:
            in_string = True
        elif ch == '"' and in_string:
            in_string = False
        elif not in_string:
            if ch == '[':
                bracket_count += 1
            elif ch == ']':
                bracket_count -= 1
                if bracket_count == 0:
                    array_end = i + 1
                    break
    
    if array_end == -1:
        raise ValueError("无法找到 JSON 数组的结束位置")
    
    return content[start:array_end], start


def show_context(content, abs_pos, window=200):
    """显示错误位置附近的上下文"""
    start = max(0, abs_pos - window)
    end = min(len(content), abs_pos + window)
    
    # 计算错误所在行号
    line_num = content[:abs_pos].count('\n') + 1
    col_num = abs_pos - content.rfind('\n', 0, abs_pos)
    
    print(f"错误位置: 第 {line_num} 行, 第 {col_num} 列 (字符偏移 {abs_pos})")
    print("-" * 60)
    
    # 显示上下文
    context = content[start:end]
    # 标记错误位置
    marker_pos = abs_pos - start
    lines = []
    current = 0
    for ch in context:
        if ch == '\n':
            lines.append(current)
            current = 0
        else:
            current += 1
    
    # 打印上下文，带行号
    context_lines = context.split('\n')
    context_start_line = content[:start].count('\n') + 1
    for i, line in enumerate(context_lines):
        ln = context_start_line + i
        marker = "  <<< 错误在这里" if start + sum(len(l) + 1 for l in context_lines[:i]) <= abs_pos < start + sum(len(l) + 1 for l in context_lines[:i+1]) else ""
        print(f"{ln:4d}: {line}{marker}")
    
    print("-" * 60)
    return line_num, col_num


def diagnose(content, array_str, array_start):
    """诊断 JSON 错误"""
    try:
        json.loads(array_str)
        print("[PASS] JSON 解析成功，格式正确！")
        return True
    except json.JSONDecodeError as e:
        abs_pos = array_start + e.pos
        print(f"[ERROR] JSON 解析失败: {e.msg}")
        print()
        show_context(content, abs_pos)
        
        # 自动检测常见错误
        print()
        print("常见错误排查：")
        error_line_start = content.rfind('\n', 0, abs_pos) + 1
        error_line_end = content.find('\n', abs_pos)
        error_line = content[error_line_start:error_line_end]
        
        # 检查多余逗号
        if ',\\s*}' in error_line or ',\\s*]' in error_line:
            print("  -> 发现多余逗号: 在 '}' 或 ']' 前不应该有 ','")
        
        # 检查单引号
        if "'" in error_line:
            print("  -> 发现单引号: JSON 必须使用双引号 \"")
        
        # 检查未闭合的字符串
        quote_count = error_line.count('"')
        if quote_count % 2 != 0:
            print("  -> 该行引号数量为奇数，可能存在未闭合的字符串")
        
        # 检查属性名未加引号
        if ':' in error_line and not error_line.strip().startswith('"'):
            print("  -> 属性名可能未用双引号包裹")
        
        return False


def main():
    filepath = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('all-lines-enhanced.js')
    
    if not filepath.exists():
        print(f"[ERROR] 未找到 {filepath}")
        sys.exit(1)
    
    print(f"[INFO] 正在诊断 {filepath} ...")
    print()
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    try:
        array_str, array_start = find_json_array(content)
    except ValueError as e:
        print(f"[ERROR] 无法定位 JSON 数组: {e}")
        sys.exit(1)
    
    diagnose(content, array_str, array_start)


if __name__ == '__main__':
    main()