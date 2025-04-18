#!/bin/env bash 

export PGPASSWORD="$POSTGRES_PASSWORD"
psql -h "$POSTGRES_HOST" --port "$POSTGRES_PORT" -U "$POSTGRES_USER" -c "CREATE EXTENSION vector;"
psql -h "$POSTGRES_HOST" --port "$POSTGRES_PORT" -U "$POSTGRES_USER" -c "CREATE DATABASE \"$POSTGRES_DATABASE\" WITH OWNER \"$POSTGRES_USER\" ENCODING = 'UTF8';"

npm run start
