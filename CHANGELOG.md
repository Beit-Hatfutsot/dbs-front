# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.9.11] - 2016-11-29
### Fixed
- Recentley viewed thumbnails are back
- Clear Europeana search result when sending a new search term
- Add feedback message for unchanged person search
- "Add to My story" button is no longer confused by items already in the story

## [0.9.10] - 2016-11-16
### Added
- Add Hebrew "Add to My Story" button 
- Display notification for items that only exist in one language
- A migration process now runs every 5 minutes, bringing new data from BHP
- Person URL now includes a tree version to better support updating of trees

### Fixed
- Fix Internet Explorer display issues
- On Item Page, display thumbnails for places
- Fix fetch more persons when query contains modificators

### Changed
- Redesign homepage
- Make MJS homepage for signed-in users
- Improve navigation in recently viewed
- Split "Images & Videos" tab in search ressults
- Related items are based only on BHP data

## [0.9.9] - 2016-09-07
### Added
- meta tags for item and my story pages
- caching for collections (in the API server)

### Fixed
- Consecutive searches - #161
- Clear the page title before navigation
- Fix username on public view of a User's MJS
- Tree drag and release - #76

### Changed
- Redesign subheader
- My Story: the entire line clickable when adding/removing an item to/from branch

### API Server Fixes
- `/login`: Validate `next` when creating a user,
    fixing cases where the login link was in `next` and the user is locked out
- `/user`: remove POST

## [0.9.8] - 2016-08-16
### Added
- A User can share his story
- A User can share another user's story

### Changed
- A User can have a name in both English and Hebrew languages
- A user name can be up to 20 chars long (12 before)
- A User can use numeric characters in the MJS tabs.
- Luminaries urls begins with `/luminary'

### Fixed
- Fix Internet Explorer display issues
- Family tree welcome dialog appears one per session

## [0.9.7] - 2016-07-11
### Added
- A User can add persons to his story

## [0.9.6] - 2016-06-29
### Added
- Display Photo Unit Number

### Changed
- Using `gulp` instead of `grunt` for devOps
- Using GTM instead of analytics
- Github ribbon is now redo
- Recently Viewed now displays all the items than it stores
- Typos
- User rename now works as expected (was flaky)
- Limiting branch name in my story to 26 chars
- Unlimit the number of item in my story
- Improved page titles

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
