# Changelog

## [1.10.1] - 2024-06-05

- Update new user password regex to match regex internally and on registration page

## [1.10.0] - 2024-05-28

- Allow for 63 character TLDs, as per DNS spec

## [1.9.2] - 2024-05-14

- Improve password regex to accept OWASP characters 

## [1.9.1] - 2024-03-26

- Remove vite-plugin-rewrite-all
- Update to Vite 5

## [1.9.0] - 2024-03-26

- Make slug copy/open more obvious
- [Bunch of version updates](https://github.com/Lynx-Shortener/Lynx/issues/142)

## [1.8.1] - 2024-02-14

- Update socks to 2.7.3
  - Fixes [CVE-2023-29400]([CVE-2023-42282](https://github.com/advisories/GHSA-78xj-cgh5-2h22))

## [1.8.0] - 2023-08-22

- [#86](https://github.com/Lynx-Shortener/Lynx/issues/86) Add updating of other user's details as an admin, including:
  - username
  - email
  - password
- Improve responsiveness for narrow (but non-mobile) screens
- Consistently use array format for fontawesome icons
- Add tabbed layout to Settings and split into own components
- Add preferences page with option to reduce popups ([#105](https://github.com/Lynx-Shortener/Lynx/issues/105))
- Bug fixes:
  - Admins were not able to update standard user's roles, this has been resolved.
  - Admins are no longer able to see other admin's links.
  - Give value to color-4 in dark-mode.
 
## [1.7.4] - 2023-12-30

- Properly assign the author of links uploaded via the ShareX endpoint

## [1.7.3] - 2023-08-21

- Bug fixes:
  - Fix user deletion button visibility on desktop
- Promote the oldest user to owner if no owner exists - used for upgrades from old versions
- No longer require DB_USER and DB_PASSWORD

## [1.7.2] - 2023-08-18

- Add user creation button on user management page
- Bug fixes:
  - Fixed hidden icons on mobile

## [1.7.1] - 2023-08-12

- Switch to pnpm
- Bug fixes:
  - Fix backup solution to they're saved to /app/backups not /app/src/backups (Introduced in 1.7.0)
  - Importing internal error when importing CSVs from refactor implementing ESLint.
  - Fix 2fa verification middleware
  - Remove unnecessary scrollbars
- Make users page responsive

## [1.7.0] - 2023-08-10

- Add user-management page

## [1.6.0] - 2023-07-29

- Add environment variable URL_REGEX to allow for custom URL regexes
- Verify URL on link update
- Edit release script to not include version header in releases

## [1.5.4] - 2023-06-27

- More uniform Umami tracking with better error handling
- Force update semver to ^7.5.2 until bcrypt and jwt update it themselves. Resolves [CVE-2022-25883](https://github.com/advisories/GHSA-c2qf-rxjj-qqgw)

## [1.5.3] - 2023-05-28

- Fix context menu item flow

## [1.5.2] - 2023-05-26

- Update README to include documentation link

## [1.5.1] - 2023-05-23

- Show link count on non-admin accounts
- Add new link to top of list
- Make checkbox more visible in dark mode

## [1.5.0] - 2023-05-18

- Add backup functionality

## [1.4.4] - 2023-05-18

- Lynx Website Version Updater: Add apostrophe onto end of curl request

## [1.4.3] - 2023-05-18

- Use LF line endings
- Move lynx website version updater to one line

## [1.4.2] - 2023-05-18

- Update dockerfile to use distroless image
- Update website on new release

## [1.4.1] - 2023-05-16

- Re-fetch about on login
- Severely reduce docker image size 954MB => 203MB

## [1.4.0] - 2023-05-16

- Added [umami](https://umami.is/) support

## [1.3.12] - 2023-05-15

- Improve link status codes and messages

## [1.3.11] - 2023-05-10

- Provide release workflow PAT token

## [1.3.10] - 2023-05-10

- Use PAT instead of GITHUB_TOKEN when creating release
- Change Semver script to output new version

## [1.3.9] - 2023-05-08

- Properly handle logouts
  - Logout would not properly work in local environment
- Add about section to settings page
- Properly use FormKit to disable form button while loading
- Add github actions:
  - Updating LICENSE year automatically
  - Creating release on GitHub when PR merged

## [1.3.8] - 2023-05-04

- Set image to lynx:1 in docker-compose example

## [1.3.7] - 2023-05-02

- Add vite-plugin-rewrite-all to frontend

## [1.3.6] - 2023-05-02

- Remove vite-plugin-rewrite-all for API, not needed and meant for frontend.

## [1.3.5] - 2023-05-02

- Update versioning to use SemVer

## [1.3.4] - 2023-05-01

- Resolve bug that'd delete links on startup without being in demo mode from version 1.3.3

## [1.3.3] - 2023-04-30

- Change CRON job to only start job in demo mode for better performance

## [1.3.2] - 2023-04-30

- Use qrcode.vue instead of qrcode script to fix issue loading

## [1.3.1] - 2023-04-30

- Disallow TOTP in demo mode

## [1.3.0] - 2023-04-30

- Add TOTP

## [1.2.1] - 2023-04-18

- Add CORS option and headers

## [1.2.0] - 2023-03-31

- Switch to HTTP only cookies

## [1.1.0] - 2023-01-23

- Add demo mode

## [1.0.0] - 2022-12-16

First release, production ready

- Facelift

## [Indev] - 2022-12-10 - 2022-12-16

- Main framework of Lynx
- Import/Export
- Add ShareX support

