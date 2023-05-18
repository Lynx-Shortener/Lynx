# Changelog

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
