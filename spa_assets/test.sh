#!/bin/bash

NODE_ENV=test node_modules/.bin/enhanced-tape-runner test/browser_tape/setup_dom.js "$@" | node_modules/.bin/tap-spec-dot