#!/usr/bin/env bash

. ./.env;
npm run build && npm run s3-sync && npm run cf-invalidate;
