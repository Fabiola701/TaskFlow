import re, pathlib

src = pathlib.Path("taskflow.html").read_text(encoding="utf-8")
out = pathlib.Path("taskflow-site"); out.mkdir(exist_ok=True)

style = re.search(r"<style>.*?</style>", src, re.S).group(0)
script = re.search(r"<script>.*?</script>", src, re.S).group(0)
css = style[len("<style>"):-len("</style>")]
js = script[len("<script>"):-len("</script>")]

# --- edit JS so navigation uses separate pages ---
FILES = "{dash:'index.html',tasks:'tasks.html',tl:'timeline.html',cal:'calendar.html',pom:'pomodoro.html',ana:'analytics.html',mem:'members.html'}"
js = js.replace("let pg='dash',", "let pg=PAGE,")
js = js.replace("const NAV=", "const FILES=" + FILES + ";\nconst NAV=")
js = js.replace("function go(p){pg=p;", "function go(p){if(p!=PAGE){location.href=FILES[p];return}pg=p;")
js = js.replace("""onclick="go('${k}')\"""", """href="${FILES[k]}\"""")
js = js.replace("$('#q').oninput=()=>go('tasks');",
  "$('#q').value=PAGE=='tasks'?(sessionStorage.tfq||''):'';"
  "$('#q').oninput=()=>{sessionStorage.tfq=$('#q').value;go('tasks')};")
js = js.replace("\ngo('dash');", "\ngo(PAGE);")

# --- shared shell ---
shell = src.replace(style, '<link rel="stylesheet" href="style.css">')
shell = shell.replace(script, '<script>const PAGE="{{PAGE}}";</script>\n<script src="app.js"></script>')
shell = shell.replace("<title>TaskFlow</title>", "<title>TaskFlow - {{TITLE}}</title>")

(out/"style.css").write_text(css, encoding="utf-8")
(out/"app.js").write_text(js, encoding="utf-8")

pages = {"dash":("index.html","Dashboard"), "tasks":("tasks.html","Tasks"),
 "tl":("timeline.html","Timeline"), "cal":("calendar.html","Calendar"),
 "pom":("pomodoro.html","Pomodoro"), "ana":("analytics.html","Analytics"),
 "mem":("members.html","Members")}
for key,(fn,title) in pages.items():
    (out/fn).write_text(shell.replace("{{PAGE}}",key).replace("{{TITLE}}",title), encoding="utf-8")
print("Done ->", out)