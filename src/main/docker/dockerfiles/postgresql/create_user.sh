#!/bin/bash
set -e

POSTGRES="psql --username ${POSTGRES_USER}"

$POSTGRES <<-EOSQL
CREATE USER jobservice WITH CREATEDB PASSWORD '';
CREATE USER referenceservice WITH CREATEDB PASSWORD '';
EOSQL
