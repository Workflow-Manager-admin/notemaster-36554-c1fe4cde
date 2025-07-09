#!/bin/bash
cd /home/kavia/workspace/code-generation/notemaster-36554-c1fe4cde/frontend_notes_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

