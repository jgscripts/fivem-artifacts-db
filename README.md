# FiveM Artifacts DB

A simple website that keeps a **log of FiveM artifacts with known issues**; and provides a download link to the most recent artifacts if no issues have been reported with it.

## Contributing

Make a pull request (PR) to update [`db.json`](https://github.com/jgscripts/fivem-artifacts-db/blob/main/db.json) (in the root of this repository), with the artifact number and an explanation of what is wrong with it. We will review it ASAP and merge your contribution which will automatically update the site.

If you are not comfortable making a PR, could you also [create an issue](https://github.com/jgscripts/fivem-artifacts-db/issues) or send an email to [hello@jgscripts.com](mailto:hello@jgscripts.com) with details of the artifact bug. We will review your report and update the database.

Please provide some evidence which shows what is broken - a link to a Cfx GitHub issue, screenshots or error logs would be ideal.

## API

- **`/check?artifact=XXXX`: Check specific artifact to see if it has a reported issue**

  **Response**

  | **Name** | **Type**                    |
  | -------- | --------------------------- |
  | `status` | `"OK"` or `"BROKEN"`        |
  | `reason` | `string` (only if "BROKEN") |

- **`/json`: Full site in JSON format (all broken artifacts, download links, recommend stable artifacts)**

  **Response**

  | **Name**              | **Type** |
  | --------------------- | -------- |
  | `recommendedArtifact` | `string` |
  | `windowsDownloadLink` | `string` |
  | `linuxDownloadLink`   | `string` |
  | `brokenArtifacts`     | `object` |

## FiveM Resource

Want to check your FXServer version hasn't had reported issues every time you start your server? I've written a small standalone script that does just that: https://github.com/jgscripts/jg-artifactcheck

You can steal the code to implement in your resources, or use it directly.

## Website & Sharing

You can share this site with people to help them download the right artifacts here: https://artifacts.jgscripts.com/

If you want to make an improvement to the site itself, feel free to submit a PR with that too :)
