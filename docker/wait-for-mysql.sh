#!/bin/sh
# wait-for-mysql.sh
# A script to wait for MySQL to be ready

set -e

host="$1"
shift
cmd="$*"

until nc -z "$host" "${host#*:}"; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "MySQL is up - executing command"
exec $cmd
