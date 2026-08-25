# FiveM Artifacts DB

A simple website that keeps a **log of FiveM artifacts with known issues**; and provides a download link to the most recent artifacts if no issues have been reported with it.

## Contributing

There are three main ways to contribute to the DB:
1. (✅ Recommended) Send a report via [our form](https://fadb-reports.internal.jgscripts.com/)
2. [Create an issue](https://github.com/jgscripts/fivem-artifacts-db/issues) with details of the artifact number and what is wrong with it
3. Open a pull request (PR) to update [`db.json`](https://github.com/jgscripts/fivem-artifacts-db/blob/main/db.json) (in the root of this repository), with the artifact number and an explanation of what is wrong with it

Please provide some evidence which shows what is broken - a link to a Cfx GitHub issue, screenshots or error logs would be ideal.

## API

A free JSON API is available for checking artifacts programmatically. See the docs at [artifacts.jgscripts.com/api](https://artifacts.jgscripts.com/api).

## FiveM Resource

Want to check your FXServer version hasn't had reported issues every time you start your server? I've written a small standalone script that does just that: https://github.com/jgscripts/jg-artifactcheck

You can steal the code to implement in your resources, or use it directly.

## Website & Sharing

You can share this site with people to help them download the right artifacts here: https://artifacts.jgscripts.com/

If you want to make an improvement to the site itself, feel free to submit a PR with that too :)

## Legal

The code and all database data within this repo is released into the public domain. You can read the full license here: [LICENSE](./LICENSE).

"FiveM" is a copyright and registered trademark of Take-Two Interactive Software, Inc.
