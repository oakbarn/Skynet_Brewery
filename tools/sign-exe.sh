#!/usr/bin/env bash
# Signs one Windows .exe with Azure Artifact Signing (Microsoft's code signing, formerly Trusted Signing), using Jsign
# (MIT License, Copyright (c) OakBarn Brewery 2026). See docs/Code_Signing_Setup.md.
# The Setup build (install/windows/SkynetBrewer.nsi) runs this on the Setup .exe and on the Uninstall .exe inside it,
# but only when tools/build-release.sh finds all of these set (the release workflow sets them):
#   SKYNET_SIGN_JAR       the Jsign .jar file
#   SKYNET_SIGN_ENDPOINT  the signing address of the Azure region, e.g. eus.codesigning.azure.net
#   SKYNET_SIGN_ACCOUNT   the Artifact Signing account name
#   SKYNET_SIGN_PROFILE   the certificate profile name
#   SKYNET_SIGN_TOKEN     a short-lived Azure sign-in (access token) for https://codesigning.azure.net
#   SKYNET_SIGN_LOG       a file where each result is written ("signed <file>" or "FAILED <file>")
# It never stops the build: if signing fails, the .exe stays unsigned and the log says FAILED.
# Usage: bash tools/sign-exe.sh <file.exe> [name to show in the log]
FILE="$1"
LOG="${SKYNET_SIGN_LOG:-/dev/null}"
NAME="${2:-$(basename "$FILE")}"
ENDPOINT="${SKYNET_SIGN_ENDPOINT#https://}"
ENDPOINT="${ENDPOINT%/}"
if java -jar "$SKYNET_SIGN_JAR" \
     --storetype TRUSTEDSIGNING \
     --keystore "$ENDPOINT" \
     --storepass "$SKYNET_SIGN_TOKEN" \
     --alias "$SKYNET_SIGN_ACCOUNT/$SKYNET_SIGN_PROFILE" \
     --tsaurl http://timestamp.acs.microsoft.com --tsmode RFC3161 \
     --name "Skynet Brewer" --url "https://github.com/oakbarn/Skynet_Brewery" \
     "$FILE" >&2; then
  echo "signed $NAME" >> "$LOG"
  echo "Signed $NAME" >&2
else
  echo "FAILED $NAME" >> "$LOG"
  echo "::warning::Could not sign $NAME, so it was left unsigned. See docs/Code_Signing_Setup.md." >&2
fi
exit 0
