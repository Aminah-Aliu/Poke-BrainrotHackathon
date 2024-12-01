#!/bin/bash

# Define the end date
END_DATE="2024-12-08"

# Get the current date
CURRENT_DATE=$(date +%Y-%m-%d)

# Compare dates
if [[ "$CURRENT_DATE" > "$END_DATE" ]]; then
  echo "Stopping script: current date ($CURRENT_DATE) is past end date ($END_DATE)."
  crontab -l | grep -v "call_endpoint_with_limit.sh" | crontab -
  exit 0
fi

# Call the endpoint
curl -X GET https://poke-brainrothackathon-be.onrender.com/contacts
# Will error out bc no auth, but will keep the service fresh
