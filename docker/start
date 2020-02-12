#!/bin/sh

set -e

yarn --frozen-lockfile

# Start zenaton agent
zenaton start
zenaton listen --env=.env --boot=boot.js

# Log agent output
touch zenaton.out zenaton.err
tail -f zenaton.*
