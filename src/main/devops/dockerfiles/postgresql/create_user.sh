#!/bin/bash
set -e

POSTGRES="psql --username ${POSTGRES_USER}"

$POSTGRES <<-EOSQL
CREATE USER jobservice WITH CREATEDB PASSWORD 's3cr3t';
CREATE USER referenceservice WITH CREATEDB PASSWORD 's3cr3t';
CREATE USER candidateservice WITH CREATEDB PASSWORD 's3cr3t';
EOSQL
