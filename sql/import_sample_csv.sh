#!/usr/bin/env sh

csv_path="csv/*.csv"

if [[ ! -d $csv_path && -f "/.dockerenv" ]]; then
  csv_path=/docker-entrypoint-initdb.d/${csv_path}
else
  csv_path=./${csv_path}
fi

for filename in ${csv_path}; do
  table=$(echo \"$filename\" | sed 's/.*-//;s/\..*//')
  psql -U ${POSTGRES_USER:-postgres} -c "\\copy $table from $filename delimiter ',' csv header"
done
