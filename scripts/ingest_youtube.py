#!/usr/bin/env python3
"""
Ingest a YouTube video into MovieArena's media server.

    YouTube  ->  yt-dlp  ->  ffmpeg  ->  media/videos/<id>.mp4
                                  '-->  media/catalog.json  ->  MovieArena

The app then streams or downloads the MP4 from our own server; nothing in the
player ever links back out to YouTube.

    # full video, capped at 360p so files stay small
    python3 scripts/ingest_youtube.py "https://www.youtube.com/watch?v=XXXX"

    # first 12 seconds only — handy for smoke-testing playback + download
    python3 scripts/ingest_youtube.py "https://youtu.be/XXXX" --slice 12

    # register an id that is already in media/videos/
    python3 scripts/ingest_youtube.py "https://youtu.be/XXXX" --reuse clip-01.mp4

Only ingest material you have the right to store and serve.
"""
import argparse
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MEDIA = os.path.join(ROOT, "media")
VIDEOS = os.path.join(MEDIA, "videos")
CATALOG = os.path.join(MEDIA, "catalog.json")
POSTER_DIR = os.path.join(MEDIA, "posters")

CLIPS = [f"videos/clip-0{i}.mp4" for i in range(1, 7)] + ["videos/tiny.mp4"]

EPISODE_NAMES = [
    "The Awakening", "A Borrowed Power", "The First Trial", "Ashes of the Clan",
    "The Silent Market", "A Blade in the Dark", "The Elder's Secret", "Blood and Ink",
    "The Long Descent", "What the River Kept", "Before the Storm", "The Road Home",
    "A Debt of Iron", "The Last Lantern", "Two Oaths", "The Hollow Crown",
    "Ember and Salt", "The Weight of a Name", "A Door in the Rain", "The Quiet Village",
    "Old Wounds", "The High Pass", "Names in the Snow", "The Second Gate",
]


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:60] or "untitled"


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw)


def probe(path: str):
    out = run([
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration,size:stream=codec_name,width,height",
        "-of", "json", path,
    ]).stdout
    data = json.loads(out)
    fmt = data.get("format", {})
    stream = next((s for s in data.get("streams", []) if s.get("width")), {})
    return {
        "duration": round(float(fmt.get("duration", 0)), 2),
        "size": int(fmt.get("size", 0)),
        "codec": stream.get("codec_name", ""),
        "width": stream.get("width", 0),
        "height": stream.get("height", 0),
    }


def download(video_id: str, dest: str, slice_seconds=None) -> dict:
    """yt-dlp -> temp mp4, then ffmpeg -> compact faststart mp4 at `dest`."""
    import yt_dlp

    tmp = dest + ".src.mp4"
    url = f"https://www.youtube.com/watch?v={video_id}"

    opts = {
        "format": "bv*[height<=360][ext=mp4]+ba[ext=m4a]/b[height<=360][ext=mp4]/b",
        "merge_output_format": "mp4",
        "outtmpl": tmp,
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
    }
    if slice_seconds:
        # Grab just the head of the file — keeps test clips a few KB.
        opts["download_ranges"] = yt_dlp.utils.download_range_func(
            None, [(0, int(slice_seconds))]
        )
        opts["force_keyframes_at_cuts"] = True

    print(f"  yt-dlp: {url} -> {os.path.basename(tmp)}")
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])
    if not os.path.exists(tmp):
        raise RuntimeError("yt-dlp produced no file")

    # Re-encode so every file is baseline-profile H.264 with faststart: small,
    # instantly playable, and byte-range friendly for streaming + download.
    run([
        "ffmpeg", "-y", "-loglevel", "error", "-i", tmp,
        "-vf", "scale='min(640,iw)':-2",
        "-c:v", "libx264", "-profile:v", "baseline", "-level", "3.0",
        "-preset", "veryfast", "-crf", "30",
        "-c:a", "aac", "-b:a", "64k", "-ac", "2",
        "-movflags", "+faststart", dest,
    ])
    os.remove(tmp)
    return probe(dest)


def load_catalog() -> dict:
    if os.path.exists(CATALOG):
        with open(CATALOG, encoding="utf-8") as fh:
            return json.load(fh)
    return {"version": 1, "generatedAt": "", "source": "", "titles": []}


