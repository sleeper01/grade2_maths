"""Unit 2 验证脚本：检查 HTML/JS 标签配对与结构"""
import re
import os
import sys

base = '/f/zcode_workspace/lesson/grade2/maths/addition-subtraction-100'

def read(p):
    with open(os.path.join(base, p), 'r', encoding='utf-8') as f:
        return f.read()

html = read('index.html')
js   = read('script.js')
css  = read('style.css')

print('=' * 60)
print(' Unit 2 文件验证')
print('=' * 60)

print(f'\n文件大小：')
print(f'  index.html : {len(html):,} chars ({len(html.encode("utf-8")):,} bytes)')
print(f'  style.css  : {len(css):,} chars ({len(css.encode("utf-8")):,} bytes)')
print(f'  script.js  : {len(js):,} chars ({len(js.encode("utf-8")):,} bytes)')

# HTML 标签平衡
void_tags = {'meta','link','br','hr','img','input','source','area','base','col','embed','param','track','wbr'}
tags_open  = re.findall(r'<([a-zA-Z][a-zA-Z0-9]*)', html)
tags_close = re.findall(r'</([a-zA-Z][a-zA-Z0-9]*)', html)

from collections import Counter
opens  = Counter(t for t in tags_open if t not in void_tags)
closes = Counter(tags_close)

print('\nHTML 标签平衡（不计自闭合 void 标签）：')
all_tags = sorted(set(list(opens.keys()) + list(closes.keys())))
all_ok = True
for tag in all_tags:
    o = opens.get(tag, 0)
    c = closes.get(tag, 0)
    status = 'OK' if o == c else 'MISMATCH'
    if o != c: all_ok = False
    print(f'  {tag:12s} open={o:3d}  close={c:3d}  {status}')
print(f'\n  总体：{"通过" if all_ok else "失败"}')

# JS 大括号/小括号/中括号
print('\nJS 括号平衡：')
js_no_str = re.sub(r"'(?:[^'\\]|\\.)*'", "''", js)
js_no_str = re.sub(r'"(?:[^"\\]|\\.)*"', '""', js_no_str)
js_no_str = re.sub(r'`(?:[^`\\]|\\.)*`', '``', js_no_str, flags=re.DOTALL)
js_no_str = re.sub(r'//[^\n]*', '', js_no_str)
js_no_str = re.sub(r'/\*[\s\S]*?\*/', '', js_no_str)

pairs = [('{', '}'), ('(', ')'), ('[', ']')]
for l, r in pairs:
    lc, rc = js_no_str.count(l), js_no_str.count(r)
    print(f'  {l} {r}  count = {lc} / {rc}  {"OK" if lc == rc else "FAIL"}')

# 章节-幻灯片对应
print('\n章节-幻灯片对应：')
sections = re.findall(r'<section[^>]*data-section="(\d+)"[^>]*>(.*?)</section>', html, re.DOTALL)
total_slides = 0
for sec_idx, sec_content in sections:
    slide_indices = re.findall(r'data-slide="(\d+)"', sec_content)
    total_slides += len(slide_indices)
    print(f'  Section {sec_idx}: {len(slide_indices)} 张 -> indices {slide_indices}')
print(f'\n  共 {len(sections)} 个章节，{total_slides} 张幻灯片')

# JS 中的关键函数检查
print('\n关键 JS 函数是否存在：')
required_funcs = [
    'goToSection', 'goToSlide', 'nextSlide', 'prevSlide',
    'runTensAdd', 'runTensSub', 'runCarryAdd', 'runBorrowSub',
    'initQuiz', 'loadQuizQuestion', 'handleQuizAnswer',
    'triggerConfetti', 'bindEvents'
]
for fn in required_funcs:
    found = ('function ' + fn + '(') in js or ('function ' + fn + ' (') in js
    print(f'  {fn:24s} {"OK" if found else "MISSING"}')

# 检查 CSS 中的关键 class
print('\n关键 CSS class 是否定义：')
required_css = [
    '.slide', '.slide.active', '.bundle', '.result-pop',
    '.carry-demo', '.borrow-row', '.vertical-calc', '.v-line',
    '.quiz-card', '.quiz-opt', '.summary-grid', '.rel-card',
    '.parent-tip', '.cover-title', '.top-nav'
]
for sel in required_css:
    found = sel in css
    print(f'  {sel:24s} {"OK" if found else "MISSING"}')

print('\n' + '=' * 60)
print(' 验证完成')
print('=' * 60)
