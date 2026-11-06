"""Build the site from the three parts of the method.

    uv run --with markdown python docs/site/build.py

- docs/why.md     ->  docs/index.html          one page: why, what good looks like, where we land
- docs/method.md  ->  docs/method/index.html   a hub: the areas, grouped, each opening on its own
- docs/ways.md    ->  docs/ways/index.html     a hub: what ways brings, area by area, getting started

In a hub, each "## Heading" is an area: its "> **In short**" box, any text before its first "###", a small
interactive where WIDGETS names one, then a tab per "### Part". A "<!-- group: Name -->" line starts a group
of areas on the hub. The interactives are in docs/assets/site.js. docs/basics/ and docs/issue-to-merge/ are
hand-written pages and aren't built here.
"""
import hashlib
import html as htmllib
import pathlib
import re

import markdown

DOCS = pathlib.Path(__file__).resolve().parent.parent
TEMPLATE = DOCS / "site" / "template.html"

PAGES = [
    {"src": "why.md", "out": "index.html", "kind": "prose", "nav": "why"},
    {"src": "method.md", "out": "method/index.html", "kind": "hub", "nav": "method"},
    {"src": "ways.md", "out": "ways/index.html", "kind": "hub", "nav": "ways"},
]
NAV = [("why", "Why", ""), ("method", "The method", "method/"), ("ways", "Ways", "ways/"),
       ("basics", "New to this?", "basics/"), ("itm", "Issue to Merge", "issue-to-merge/")]

# Each group has a colour; a hub with no groups gives each area its own.
GROUP_COLOURS = {"Start here": "var(--a1)", "Foundations": "var(--a3)", "The work": "var(--a4)",
                 "Quality": "var(--a5)", "Running it, and changing it": "var(--a9)"}
SPARE = ["var(--a4)", "var(--a7)", "var(--a9)", "var(--a3)", "var(--a5)"]

# The interactive at the top of an area, by the area's slug.
WIDGETS = {
    "standards-and-the-repo": ["enforced"], "architecture": ["mustnot"], "how-work-flows": ["dial", "route"],
    "testing-and-the-gate": ["stophook"], "bugs": ["brief"], "features": ["proportion", "model"],
    "legacy-code": ["moves"], "deployment": ["deploy"], "security": ["trifecta"],
    "what-goes-wrong-and-what-fixes-it": ["challenges"],
}


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def mask(text):
    """Hide fenced code, so a heading inside an example isn't taken for a section."""
    blocks = []

    def keep(m):
        blocks.append(m.group(0))
        return f"\x00{len(blocks) - 1}\x00"
    return re.sub(r"```.*?```", keep, text, flags=re.S), blocks


def unmask(text, blocks):
    return re.sub(r"\x00(\d+)\x00", lambda m: blocks[int(m.group(1))], text)


def md(text: str) -> str:
    """Markdown to HTML: Mermaid kept for the browser, wide things scroll, and a run of paragraphs
    that each open with a bold lead becomes a set of cards."""
    blocks = []

    def keep(m):
        blocks.append(m.group(1))
        return f"\n\nMERMAID{len(blocks) - 1}\n\n"
    text = re.sub(r"```mermaid\n(.*?)```", keep, text, flags=re.S)
    out = markdown.markdown(text, extensions=["tables", "fenced_code"])
    for i, b in enumerate(blocks):
        out = out.replace(f"<p>MERMAID{i}</p>", f'<div class="scroll"><pre class="mermaid">{htmllib.escape(b)}</pre></div>')
    out = out.replace("<table>", '<div class="scroll"><table>').replace("</table>", "</table></div>")
    out = re.sub(r'<p>(<img [^>]*alt="([^"]*)"[^>]*>)</p>', r'<figure>\1<figcaption>\2</figcaption></figure>', out)
    out = out.replace("<img ", '<img loading="lazy" ')
    # Each match is one whole paragraph (no "</p>" inside it), so a run can't swallow a table between two.
    out = re.sub(r"((?:<p><strong>(?:(?!</p>).)*</p>\s*){2,})", lambda m: f'<div class="pcards">{m.group(1)}</div>', out, flags=re.S)
    return out


def inline(text: str) -> str:
    return markdown.markdown(text)[3:-4]