def save_catalog(cat: dict) -> None:
    cat["generatedAt"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    with open(CATALOG, "w", encoding="utf-8") as fh:
        json.dump(cat, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


def main() -> int:
    ap = argparse.ArgumentParser(description="Ingest a YouTube video into media/")
    ap.add_argument("url", help="YouTube URL or id")
    ap.add_argument("--title", help="Display title (defaults to the video title)")
    ap.add_argument("--id", dest="title_id", help="Catalog id (defaults to a slug)")
    ap.add_argument("--slice", type=int, metavar="SECONDS",
                    help="Only take the first N seconds (small test clip)")
    ap.add_argument("--reuse", metavar="FILE",
                    help="Skip download; register an existing file in media/videos/")
    ap.add_argument("--episodes", type=int, default=24,
                    help="Episode rows to generate (default 24)")
    ap.add_argument("--genres", default="Animation,Action",
                    help="Comma-separated genre tags")
    args = ap.parse_args()

    m = re.search(r"(?:v=|youtu\.be/|shorts/|embed/)([A-Za-z0-9_-]{11})", args.url)
    video_id = m.group(1) if m else (args.url if re.fullmatch(r"[A-Za-z0-9_-]{11}", args.url) else None)
    if not video_id:
        print("error: could not read a YouTube video id from", args.url, file=sys.stderr)
        return 2

    os.makedirs(VIDEOS, exist_ok=True)
    os.makedirs(POSTER_DIR, exist_ok=True)

    title = args.title or f"Video {video_id}"
    title_id = args.title_id or slugify(title)
    poster = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"

    if args.reuse:
        rel = f"videos/{os.path.basename(args.reuse)}"
        dest = os.path.join(VIDEOS, os.path.basename(args.reuse))
        if not os.path.exists(dest):
            print(f"error: {dest} not found", file=sys.stderr)
            return 2
        info = probe(dest)
    else:
        rel = f"videos/{title_id}.mp4"
        dest = os.path.join(VIDEOS, f"{title_id}.mp4")
        print(f"ingesting {video_id} -> {rel}")
        info = download(video_id, dest, args.slice)

    # Grab the thumbnail too so the app has a local poster fallback.
    poster_rel = f"posters/{title_id}.jpg"
    poster_path = os.path.join(POSTER_DIR, f"{title_id}.jpg")
    try:
        run(["curl", "-sSL", "--max-time", "20", "-o", poster_path, poster])
        if os.path.getsize(poster_path) < 1024:
            os.remove(poster_path)
            poster_rel = poster
    except Exception:
        poster_rel = poster

    cat = load_catalog()
    cat["titles"] = [t for t in cat.get("titles", []) if t.get("id") != title_id]

    genres = [g.strip() for g in args.genres.split(",") if g.strip()]
    take = max(1, min(args.episodes, 24))
    episodes = [
        {
            "number": i + 1,
            "name": EPISODE_NAMES[i % len(EPISODE_NAMES)],
            "time": "24m",
            "video": rel,
            "poster": poster_rel,
        }
        for i in range(take)
    ]

    cat["titles"].append({
        "id": title_id,
        "title": title,
        "meta": f"{args.episodes} episodes · SUB · DUB",
        "synopsis": f"Ingested from YouTube ({video_id}) and served by the MovieArena media server.",
        "channel": "Ingested",
        "genres": genres,
        "badges": [{"label": "NEW", "kind": "hot"}],
        "tone": (len(cat["titles"]) % 6) + 1,
        "progress": 0,
        "youtubeId": video_id,
        "poster": poster_rel,
        "video": rel,
        "episodeCount": args.episodes,
        "episodes": episodes,
        "source": "YouTube",
        "sourceUrl": f"https://www.youtube.com/watch?v={video_id}",
        "file": {
            "path": rel,
            "bytes": info["size"],
            "duration": info["duration"],
            "codec": info["codec"],
            "width": info["width"],
            "height": info["height"],
        },
    })
    save_catalog(cat)

    kb = info["size"] / 1024
    print(f"  {rel}: {info['codec']} {info['width']}x{info['height']} "
          f"{info['duration']}s, {kb:.1f} KB")
    print(f"  catalog.json now has {len(cat['titles'])} titles")
    return 0


if __name__ == "__main__":
    sys.exit(main())
