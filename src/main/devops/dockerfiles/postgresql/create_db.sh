#!/bin/bash
set -e

POSTGRES="psql --username ${POSTGRES_USER}"

$POSTGRES <<-EOSQL
CREATE DATABASE jobservice OWNER jobservice;
CREATE DATABASE referenceservice OWNER referenceservice;
EOSQL
