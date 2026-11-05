// The method site: tabs, the sticky line, copy buttons, and one small interactive per area.
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  const colour = key => `var(--a${key})`;

  /* ---------- colours, the line, the sticky bar ---------- */
  $$('.area').forEach(a => a.style.setProperty('--c', colour(a.dataset.area)));
  $$('#line a').forEach((a, i) => { a.style.setProperty('--c', colour(a.dataset.station)); a.style.setProperty('--i', i); });
  const mini = $('#mini'), here = $('#here');
  $$('.area').forEach(a => {
    const li = document.createElement('li');
    const name = $('h2', a).textContent;
    li.innerHTML = `<a href="#${a.id}" title="${esc(name)}" aria-label="${esc(name)}"></a>`;
    li.firstChild.style.setProperty('--c', colour(a.dataset.area));
    mini.appendChild(li);
  });
  const miniLinks = $$('a', mini);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const i = $$('.area').indexOf(e.target);
      miniLinks.forEach((l, j) => l.classList.toggle('on', i === j));
      here.textContent = $('h2', e.target).textContent;
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('.area').forEach(a => io.observe(a));

  /* ---------- tabs ---------- */
  $$('.tabs').forEach(list => {
    const tabs = $$('[role=tab]', list);
    const show = t => {
      tabs.forEach(x => {
        const on = x === t;
        x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (window.drawMermaid) window.drawMermaid(panel);
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(t));
      t.addEventListener('keydown', e => {
        const n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!n) return;
        const next = tabs[(i + n + tabs.length) % tabs.length]; next.focus(); show(next);
      });
    });
  });

  /* ---------- copy buttons on code ---------- */
  $$('.prose pre:not(.mermaid)').forEach(pre => {
    const b = document.createElement('button'); b.className = 'copy'; b.type = 'button'; b.textContent = 'copy';
    b.addEventListener('click', () => {
      const t = pre.innerText.replace(/\ncopy$/, '');
      const done = () => { b.textContent = 'copied'; setTimeout(() => b.textContent = 'copy', 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, () => {});
    });
    pre.appendChild(b);
  });

  /* ---------- a small quiz helper ---------- */
  function quiz(root, items, options) {
    let done = 0, right = 0;
    const score = document.createElement('div'); score.className = 'score';
    const upd = () => score.textContent = `${right} right, ${done} of ${items.length} answered`;
    root.appendChild(score); upd();
    items.forEach(it => {
      const q = document.createElement('div'); q.className = 'q';
      q.innerHTML = `<div>${esc(it.text)}</div><div class="opts"></div><div class="why" hidden></div>`;
      options.forEach(o => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.textContent = o.label;
        b.addEventListener('click', () => {
          const ok = o.key === it.a;
          $$('.opt', q).forEach(x => { x.disabled = true; if (x.textContent === options.find(p => p.key === it.a).label) x.classList.add('answer-opt'); });
          q.classList.add(ok ? 'right' : 'wrong');
          const w = $('.why', q); w.hidden = false; w.textContent = (ok ? 'Yes. ' : 'Not quite. ') + it.why;
          done++; if (ok) right++; upd();
        });
        $('.opts', q).appendChild(b);
      });
      root.appendChild(q);
    });
  }
  const head = (root, label, title, text) => {
    root.insertAdjacentHTML('beforeend', `<div class="label">${esc(label)}</div><h3>${esc(title)}</h3>${text ? `<p>${text}</p>` : ''}`);
  };

  const W = {};

  /* 1: challenges and their answers */
  W.challenges = root => {
    head(root, 'Try it', 'What goes wrong, and what fixes it', 'Pick a problem you\'ve seen.');
    const C = [
      ['It guesses', 'It fills gaps in the request with good guesses, which makes them hard to spot.', 'Plan first, with a mock, questions or both, then a spec you approve. When unsure, it asks.', '7'],
      ['It over-builds', 'Each step adds a little, and a modest feature comes out at six times the size.', 'Decide the size at the plan, against the closest thing already built. Extras go on a Later list.', '7'],
      ['It forgets', 'Every session starts from nothing, and long ones lose the thread.', 'The repo holds what it needs to know, and progress lives in the tracker, not the chat.', '2'],
      ['The architecture erodes', 'One sensible-looking change at a time.', 'One architecture page, each part\'s limits written down, and review against it.', '3'],
      ['It says "done"', 'And nothing proves it.', 'One gate, the same on your laptop, in CI, and before Claude may stop.', '5'],
      ['It follows rules most of the time', 'Instructions are requests.', 'What must hold is held by a hook, a permission or CI, not by its judgement.', '2'],
      ['A huge diff', 'No summary, no idea what\'s risky.', 'Small PRs, a description that says how to check it, and review sized to risk.', '4'],
      ['It reads things you didn\'t write', 'And some of them try to give it orders.', 'Layers: permissions, review, and no live secrets where it runs.', '10'],
    ];
    const chips = document.createElement('div'); chips.className = 'chips'; root.appendChild(chips);
    const ans = document.createElement('div'); ans.className = 'answer'; ans.setAttribute('aria-live', 'polite'); root.appendChild(ans);
    const show = i => {
      $$('.chip', chips).forEach((c, j) => c.setAttribute('aria-pressed', i === j));
      const [t, p, fix, area] = C[i];
      const name = $(`#area-${area} h2`).textContent;
      ans.style.setProperty('--c', colour(area));
      ans.innerHTML = `<b class="big">${esc(fix)}</b><span>${esc(p)}</span><a href="#area-${area}">Area ${area}: ${esc(name)} →</a>`;
    };
    C.forEach((c, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = c[0];
      b.addEventListener('click', () => show(i)); chips.appendChild(b);
    });
    show(0);
    root.insertAdjacentHTML('beforeend', '<p>None of these is a reason not to use it. They\'re the cost of the opportunities, and each one is solvable.</p>');
  };

  /* 2: advice or enforced */
  W.enforced = root => {
    head(root, 'Try it', 'Advice, or does it hold?', 'A rule nothing checks is advice. Which of these hold when Claude disagrees?');
    quiz(root, [
      { text: 'Claude can\'t read .env, because the repo\'s settings deny it', a: 'holds', why: 'A permission: Claude Code refuses the call before it happens.' },
      { text: '"Prefer small functions", written in AGENTS.md', a: 'advice', why: 'An instruction. Claude follows it most of the time. Fine for a preference.' },
      { text: 'An autonomous run can\'t end with the gate red', a: 'holds', why: 'A Stop hook runs the gate whatever Claude thinks.' },
      { text: '"Use the glossary\'s terms"', a: 'advice', why: 'Guidance that review applies with judgement.' },
      { text: 'Every PR links an issue and has a How to check', a: 'holds', why: 'A CI check fails the PR without them.' },
      { text: 'High-risk paths need an owner\'s approval, on a free private GitHub repo', a: 'advice', why: 'Without branch protection, CODEOWNERS holds by agreement only. Say so in the table.' },
    ], [{ key: 'holds', label: 'it holds' }, { key: 'advice', label: 'advice' }]);
  };

  /* 3: the parts table, with what each must not do */
  W.mustnot = root => {
    head(root, 'Try it', 'What each part must not do', 'The demo app\'s parts. Pick one to see its limit, and what goes wrong without it.');
    const P = [
      ['Pages', 'Reading the request, calling Kitchen, rendering through one escaping helper', 'Run SQL, hold rules', 'SQL and rules spread across every page, and nothing can be tested without a browser.'],
      ['Kitchen', 'The one interface pages call for domain behaviour', 'Render HTML, read $_POST or $_SESSION', 'The domain gets tied to the web, and a second front end (an API, a kiosk) has to copy it.'],
      ['Roll-up', 'Walking a recipe tree: allergens with the path each came by', 'Touch the database', 'The rule that must never be wrong gets tangled with queries, and stops being one readable, testable piece of code.'],
      ['Supplier import', 'Reading the CSV, mapping allergen text onto the 14', 'Remove an allergen the app holds', 'A supplier\'s blank column silently deletes an allergen a person declared.'],
      ['Repositories', 'The SQL behind Kitchen', 'Decide anything', 'Business rules hide in queries, where review and tests don\'t look.'],
    ];
    const chips = document.createElement('div'); chips.className = 'chips'; root.appendChild(chips);
    const out = document.createElement('div'); out.className = 'answer'; root.appendChild(out);
    const show = i => {
      $$('.chip', chips).forEach((c, j) => c.setAttribute('aria-pressed', i === j));
      const [n, owns, must, risk] = P[i];
      out.innerHTML = `<span><b>Owns:</b> ${esc(owns)}</span><b class="big">Must not: ${esc(must)}</b><span><b>Without it:</b> ${esc(risk)}</span>`;
    };
    P.forEach((p, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = p[0]; b.addEventListener('click', () => show(i)); chips.appendChild(b); });
    show(2);
  };

  /* 4: the merge dial */
  W.dial = root => {
    head(root, 'Try it', 'Who merges this PR?', 'Set the dial and the files a PR changes.');
    const FILES = [['README.md', 'low', 'Docs'], ['tests/RollUpTest.php', 'low', 'Tests'], ['public/menu.php', 'medium', 'An ordinary product change'],
      ['src/Kitchen/RollUp.php', 'high', 'Allergen roll-up, on the high-risk list'], ['db/migrations/', 'high', 'A data migration'], ['.github/workflows/', 'high', 'CI and deploy']];
    const T = ['low', 'medium', 'high'];
    let dial = 'learning';
    root.insertAdjacentHTML('beforeend', `<div class="two"><div style="display:grid;gap:10px">
      <div class="lever" role="group" aria-label="Merge dial"><button data-d="learning" aria-pressed="true">learning</button><button data-d="default" aria-pressed="false">default</button><button data-d="trusted" aria-pressed="false">trusted</button></div>
      <div class="files">${FILES.map(([f, t, w], i) => `<label><input type="checkbox" ${i === 2 ? 'checked' : ''} data-i="${i}"><span><code>${esc(f)}</code><br><small style="color:var(--ink-2)">${esc(w)}</small></span><span class="tier t-${t}">${t}</span></label>`).join('')}</div>
      <label style="display:flex;gap:8px;font-size:14px"><input type="checkbox" class="raise"> The reviewer thinks it's riskier</label></div>
      <div class="sig"><div class="lamps"><i class="r"></i><i class="a"></i><i class="g"></i></div><div style="display:grid;gap:6px"><div class="score tl"></div><b class="vd" style="font-size:20px;line-height:1.3"></b><ul class="ex" style="margin:0;padding-left:18px;font-size:14px"></ul></div></div></div>
      <p style="font-size:14px;color:var(--ink-2)">The agent can raise a tier, never lower it. An agent's approval never counts as a person's.</p>`);
    const upd = () => {
      let tier = -1;
      $$('.files input', root).forEach(c => { if (c.checked) tier = Math.max(tier, T.indexOf(FILES[+c.dataset.i][1])); });
      $$('.lamps i', root).forEach(l => l.classList.remove('lit'));
      if (tier < 0) { $('.tl', root).textContent = 'No files'; $('.vd', root).textContent = 'Pick at least one file.'; $('.ex', root).innerHTML = ''; return; }
      if ($('.raise', root).checked && tier < 2) tier++;
      const t = T[tier]; let v, lamp, ex = [];
      if (t === 'high') { v = 'Waits for an owner\'s approval.'; lamp = 'r'; ex = ['An owner of that area approves', 'A rollback plan in the PR', 'A security review before the PR']; }
      else if (dial === 'learning') { v = 'Waits for a person to review it.'; lamp = 'a'; ex = ['Learning: a person merges every PR']; }
      else if (t === 'low') { v = 'Merges itself once CI is green.'; lamp = 'g'; }
      else if (dial === 'default') { v = 'Waits for you, who ran the agent.'; lamp = 'a'; }
      else { v = 'Merges itself once CI is green.'; lamp = 'g'; ex = ['Only where the track record supports it']; }
      ex.push('CI runs the gate either way');
      $('.tl', root).textContent = 'Risk tier: ' + t; $('.vd', root).textContent = v;
      $('.lamps .' + lamp, root).classList.add('lit');
      $('.ex', root).innerHTML = ex.map(x => `<li>${esc(x)}</li>`).join('');
    };
    root.addEventListener('change', upd);
    $$('[data-d]', root).forEach(b => b.addEventListener('click', () => { dial = b.dataset.d; $$('[data-d]', root).forEach(x => x.setAttribute('aria-pressed', x === b)); upd(); }));
    upd();
  };

  /* 4: pick the route */
  W.route = root => {
    head(root, 'Try it', 'Pick the route', 'Big means more than one ticket, or it changes an invariant or a contract. Run whole issues down the line in <a href="issue-to-merge/">Issue to Merge</a>.');
    quiz(root, [
      { text: 'The supplier CSV import drops "may contain" warnings', a: 'small', why: 'A bug: reproduce it with a failing test, then fix it.' },
      { text: 'Add an API so the website can read menus', a: 'big', why: 'A new contract other systems read. Plan it, agree the contract, then build.' },
      { text: 'Sales says customers want "something with AI" for menus', a: 'unclear', why: 'Nobody can say what problem it solves. Discover first.' },
      { text: 'Sort the recipe list by name, like the menu list already does', a: 'small', why: 'Small, and it follows a pattern that\'s already there.' },
      { text: 'Sous chefs must approve allergen changes before they go live', a: 'big', why: 'It changes who may do what, on safety data. More than one ticket.' },
    ], [{ key: 'unclear', label: 'discover first' }, { key: 'big', label: 'plan, then build' }, { key: 'small', label: 'one brief, one PR' }]);
  };

  /* 5: the stop hook */
  W.stophook = root => {
    head(root, 'Try it', 'It can\'t finish on red', 'In an autonomous run, a hook runs the gate when Claude tries to stop.');
    root.insertAdjacentHTML('beforeend', `<div class="chips"><button class="btn" data-s="fix" type="button">A fixable failure</button><button class="btn" data-s="stuck" type="button" style="background:var(--a6)">A stuck one</button></div><div class="term" aria-live="polite"><div class="p">Pick a run.</div></div>`);
    const term = $('.term', root); let run = 0;
    const line = (t, c) => { const d = document.createElement('div'); if (c) d.className = c; d.textContent = t; term.appendChild(d); term.scrollTop = term.scrollHeight; };
    const go = async kind => {
      const id = ++run; term.innerHTML = '';
      const say = async (t, c, ms = 450) => { if (id !== run) throw 0; line(t, c); await wait(ms); };
      try {
        await say('Claude: the import now refuses impossible values. Done.', 'p');
        await say('hook: running the gate before the turn ends…');
        await say('✗ 1 failing: KitchenSupplierImportTest::testRefusesFatOver100', 'bad');
        await say('hook: the gate is red. Fix the cause, not the symptom. The cause may be the environment.', 'ask');
        if (kind === 'fix') {
          await say('Claude: the limit was checked after rounding. Moving the check before it.');
          await say('hook: running the gate…');
          await say('✓ OK (178 tests)', 'ok');
          await say('hook: green. The turn can end.', 'ok');
        } else {
          for (let n = 2; n <= 3; n++) {
            await say(`Claude: trying again (${n === 2 ? 'a different fix' : 'restarting the database'}).`);
            await say(`✗ still failing (block ${n} of 3): the test database won't start`, 'bad');
          }
          await say('hook: third block in a row. Stop trying: say in five lines what you need from a person.', 'ask');
          await say('Claude: needs-human. MySQL won\'t start in Docker here; the code change is committed. Can someone check Docker Desktop?', 'ask');
        }
      } catch (e) { /* a newer run started */ }
    };
    $$('[data-s]', root).forEach(b => b.addEventListener('click', () => go(b.dataset.s)));
  };

  /* 6: a raw report becomes a brief */
  W.brief = root => {
    head(root, 'Try it', 'From a raw report to a brief', 'Triage, reproduce, then a brief on the issue. Nothing is built until you say go.');
    root.insertAdjacentHTML('beforeend', `<div class="q"><b>"Supplier import crashed on the new CSV"</b><span style="font-size:14px;color:var(--ink-2)">Raw, as it reached the queue</span><button class="btn" type="button">Triage and reproduce it</button></div><dl class="bf" style="margin:0"></dl>`);
    const B = [['Category', 'bug'], ['Reproduced', 'fat_g 9999.999 rounds past the column and MySQL rejects it: the page says "Something went wrong" instead of refusing the file.'],
      ['Acceptance', 'Impossible values (fat over 100 g, energy over 900 kcal) refuse the file with a reason naming the row; 100 g and 900 kcal are accepted; the ingredient form is unchanged.'],
      ['Out of scope', 'Cross-field checks. Changing the column types.'], ['Human verification', 'Sign in, preview a one-row CSV with fat_g 9999.999, and see it refused with a reason.'],
      ['Risk', 'Medium. It waits for a person to merge.']];
    let busy = false;
    $('.btn', root).addEventListener('click', async () => {
      if (busy) return; busy = true; const out = $('.bf', root); out.innerHTML = '';
      for (const [k, v] of B) {
        const f = document.createElement('div'); f.className = 'field'; f.innerHTML = `<dt>${esc(k)}</dt><dd class="typing"></dd>`; out.appendChild(f);
        const dd = $('dd', f);
        if (reduce) dd.textContent = v; else for (let i = 0; i <= v.length; i += 3) { dd.textContent = v.slice(0, i); await wait(8); }
        dd.textContent = v; dd.classList.remove('typing');
      }
      out.insertAdjacentHTML('beforeend', '<p style="margin-top:8px"><b>Then the plan, and it waits for go:</b> a failing test first for 9999.999, then the fix.</p>');
      busy = false;
    });
  };

  /* 7: the oversteer */
  W.proportion = root => {
    head(root, 'From our own testing', 'A method can oversteer', 'The same request, a printable allergen chart, built three ways on the same app.');
    const R = [{ n: 'Plain prompt', c: 'var(--a2)', lines: 840, mins: 7 }, { n: 'Every thorough option accepted', c: 'var(--a6)', lines: 4980, mins: 94 }, { n: 'Tuned for proportion', c: 'var(--a4)', lines: 1040, mins: 29 }];
    root.insertAdjacentHTML('beforeend', `<div class="lever" role="group" aria-label="Measure"><button data-m="lines" aria-pressed="true">lines</button><button data-m="mins" aria-pressed="false">build time</button></div><div class="bars">${R.map((r, i) => `<div class="barrow"><span>${esc(r.n)}</span><div class="track"><div class="fill" data-i="${i}" style="background:${r.c};width:0"></div><span class="val" data-v="${i}"></span></div></div>`).join('')}</div><p style="font-size:14px;color:var(--ink-2)">A blind review scored the tuned build above the plain one on correctness, design, tests and readability. One run each: indicative, not proof. The plain build had the best single idea: a version code printed on every sheet.</p>`);
    const fmt = { lines: v => '~' + v.toLocaleString('en-GB') + ' lines', mins: v => v >= 60 ? `${Math.floor(v / 60)} h ${v % 60} m` : v + ' min' };
    const show = m => {
      const max = Math.max(...R.map(r => r[m]));
      R.forEach((r, i) => {
        const pct = r[m] / max * 100; $(`.fill[data-i="${i}"]`, root).style.width = pct + '%';
        const v = $(`.val[data-v="${i}"]`, root); v.textContent = fmt[m](r[m]);
        if (pct > 45) { v.style.left = 'auto'; v.style.right = (100 - pct) + '%'; v.style.color = '#fff'; } else { v.style.right = 'auto'; v.style.left = pct + '%'; v.style.color = 'var(--ink)'; }
      });
    };
    $$('[data-m]', root).forEach(b => b.addEventListener('click', () => { $$('[data-m]', root).forEach(x => x.setAttribute('aria-pressed', x === b)); show(b.dataset.m); }));
    requestAnimationFrame(() => show('lines'));
  };

  /* 7: a model per ticket */
  W.model = root => {
    head(root, 'Try it', 'Which model for this ticket?', 'The cheapest one that gets it right.');
    quiz(root, [
      { text: 'Add "sort by name" to the recipe list, following the menu list\'s sort', a: 'cheap', why: 'Fully specified, and it follows an existing pattern.' },
      { text: 'Carry "may contain" up the recipe tree in the allergen roll-up', a: 'strong', why: 'It changes a rule that must never be wrong.' },
      { text: 'The JSON endpoint the website will read', a: 'strong', why: 'A contract other systems read.' },
      { text: 'Print styles for the allergen chart, to match the mock', a: 'cheap', why: 'The mock settles every decision, even though the screen is high risk to review.' },
    ], [{ key: 'cheap', label: 'the cheaper model' }, { key: 'strong', label: 'the strongest' }]);
  };

  /* 8: the four moves */
  W.moves = root => {
    head(root, 'Try it', 'Four moves, in order', 'Step through changing legacy code safely.');
    const M = [['1 · Pin it', 'Characterisation tests', 'A test records every page the app returns today, over the whole demo data, bugs included. Any change now shows up as a failing line.', 'Line 11 differs. Expected: price: €12.50  Actual: price: 12.50'],
      ['2 · Make a seam', 'Move the logic out', 'The menu logic moves out of a 300-line controller into one service. The page now calls the service. The pinned tests stay green: proof nothing a customer sees changed.', '✓ golden master unchanged · 18 of 18 green'],
      ['3 · Build on it', 'The new feature', 'The kiosk screen uses the service. Not a copy of the controller, so the two screens can\'t disagree about a dish.', '+ KioskController (uses MenuService)'],
      ['4 · Switch over', 'Remove the old path', 'Website and kiosk share one home for the rules. Then upgrades get small: the move to Framework 4.8 was 30 lines of configuration, proven by the same pin.', '30 lines · 0 code changes · 18 of 18 green']];
    root.insertAdjacentHTML('beforeend', `<div class="steps">${M.map((m, i) => `<button class="step" type="button" data-i="${i}" aria-pressed="${i === 0}"><b>${esc(m[0])}</b><span>${esc(m[1])}</span></button>`).join('')}</div><div class="answer mv"></div><div class="term mt" style="min-height:0"></div><p style="font-size:14px;color:var(--ink-2)">Don't give Claude these steps. See if its plan includes them, and ask if it doesn't.</p>`);
    const show = i => { $$('.step', root).forEach((s, j) => s.setAttribute('aria-pressed', i === j)); $('.mv', root).innerHTML = `<span>${esc(M[i][2])}</span>`; $('.mt', root).textContent = M[i][3]; };
    $$('.step', root).forEach(s => s.addEventListener('click', () => show(+s.dataset.i)));
    show(0);
  };

  /* 9: the deploy checks */
  W.deploy = root => {
    head(root, 'Try it', 'What the pipeline checks', 'Pick a commit and deploy it.');
    const S = [['On main', 'The commit is on main'], ['Gate passed', 'CI passed for this exact commit'], ['Infrastructure', 'Bicep applied'], ['Deploy', 'The app released'], ['Serving', 'Health check: this version, with its database']];
    const CASES = { good: [1, 1, 1, 1, 1], branch: [0], red: [1, 0], nodb: [1, 1, 1, 1, 0] };
    const MSG = { good: 'Deployed, and checked: it\'s serving this release with its database.', branch: 'Refused: only commits on main are deployed.', red: 'Refused: the gate hasn\'t passed for this commit.', nodb: 'Failed loudly: the app is up but can\'t reach its database. A deploy that "succeeds" like this is worse than a failed one, because nobody looks.' };
    root.insertAdjacentHTML('beforeend', `<div class="chips"><button class="chip" data-k="good" type="button">A merged commit, gate green</button><button class="chip" data-k="branch" type="button">A commit on a branch</button><button class="chip" data-k="red" type="button">Gate failed</button><button class="chip" data-k="nodb" type="button">Database unreachable</button></div><div class="steps">${S.map((s, i) => `<div class="step" data-i="${i}"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join('')}</div><div class="answer dm" aria-live="polite"><span>Every deploy can be rolled back, and the PR says how.</span></div>`);
    let run = 0;
    $$('[data-k]', root).forEach(b => b.addEventListener('click', async () => {
      const id = ++run, k = b.dataset.k;
      $$('[data-k]', root).forEach(x => x.setAttribute('aria-pressed', x === b));
      $$('.step', root).forEach(s => s.classList.remove('done', 'fail'));
      $('.dm', root).innerHTML = '<span>Running…</span>';
      for (let i = 0; i < CASES[k].length; i++) {
        await wait(380); if (id !== run) return;
        $(`.step[data-i="${i}"]`, root).classList.add(CASES[k][i] ? 'done' : 'fail');
      }
      $('.dm', root).innerHTML = `<b class="big" style="font-size:20px">${esc(MSG[k])}</b>`;
    }));
  };

  /* 10: the lethal trifecta */
  W.trifecta = root => {
    head(root, 'Try it', 'The lethal trifecta', 'Simon Willison\'s term. Switch on what a coding agent with your permissions has.');
    root.insertAdjacentHTML('beforeend', `<div class="two"><svg class="venn" viewBox="0 0 300 270" role="img" aria-label="Three overlapping circles"><circle data-c="1" cx="110" cy="100" r="78" stroke="var(--a4)" fill="var(--a4)"/><circle data-c="2" cx="190" cy="100" r="78" stroke="var(--a3)" fill="var(--a3)"/><circle data-c="3" cx="150" cy="170" r="78" stroke="var(--a9)" fill="var(--a9)"/><text x="62" y="78" text-anchor="middle">private</text><text x="62" y="93" text-anchor="middle">data</text><text x="240" y="78" text-anchor="middle">text you</text><text x="240" y="93" text-anchor="middle">didn't write</text><text x="150" y="240" text-anchor="middle">a way out</text><text class="risk" x="150" y="132" text-anchor="middle" style="font:900 22px var(--display);fill:var(--stop);opacity:0">RISK</text></svg>
      <div style="display:grid;gap:8px"><button class="chip" data-t="1" type="button" aria-pressed="false"><b>Private data</b>: your code, .env, the database, tokens</button><button class="chip" data-t="2" type="button" aria-pressed="false"><b>Text you didn't write</b>: issues, PR comments, a supplier's CSV, web pages</button><button class="chip" data-t="3" type="button" aria-pressed="false"><b>A way out</b>: posting a comment, pushing a branch, a web request</button><p class="tm" style="font-size:15px">Any one on its own is fine.</p></div></div>`);
    const on = { 1: false, 2: false, 3: false };
    $$('[data-t]', root).forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.t; on[k] = !on[k]; b.setAttribute('aria-pressed', on[k]);
      $(`circle[data-c="${k}"]`, root).classList.toggle('on', on[k]);
      const n = Object.values(on).filter(Boolean).length;
      $('.risk', root).style.opacity = n === 3 ? 1 : 0;
      $('.tm', root).innerHTML = n === 3 ? '<b>All three: where a coding agent with your permissions starts.</b> Someone else\'s text can make it send your data out. Take one away: usually the secrets.' : n === 2 ? 'Any two are fine. Take the third away and an injected instruction has nothing to steal, or nowhere to send it.' : 'Any one on its own is fine.';
    }));
  };

  $$('.try[data-widget]').forEach(el => { const f = W[el.dataset.widget]; if (f) f(el); });
})();
