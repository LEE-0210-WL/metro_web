#!/usr/bin/env python3
"""
交互式恢复 .page-title 和 .page-subtitle 样式（含二次验证）
流程：
1. 第一轮检查：找出所有样式不一致的文件，逐个询问是否修复
2. 第二轮验证：重新扫描所有文件，确认是否全部修复成功
3. 如果还有未修复的，再次列出并询问
"""

import os
import re
import glob
import shutil

# ================== 标准样式（你提供的） ==================
STANDARD_PAGE_TITLE = """  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;"""

STANDARD_PAGE_SUBTITLE = """  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;"""

# ================== 工具函数 ==================
def find_html_files(root='.'):
    files = []
    for pattern in ['*.html', '*/*.html', '*/*/*.html']:
        files.extend(glob.glob(os.path.join(root, pattern)))
    return sorted(set(files))

def extract_rule(css_text, selector):
    pattern_full = re.compile(r'\.' + selector + r'\s*\{([^}]*)\}', re.DOTALL)
    match = pattern_full.search(css_text)
    if match:
        return match.group(1).strip(), match.start(), match.end()
    return None, None, None

def replace_rule(css_text, selector, new_content):
    pattern = re.compile(r'(\.' + selector + r'\s*\{)([^}]*)(\})', re.DOTALL)
    match = pattern.search(css_text)
    if not match:
        return css_text, False
    new_css = css_text[:match.start(2)] + new_content + css_text[match.end(2):]
    return new_css, True

def normalize_style(content):
    lines = [line.strip() for line in content.splitlines() if line.strip()]
    lines = [line if line.endswith(';') else line + ';' for line in lines]
    indented = ['  ' + line for line in lines]
    return '\n'.join(indented)

def check_file_styles(filepath):
    """
    检查单个文件的样式是否与标准一致
    返回: dict { 'title_match': bool, 'subtitle_match': bool, 'has_title': bool, 'has_subtitle': bool }
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
    except Exception:
        return {'title_match': True, 'subtitle_match': True, 'has_title': False, 'has_subtitle': False}

    style_pattern = re.compile(r'<style[^>]*>(.*?)</style>', re.DOTALL | re.IGNORECASE)
    styles = style_pattern.findall(html)
    if not styles:
        return {'title_match': True, 'subtitle_match': True, 'has_title': False, 'has_subtitle': False}

    # 合并所有 style 内容检查（简化处理）
    all_css = '\n'.join(styles)
    
    title_content, _, _ = extract_rule(all_css, 'page-title')
    sub_content, _, _ = extract_rule(all_css, 'page-subtitle')
    
    result = {
        'has_title': title_content is not None,
        'has_subtitle': sub_content is not None,
        'title_match': True,
        'subtitle_match': True
    }
    
    if title_content is not None:
        normalized_current = normalize_style(title_content)
        normalized_standard = normalize_style(STANDARD_PAGE_TITLE)
        result['title_match'] = (normalized_current == normalized_standard)
    
    if sub_content is not None:
        normalized_current = normalize_style(sub_content)
        normalized_standard = normalize_style(STANDARD_PAGE_SUBTITLE)
        result['subtitle_match'] = (normalized_current == normalized_standard)
    
    return result

def fix_file(filepath, fix_title=True, fix_subtitle=True):
    """修复单个文件的样式"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
    except Exception as e:
        print(f"  ⚠️ 无法读取 {filepath}: {e}")
        return False

    style_pattern = re.compile(r'<style[^>]*>(.*?)</style>', re.DOTALL | re.IGNORECASE)
    matches = list(style_pattern.finditer(html))
    if not matches:
        return False

    modified = False
    new_html = html

    for match in reversed(matches):
        style_content = match.group(1)
        start, end = match.span()
        changed = False
        
        if fix_title:
            title_content, _, _ = extract_rule(style_content, 'page-title')
            if title_content is not None:
                new_style, _ = replace_rule(style_content, 'page-title', STANDARD_PAGE_TITLE)
                if new_style != style_content:
                    style_content = new_style
                    changed = True
        
        if fix_subtitle:
            sub_content, _, _ = extract_rule(style_content, 'page-subtitle')
            if sub_content is not None:
                new_style, _ = replace_rule(style_content, 'page-subtitle', STANDARD_PAGE_SUBTITLE)
                if new_style != style_content:
                    style_content = new_style
                    changed = True
        
        if changed:
            tag_open = re.match(r'<style[^>]*>', html[start:end], re.IGNORECASE).group(0)
            new_tag = tag_open + style_content + '</style>'
            new_html = new_html[:start] + new_tag + new_html[end:]
            modified = True

    if modified:
        backup = filepath + '.bak'
        shutil.copy2(filepath, backup)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)
        return True
    return False

def print_style_diff(filepath, selector, current, standard):
    """打印样式差异"""
    print(f"\n📄 {filepath}")
    print(f"  当前 .{selector} 样式：")
    print("  " + "-" * 50)
    for line in current.splitlines():
        if line.strip():
            print("  " + line)
    print("  " + "-" * 50)
    print("  期望恢复为：")
    print("  " + "-" * 50)
    for line in standard.splitlines():
        if line.strip():
            print("  " + line)
    print("  " + "-" * 50)

def get_user_choice(prompt="  是否恢复为标准样式？(y/n/a=全部) "):
    while True:
        choice = input(prompt).strip().lower()
        if choice in ('y', 'n', 'a'):
            return choice
        print("  请输入 y / n / a")

