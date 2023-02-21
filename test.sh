#!/bin/bash
if [ "$1" == "install" ]; then
    npm install --save-dev
else
    npm test
fi