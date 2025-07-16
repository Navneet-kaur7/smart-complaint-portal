#!/bin/sh
# wait-for-it.sh

set -e

host="$1"
shift
port="$1"
shift
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "Waiting for $host:$port..."
  sleep 1
done

>&2 echo "$host:$port is available"

# Wait for PostgreSQL to be ready
until PGPASSWORD=postgres psql -h "$host" -U postgres -c '\l' > /dev/null 2>&1; do
  >&2 echo "Waiting for PostgreSQL to be ready..."
  sleep 1
done

>&2 echo "PostgreSQL is ready"
exec $cmd