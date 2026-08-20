import json
import re
import sys
from pathlib import Path
from collections import defaultdict


def load_data(filepath):
    """从JS文件中提取JSON数组"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    markers = [
        'const ALL_LINES_ENHANCED = ',
        'var ALL_LINES_ENHANCED = ',
        'let ALL_LINES_ENHANCED = ',
    ]
    
    idx = -1
    marker = None
    for m in markers:
        idx = content.find(m)
        if idx != -1:
            marker = m
            break
    
    if idx == -1:
        raise ValueError("找不到 ALL_LINES_ENHANCED 声明")
    
    start = idx + len(marker)
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
    
    return json.loads(content[start:array_end])


def check_count_consistency(data):
    """检查 stationCount 与 stationList 长度是否一致"""
    issues = []
    for line in data:
        lid = line['id']
        slist = line.get('stationList', [])
        scount = line.get('stationCount', 0)
        if len(slist) != scount:
            issues.append(f"  {lid}号线: 声明 {scount} 站，实际 {len(slist)} 站")
    return issues


def check_ghost_transfers(data):
    """检查 transfers 中的站点是否都在 stationList 中"""
    issues = []
    for line in data:
        lid = line['id']
        slist = line.get('stationList', [])
        trans = line.get('transfers', {})
        for station in trans:
            if station not in slist:
                issues.append(f"  {lid}号线: 换乘站 '{station}' 不在 stationList 中")
    return issues


def check_bidirectional_transfers(data):
    """检查换乘关系是否双向一致"""
    issues = []
    lines_by_id = {line['id']: line for line in data}
    
    for line in data:
        lid = line['id']
        trans = line.get('transfers', {})
        for station, other_lines in trans.items():
            for other_lid in other_lines:
                other_line = lines_by_id.get(other_lid)
                if not other_line:
                    issues.append(f"  {lid}号线 '{station}' → {other_lid}号线: 目标线路不存在")
                    continue
                other_trans = other_line.get('transfers', {})
                # 检查 other_line 的 transfers 中是否有指向 lid 的换乘
                found = False
                for os, olines in other_trans.items():
                    if lid in olines:
                        found = True
                        break
                if not found:
                    issues.append(f"  {lid}号线 '{station}' → {other_lid}号线: 但 {other_lid}号线未回指 {lid}号线")
    return issues


def check_duplicate_stations(data):
    """检查同一线路内是否有重复站点名"""
    issues = []
    for line in data:
        lid = line['id']
        slist = line.get('stationList', [])
        seen = set()
        dups = []
        for s in slist:
            if s in seen:
                dups.append(s)
            seen.add(s)
        if dups:
            issues.append(f"  {lid}号线: 重复站点 {dups}")
    return issues


def check_color_format(data):
    """检查颜色格式是否为标准 HEX"""
    issues = []
    for line in data:
        lid = line['id']
        color = line.get('color', '')
        if not re.match(r'^#[0-9A-Fa-f]{6}$', color):
            issues.append(f"  {lid}号线: 颜色格式异常 '{color}'")
    return issues


def check_construction_date(data):
    """检查建设中线路的 openDate 是否包含'预计'"""
    issues = []
    for line in data:
        lid = line['id']
        if line.get('category') == 'construction':
            date = line.get('openDate', '')
            if '预计' not in date and '规划' not in date and '远期' not in date:
                issues.append(f"  {lid}号线: 建设中但 openDate 无'预计'字样 ('{date}')")
    return issues


def main():
    filepath = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('all-lines-enhanced.js')
    
    if not filepath.exists():
        print(f"[ERROR] 未找到 {filepath}")
        print("用法: python3 check_metro_data.py [文件路径]")
        sys.exit(1)
    
    print(f"[INFO] 正在检查 {filepath} ...\\n")
    data = load_data(filepath)
    print(f"[INFO] 共 {len(data)} 条线路\\n")
    
    all_ok = True
    
    # 1. 站数一致性
    issues = check_count_consistency(data)
    print("[检查1] stationCount 与 stationList 长度一致性")
    if issues:
        print("\\n".join(issues))
        all_ok = False
    else:
        print("  [PASS] 全部一致")
    
    # 2. 幽灵换乘站
    issues = check_ghost_transfers(data)
    print("\\n[检查2] transfers 幽灵换乘站检测")
    if issues:
        print("\\n".join(issues))
        all_ok = False
    else:
        print("  [PASS] 无幽灵换乘站")
    
    # 3. 换乘双向一致性
    issues = check_bidirectional_transfers(data)
    print("\\n[检查3] 换乘关系双向一致性")
    if issues:
        print("\\n".join(issues))
        all_ok = False
    else:
        print("  [PASS] 全部双向一致")
    
    # 4. 重复站点
    issues = check_duplicate_stations(data)
    print("\\n[检查4] 重复站点名检测")
    if issues:
        print("\\n".join(issues))
        all_ok = False
    else:
        print("  [PASS] 无重复站点")
    
    # 5. 颜色格式
    issues = check_color_format(data)
    print("\\n[检查5] 颜色格式检查")
    if issues:
        print("\\n".join(issues))
        all_ok = False
    else:
        print("  [PASS] 全部标准 HEX")
    
    # 6. 建设中线路日期
    issues = check_construction_date(data)
    print("\\n[检查6] 建设中线路 openDate 合理性")
    if issues:
        print("\\n".join(issues))
        # 这个只是提示，不算错误
    else:
        print("  [PASS] 全部合理")
    
    print("\\n" + "=" * 50)
    if all_ok:
        print("[结果] ✅ 全部检查通过，数据健康！")
    else:
        print("[结果] ⚠️  发现上述问题，建议修复")
    print("=" * 50)


if __name__ == '__main__':
    main()
