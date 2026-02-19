# FiveM Artifacts DB

A simple website that keeps a **log of FiveM artifacts with known issues**; and provides a download link to the most recent artifacts if no issues have been reported with it.

## Contributing

Make a pull request (PR) to update [`db.json`](https://github.com/jgscripts/fivem-artifacts-db/blob/main/db.json) (in the root of this repository), with the artifact number and an explanation of what is wrong with it. We will review it ASAP and merge your contribution which will automatically update the site.

If you are not comfortable making a PR, could you also [create an issue](https://github.com/jgscripts/fivem-artifacts-db/issues) or send an email to [hello@jgscripts.com](mailto:hello@jgscripts.com) with details of the artifact bug. We will review your report and update the database.

Please provide some evidence which shows what is broken - a link to a Cfx GitHub issue, screenshots or error logs would be ideal.

## API

All endpoints return JSON responses.

### `GET /check`

Check if a specific artifact has any reported issues.

**Query Parameters**

| Parameter  | Type     | Required | Description                    |
| ---------- | -------- | -------- | ------------------------------ |
| `artifact` | `string` | Yes      | The artifact number to look up |

**Response**

```json
{
  "status": "OK"
}
```

```json
{
  "status": "BROKEN",
  "reason": "Description of the issue"
}
```

### `GET /jsonv2`

Returns all broken artifacts, download links, and the recommended stable artifact.

**Response**

```json
{
  "recommendedArtifact": "12345",
  "windowsDownloadLink": "https://...",
  "linuxDownloadLink": "https://...",
  "brokenArtifacts": [
    { "artifact": "8509", "reason": "State bags not replicated to clients" },
    { "artifact": "10268-10309", "reason": "..." }
  ]
}
```

| Field                 | Type                                   | Description                                        |
| --------------------- | -------------------------------------- | -------------------------------------------------- |
| `recommendedArtifact` | `string`                               | Latest artifact with no reported issues             |
| `windowsDownloadLink` | `string`                               | Direct download URL for Windows server build        |
| `linuxDownloadLink`   | `string`                               | Direct download URL for Linux server build          |
| `brokenArtifacts`     | `{artifact: string, reason: string}[]` | Sorted array of artifacts with known issues         |

> **Note:** A legacy endpoint is available at `GET /json` which returns `brokenArtifacts` as an object instead of an array. New integrations should use `/jsonv2`.

## FiveM Resource

Want to check your FXServer version hasn't had reported issues every time you start your server? I've written a small standalone script that does just that: https://github.com/jgscripts/jg-artifactcheck

You can steal the code to implement in your resources, or use it directly.

## Website & Sharing

You can share this site with people to help them download the right artifacts here: https://artifacts.jgscripts.com/

If you want to make an improvement to the site itself, feel free to submit a PR with that too :)

## Legal

The code and all database data within this repo is released into the public domain. You can read the full license here: [LICENSE](./LICENSE).

"FiveM" is a copyright and registered trademark of Take-Two Interactive Software, Inc.
