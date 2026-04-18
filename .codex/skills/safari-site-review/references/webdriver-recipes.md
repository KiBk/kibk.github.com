# WebDriver Recipes

Use these patterns with `safaridriver` on port `4444`.

## Start local preview

```bash
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000`.

## Start Safari WebDriver

One-time setup:

```bash
safaridriver --enable
```

Normal run:

```bash
safaridriver -p 4444
```

Health check:

```bash
curl --max-time 3 -s http://127.0.0.1:4444/status
```

## Create a session

```bash
curl --max-time 10 -s -X POST http://127.0.0.1:4444/session \
  -H 'Content-Type: application/json' \
  -d '{"capabilities":{"alwaysMatch":{"browserName":"safari"}}}'
```

The response includes `sessionId`.

## Set viewport

Desktop:

```bash
curl --max-time 10 -s -X POST http://127.0.0.1:4444/session/<id>/window/rect \
  -H 'Content-Type: application/json' \
  -d '{"width":1440,"height":1180,"x":0,"y":40}'
```

Mobile:

```bash
curl --max-time 10 -s -X POST http://127.0.0.1:4444/session/<id>/window/rect \
  -H 'Content-Type: application/json' \
  -d '{"width":390,"height":844,"x":40,"y":40}'
```

## Load the preview with cache busting

```bash
curl --max-time 10 -s -X POST http://127.0.0.1:4444/session/<id>/url \
  -H 'Content-Type: application/json' \
  -d '{"url":"http://127.0.0.1:8000/?review=check1"}'
```

Use a new query string when Safari is holding stale assets.

## Execute a DOM check

Example: run terminal commands and inspect the prompt/output.

```bash
curl --max-time 10 -s -X POST http://127.0.0.1:4444/session/<id>/execute/sync \
  -H 'Content-Type: application/json' \
  -d '{"script":"var input=document.getElementById(\"terminal-input\");var form=document.getElementById(\"terminal-form\");var output=document.getElementById(\"terminal-output\");function run(cmd){input.value=cmd;form.dispatchEvent(new Event(\"submit\",{bubbles:true,cancelable:true}));return output.innerText;}run(\"clear\");var help=run(\"help\");return {help:help,prompt:document.getElementById(\"terminal-prompt\").innerText};","args":[]}'
```

## Close the session

```bash
curl --max-time 10 -s -X DELETE http://127.0.0.1:4444/session/<id>
```
