#!/usr/bin/env bash
# Compose side-by-side review images from raw original/migrated screenshots.
#
# Inputs:
#   o-{home,doctor,fachgebiet,krank,news,jobs}.png  — original (127.0.0.1:8080) fullpage
#   m-{home,doctor,fachgebiet,krank,news,jobs}.png  — migrated (eds-migration preview) fullpage
#
# Captured separately via a headless browser at 1440px viewport. To
# regenerate the source screenshots, see audit/side-by-side/HOWTO.md
# or replay the steps from docs/journal/11-block-fidelity.md.
#
# Output: sbs-{template}.png  (composite with banner + 4px separator)

set -euo pipefail
cd "$(dirname "$0")"

FONT="/System/Library/Fonts/Helvetica.ttc"
WIDTH=1425
SEP=4

for tpl in home doctor fachgebiet krankheitsbild news jobs; do
  case "$tpl" in
    krankheitsbild) src="krank" ;;
    *) src="$tpl" ;;
  esac

  [ -f "o-$src.png" ] || { echo "missing o-$src.png — capture it first"; continue; }
  [ -f "m-$src.png" ] || { echo "missing m-$src.png — capture it first"; continue; }

  LABEL=$(echo "$tpl" | tr '[:lower:]' '[:upper:]')
  H=$(magick identify -format "%h " "o-$src.png" "m-$src.png" | awk '{print ($1>$2)?$1:$2}')
  TOTAL_W=$((WIDTH * 2 + SEP))

  magick -size "${TOTAL_W}x60" -background "#222" -fill white -font "$FONT" -gravity center \
    -pointsize 24 "label:ORIGINAL  <-  $LABEL  ->  MIGRATED" \
    /tmp/sbs-banner.png

  magick \
    \( "o-$src.png" -gravity north -background white -extent "${WIDTH}x${H}" \) \
    \( -size "${SEP}x${H}" xc:black \) \
    \( "m-$src.png" -gravity north -background white -extent "${WIDTH}x${H}" \) \
    +append \
    /tmp/sbs-body.png

  magick /tmp/sbs-banner.png /tmp/sbs-body.png -append "sbs-$tpl.png"
  echo "wrote sbs-$tpl.png ($(magick identify -format '%wx%h' "sbs-$tpl.png"))"
done

rm -f /tmp/sbs-banner.png /tmp/sbs-body.png
