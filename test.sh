#!/bin/bash
if [ "$1" == "install" ]; then
    npm install --save-dev jest
else
    npm test
fi