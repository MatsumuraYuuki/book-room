#!/bin/bash
set -e


rm -f /book-room/tmp/pids/server.pid


exec "$@"