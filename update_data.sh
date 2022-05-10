#!/bin/bash

python3.9 scripts/data.py

git add .
git commit -m "chore: update DB"
git push