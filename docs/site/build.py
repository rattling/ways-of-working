"""Build docs/index.html, the method site, from docs/method.md and docs/site/template.html.

Run it after any change to the method:  uv run --with markdown python docs/site/build.py

Each "## N. Area" in method.md becomes a station on the line and a section on the page: its "In short"
box, any text before the first "###", then one tab per "###" part. A small interactive goes at the top of
an area where WIDGETS names one; the interactives themselves are in docs/assets/site.js.
"""
import html as htmllib
import pathlib
import re

import markdown

DOCS = pathlib.Path(__file__).resolve().parent.parent
SRC = DOCS / "method.md"
TEMPLATE = DOCS / "site" / "template.html"
OUT = DOCS / "index.html"

# Short names for the line map, and the interactive at the top of each area.
SHORT = {
    "1": "The agent", "2": "Standards", "3": "Architecture", "4": "How work flows", "5": "Testing",
    "6": "Bugs", "7": "Features", "8": "Legacy", "9": "Deployment", "10": "Security", "adopt": "Adopting it",
}
WIDGETS = {
    "1": ["challenges"], "2": ["enforced"], "3": ["mustnot"], "4": ["dial", "route"], "5": ["stophook"],
    "6": ["brief"], "7": ["proportion", "model"], "8": ["moves"], "9": ["deploy"], "10": ["trifecta"],
}


def md(text: str) -> str:
    """Markdown to HTML, with Mermaid kept for the browser and wide things wrapped to scroll."""
    blocks = []

    def keep(m):
        blocks.append(m.group(1))
        return f"\n\nMERMAID{len(blocks) - 1}\n\n"

    text = re.sub(r"```mermaid\n(.*?)```", keep, text, flags=re.S)
    out = markdown.markdown(text, extensions=["tables", "fenced_code"])
    for i, b in enumerate(blocks):
        out = out.replace(f"<p>MERMAID{i}</p>", f'<div class="scroll"><pre class="mermaid">{htmllib.escape(b)}</pre></div>')
    out = out.replace("<table>", '<div class="scroll"><table>').replace("</table>", "</table></div>")
    out = re.sub(r'<p>(<img [^>]*alt="([^"]*)"[^>]*>)</p>',
                 r'<figure>\1<figcaption>\2</figcaption></figure>', out)
    out = out.replace("<img ", '<img loading="lazy" ')
    return out


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def split_area(body: str):
    """Return (in_short_items, intro_md, [(part_title, part_md)])."""
    lines = body.strip("\n").split("\n")
    short = []
    i = 0
    if lines and lines[0].startswith("> **In short**"):
        i = 1
        while i < len(lines) and lines[i].startswith(">"):
            item = lines[i].lstrip("> ").strip()
            if item.startswith("- "):
                short.append(item[2:])
            i += 1
    rest = "\n".join(lines[i:])
    parts = re.split(r"^### (.+)$", rest, flags=re.M)
    intro = parts[0].strip()
    tabs = [(parts[k].strip(), parts[k + 1].strip()) for k in range(1, len(parts), 2)]
    return short, intro, tabs


def render_area(key: str, num: str, title: str, body: str) -> str:
    short, intro, tabs = split_area(body)
    sid = "area-" + key
    h = [f'<section class="area" id="{sid}" data-area="{key}">']
    h.append('<header class="area-head">')
    badge = num if num else "→"
    h.append(f'<span class="badge" aria-hidden="true">{badge}</span>')
    h.append(f'<h2>{htmllib.escape(title)}</h2></header>')
    if short:
        h.append('<div class="inshort"><div class="eyebrow">In short</div><ul>')
        h += [f"<li>{markdown.markdown(s)[3:-4]}</li>" for s in short]
        h.append("</ul></div>")
    if intro:
        h.append(f'<div class="intro prose">{md(intro)}</div>')
    for w in WIDGETS.get(key, []):
        h.append(f'<div class="try" data-widget="{w}"></div>')
    if tabs:
        h.append(f'<div class="tabs" role="tablist" aria-label="{htmllib.escape(title)}">')
        for n, (t, _) in enumerate(tabs):
            tid = f"{sid}-{slug(t)}"
            sel = "true" if n == 0 else "false"
            h.append(f'<button role="tab" id="{tid}-tab" aria-controls="{tid}" aria-selected="{sel}" '
                     f'tabindex="{0 if n == 0 else -1}">{htmllib.escape(t)}</button>')
        h.append("</div>")
        for n, (t, body_md) in enumerate(tabs):
            tid = f"{sid}-{slug(t)}"
            hidden = "" if n == 0 else " hidden"
            h.append(f'<div class="panel prose" role="tabpanel" id="{tid}" aria-labelledby="{tid}-tab"{hidden}>'
                     f"{md(body_md)}</div>")
    h.append("</section>")
    return "\n".join(h)


def main():
    text = SRC.read_text(encoding="utf-8")
    head, *_ = text.split("\n## ", 1)
    # Only the areas and "Adopting it" start a section: "## " inside a code example doesn't.
    sections = re.split(r"^## (\d+\. .+|Adopting it)$", text, flags=re.M)
    areas, stations = [], []
    for k in range(1, len(sections), 2):
        heading, body = sections[k].strip(), sections[k + 1]
        m = re.match(r"(\d+)\.\s+(.*)", heading)
        if m:
            key, num, title = m.group(1), m.group(1), m.group(2)
        else:
            key, num, title = "adopt", "", heading
        areas.append(render_area(key, num, title, body))
        short, _, tabs = split_area(body)
        stations.append({"key": key, "num": num, "name": SHORT.get(key, title), "title": title,
                         "lead": short[0] if short else "", "parts": [t for t, _ in tabs]})

    # The intro: the paragraphs after the title and subtitle.
    intro_md = "\n".join(l for l in head.split("\n") if not l.startswith("# ") and not l.startswith("*The method"))
    station_html = "\n".join(
        f'<li><a href="#area-{s["key"]}" data-station="{s["key"]}"><span class="dot"></span>'
        f'<span class="num">{s["num"] or "→"}</span><span class="name">{s["name"]}</span></a></li>'
        for s in stations)

    # A card per area: its name and the first line of its In short.
    cards_html = "\n".join(
        f'<a class="card" href="#area-{s["key"]}" data-station="{s["key"]}">'
        f'<span class="badge" aria-hidden="true">{s["num"] or "→"}</span>'
        f'<span class="card-text"><b>{htmllib.escape(s["title"])}</b>'
        f'<span>{markdown.markdown(s["lead"])[3:-4]}</span></span></a>'
        for s in stations)

    page = TEMPLATE.read_text(encoding="utf-8")
    page = page.replace("{{INTRO}}", md(intro_md)).replace("{{STATIONS}}", station_html)
    page = page.replace("{{CARDS}}", cards_html)
    page = page.replace("{{AREAS}}", "\n\n".join(areas))
    OUT.write_text(page, encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB, {len(areas)} sections)")


if __name__ == "__main__":
    main()