def main():
    print("=" * 70)
    print("🚇 交互式恢复样式（含二次验证）")
    print("=" * 70)
    print("标准样式：")
    print("  .page-title {")
    for line in STANDARD_PAGE_TITLE.splitlines():
        if line.strip():
            print("    " + line.strip())
    print("  }")
    print("  .page-subtitle {")
    for line in STANDARD_PAGE_SUBTITLE.splitlines():
        if line.strip():
            print("    " + line.strip())
    print("  }")
    print("=" * 70)

    html_files = find_html_files('.')
    if not html_files:
        print("❌ 未找到任何 HTML 文件")
        return

    print(f"\n📁 共找到 {len(html_files)} 个 HTML 文件\n")

    # ========== 第一轮：检查并修复 ==========
    print("🔍 第一轮检查...")
    need_fix = []
    
    for filepath in html_files:
        result = check_file_styles(filepath)
        title_ok = result['title_match']
        sub_ok = result['subtitle_match']
        
        # 如果有样式但匹配失败，或者有样式但被标记为不匹配
        if (result['has_title'] and not title_ok) or (result['has_subtitle'] and not sub_ok):
            need_fix.append(filepath)
            print(f"  ⚠️ {filepath} - 需要修复")
        else:
            print(f"  ✅ {filepath}")

    if not need_fix:
        print("\n🎉 所有文件样式正确，无需修复！")
        return

    print(f"\n📋 发现 {len(need_fix)} 个文件需要修复")

    # 逐个询问修复
    fix_count = 0
    for filepath in need_fix:
        # 获取当前样式
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
        style_pattern = re.compile(r'<style[^>]*>(.*?)</style>', re.DOTALL | re.IGNORECASE)
        all_css = '\n'.join(style_pattern.findall(html))
        
        title_content, _, _ = extract_rule(all_css, 'page-title')
        sub_content, _, _ = extract_rule(all_css, 'page-subtitle')
        
        # 显示差异
        print(f"\n{'='*70}")
        print(f"📄 {filepath}")
        if title_content is not None and normalize_style(title_content) != normalize_style(STANDARD_PAGE_TITLE):
            print_style_diff(filepath, 'page-title', title_content, STANDARD_PAGE_TITLE)
        if sub_content is not None and normalize_style(sub_content) != normalize_style(STANDARD_PAGE_SUBTITLE):
            print_style_diff(filepath, 'page-subtitle', sub_content, STANDARD_PAGE_SUBTITLE)
        
        choice = get_user_choice()
        if choice == 'a':
            # 全部修复：修复当前文件，然后剩余文件自动修复
            if fix_file(filepath, True, True):
                fix_count += 1
                print(f"  ✅ 已修复 {filepath}")
            # 剩余文件全部自动修复
            for f in need_fix[need_fix.index(filepath)+1:]:
                if fix_file(f, True, True):
                    fix_count += 1
                    print(f"  ✅ 已自动修复 {f}")
            break
        elif choice == 'y':
            if fix_file(filepath, True, True):
                fix_count += 1
                print(f"  ✅ 已修复 {filepath}")
        else:
            print(f"  ⏭️ 跳过 {filepath}")

    print(f"\n✅ 第一轮修复完成，共修复 {fix_count} 个文件")

    # ========== 第二轮：验证 ==========
    print("\n" + "=" * 70)
    print("🔍 第二轮验证：重新检查所有文件...")
    print("=" * 70)

    still_broken = []
    for filepath in html_files:
        result = check_file_styles(filepath)
        title_ok = result['title_match']
        sub_ok = result['subtitle_match']
        
        if (result['has_title'] and not title_ok) or (result['has_subtitle'] and not sub_ok):
            still_broken.append(filepath)
            print(f"  ❌ {filepath} - 仍有问题")
        else:
            print(f"  ✅ {filepath}")

    if not still_broken:
        print("\n🎉 所有文件验证通过！全部样式已恢复为标准样式。")
        return

    # ========== 第三轮：处理漏网之鱼 ==========
    print(f"\n⚠️ 仍有 {len(still_broken)} 个文件未修复：")
    for f in still_broken:
        print(f"  - {f}")
    
    choice = input("\n是否强制修复剩余所有文件？(y/n) ").strip().lower()
    if choice == 'y':
        fixed_again = 0
        for filepath in still_broken:
            if fix_file(filepath, True, True):
                fixed_again += 1
                print(f"  ✅ 已修复 {filepath}")
        print(f"\n✅ 二次修复完成，共修复 {fixed_again} 个文件")
        
        # 最终验证
        print("\n🔍 最终验证...")
        final_broken = []
        for filepath in still_broken:
            result = check_file_styles(filepath)
            if (result['has_title'] and not result['title_match']) or (result['has_subtitle'] and not result['subtitle_match']):
                final_broken.append(filepath)
                print(f"  ❌ {filepath}")
        if not final_broken:
            print("\n🎉 所有文件已成功修复！")
        else:
            print(f"\n⚠️ 以下文件仍存在问题，请手动检查：")
            for f in final_broken:
                print(f"  - {f}")
    else:
        print("\n⚠️ 以下文件请手动修复：")
        for f in still_broken:
            print(f"  - {f}")

    print("\n" + "=" * 70)
    print("💡 提示：每个修改过的文件都会生成 .bak 备份，如需恢复可重命名。")

if __name__ == '__main__':
    main()