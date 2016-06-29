# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- Display Photo Unit Number

### Changed
- Using `gulp` instead of `grunt` for devOps
- Using GTM instead of analytics

## [0.9.5] - 2016-06-14
### Added
- A Github ribbon
- use gravatar for avatars
- `grunt build-dist` to create a better distribution under `dist/`

### Changed
- '/mjs' is unaccesible for anonymous users
- smoother item remove in mjs
- fix persons search form when switching from "more fields" to "less fields"
- improve google analytics integration so that each state change is recorded
- clear "loading" gif when entering a state
- use unicode's unknown char when missing a person's date
- improve grunt portability (fixing issues with codeship)
- `fab` is now back to deploying on our server, instead of compute storage which
returns 404 for any specific address other then "index.html"
- support up to 50 items in mjs
