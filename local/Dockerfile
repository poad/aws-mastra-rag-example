FROM postgres:16-bookworm

RUN apt-get update && \
  apt-get install -y git make gcc postgresql-server-dev-16

RUN cd /tmp && \
  git clone --branch v0.7.2 https://github.com/pgvector/pgvector.git && \
  cd pgvector && \
  make && \
  make install && \
  cd ../ && rm -rf pgvector