def split_short(body: str):
    lines = body.strip("\n").split("\n")
    short, i = [], 0
    if lines and lines[0].startswith("> **In short**"):
        i = 1
        while i < len(lines) and lines[i].startswith(">"):
            item = lines[i].lstrip("> ").strip()
            if item.startswith("- "):
                short.append(item[2:])
            i += 1
    return short, "\n".join(lines[i:])


def sections(text: str, level: int):
    masked, blocks = mask(text)
    parts = re.split(rf"^{'#' * level} (.+)$", masked, flags=re.M)
    return unmask(parts[0], blocks), [(parts[i].strip(), unmask(parts[i + 1], blocks)) for i in range(1, len(parts), 2)]


def title_and_lead(head: str):
    m = re.search(r"^# (.+)$", head, flags=re.M)
    title = m.group(1).strip() if m else ""
    lead = re.sub(r"^# .+$", "", head, flags=re.M).strip()
    return title, lead


def render_area(key, title, body, colour):
    short, rest = split_short(body)
    intro, tabs = sections(rest, 3)
    sid = "area-" + key
    h = [f'<section class="area" id="{sid}" data-area="{key}" style="--c:{colour}">',
         f'<header class="area-head"><span class="badge" aria-hidden="true"></span><h2>{htmllib.escape(title)}</h2></header>']
    if short:
        h.append('<div class="inshort"><div class="eyebrow">In short</div><ul>' +
                 "".join(f"<li>{inline(s)}</li>" for s in short) + "</ul></div>")
    if intro.strip():
        h.append(f'<div class="intro prose">{md(intro)}</div>')
    for w in WIDGETS.get(key, []):
        h.append(f'<div class="try" data-widget="{w}"></div>')
    if tabs:
        h.append(f'<div class="tabs" role="tablist" aria-label="{htmllib.escape(title)}">')
        for n, (t, _) in enumerate(tabs):
            tid = f"{sid}-{slug(t)}"
            h.append(f'<button role="tab" id="{tid}-tab" aria-controls="{tid}" aria-selected="{"true" if n == 0 else "false"}" '
                     f'tabindex="{0 if n == 0 else -1}">{htmllib.escape(t)}</button>')
        h.append("</div>")
        for n, (t, b) in enumerate(tabs):
            tid = f"{sid}-{slug(t)}"
            h.append(f'<div class="panel prose" role="tabpanel" id="{tid}" aria-labelledby="{tid}-tab"'
                     f'{"" if n == 0 else " hidden"}>{md(b)}</div>')
    h.append("</section>")
    return "\n".join(h), short


def heading(title, default=""):
    """'Building software with Claude: balancing speed and quality' -> eyebrow, then a short title."""
    if ": " in title:
        top, rest = title.split(": ", 1)
        return top, rest[:1].upper() + rest[1:]
    return default, title


def hero(title, lead, default=""):
    eyebrow, h1 = heading(title, default)
    eb = f'<div class="eyebrow"><span class="ring"></span>{htmllib.escape(eyebrow)}</div>' if eyebrow else ""
    return f'<header class="hero">{eb}<h1>{htmllib.escape(h1)}</h1><div class="lead prose">{md(lead)}</div></header>'


def build_hub(text):
    head, secs = sections(text, 2)
    title, lead = title_and_lead(head)
    # Groups come from "<!-- group: Name -->" lines; the marker sits at the end of the area before it.
    groups, current, areas, spare = [], None, [], iter(SPARE)
    pending = re.findall(r"<!-- group: (.+?) -->", head)
    if pending:
        current = pending[-1]
    for t, body in secs:
        key = slug(t)
        colour = GROUP_COLOURS.get(current) if current else next(spare)
        if not groups or groups[-1]["name"] != current:
            groups.append({"name": current, "colour": colour, "items": []})
        marker = re.search(r"<!-- group: (.+?) -->\s*$", body)
        body_clean = re.sub(r"<!-- group: .+? -->\s*$", "", body)
        html_area, short = render_area(key, t, body_clean, colour)
        areas.append(html_area)
        groups[-1]["items"].append({"key": key, "title": t, "lead": short[0] if short else "", "colour": colour})
        if marker:
            current = marker.group(1)
    hubs = []
    for g in groups:
        cards = "".join(
            f'<a class="card" href="#area-{i["key"]}" style="--c:{i["colour"]}"><span class="badge" aria-hidden="true"></span>'
            f'<span class="card-text"><b>{htmllib.escape(i["title"])}</b><span>{inline(i["lead"])}</span></span></a>'
            for i in g["items"])
        name = f'<div class="group-name">{htmllib.escape(g["name"])}</div>' if g["name"] else ""
        hubs.append(f'<div class="group" style="--c:{g["colour"]}">{name}<div class="cards">{cards}</div></div>')
    body = (f'<div class="landing" id="landing">{hero(title, lead)}'
            f'<div class="groups">{"".join(hubs)}</div></div>'
            f'<main id="areas">{"".join(areas)}</main>'
            '<nav class="pager" id="pager" aria-label="Areas" hidden><a class="prev" id="prev" href="#"></a>'
            '<a class="all" href="#">All areas</a><a class="next" id="next" href="#"></a></nav>')
    toc = [(g['name'], [(i['title'], '#area-' + i['key']) for i in g['items']]) for g in groups]
    return title, body, True, toc


def build_prose(text):
    head, secs = sections(text, 2)
    title, lead = title_and_lead(head)
    parts = [
        ("The method", "method/", "How to build software well with an AI assistant, area by area. No tools required."),
        ("Ways", "ways/", "Our implementation: a Claude Code plugin that puts the method in place, ready to use."),
        ("New to software engineering?", "basics/", "Software engineering in one page: the ground, with a drawing for each part."),
    ]
    cards = "".join(f'<a class="part" href="{h}"><b>{t}</b><span>{d}</span></a>' for t, h, d in parts)
    out = [hero(title, lead, "The method behind the ways plugin"), "<main>"]
    for n, (t, body) in enumerate(secs):
        key = slug(t)
        out.append(f'<section class="psec" id="{key}" style="--c:{SPARE[n % len(SPARE)]}"><h2>{htmllib.escape(t)}</h2>'
                   f'<div class="prose">{md(body)}</div>')
        for w in WIDGETS.get(key, []):
            out.append(f'<div class="try" data-widget="{w}"></div>')
        out.append("</section>")
    out.append(f'<section class="psec next-up" id="where-next"><h2>Where next</h2><div class="parts">{cards}</div></section></main>')
    toc = [(None, [(t, '#' + slug(t)) for t, _ in secs] + [("Where next", "#where-next")])]
    return title, "\n".join(out), False, toc


def contents(built, page):
    """The left panel: this page's own contents only. The bar at the top is the site; this is the page.
    Links are bare hashes, so a hub's areas open without a reload."""
    toc = next(toc for other, _, _, _, toc in built if other is page)
    out = ['<nav class="toc" aria-label="On this page"><div class="toc-head">On this page</div><ul>']
    for group, items in toc:
        if group:
            out.append(f'<li class="toc-group">{htmllib.escape(group)}</li>')
        for name, anchor in items:
            out.append(f'<li><a href="{anchor}">{htmllib.escape(name)}</a></li>')
    out.append("</ul></nav>")
    return "".join(out)


def main():
    template = TEMPLATE.read_text(encoding="utf-8")
    assets = b"".join((DOCS / "assets" / f).read_bytes() for f in ("site.css", "site.js"))
    version = hashlib.sha1(assets).hexdigest()[:8]
    built = []
    for page in PAGES:
        text = (DOCS / page["src"]).read_text(encoding="utf-8")
        built.append((page, *(build_hub(text) if page["kind"] == "hub" else build_prose(text))))
    for page, title, body, hub, _ in built:
        root = "../" * page["out"].count("/")
        side = contents(built, page)
        here = ' aria-current="page"'
        nav = "".join(f'<a href="{root}{href}"{here if key == page["nav"] else ""}>{label}</a>'
                      for key, label, href in NAV)
        sub = ""  # the left panel does this job now
        html = (template.replace("{{TITLE}}", htmllib.escape(title)).replace("{{ROOT}}", root)
                .replace("{{NAV}}", nav).replace("{{SUB}}", sub).replace("{{KIND}}", page["kind"])
                .replace("{{BODY}}", body).replace("{{SIDE}}", side).replace("{{V}}", version))
        out = DOCS / page["out"]
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html, encoding="utf-8")
        print(f"wrote {page['out']} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
