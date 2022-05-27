# Frontend SPA

## Getting started

* Clone this repo `git clone git@gitlab.com:interpreters1/frontend.git`
* Navigate to project's directory: `cd frontend/spa_assets`
* Copy application config file: `cp config/application.js.example config/application.js`
* Install npm dependencies: `npm ci`
* Ensure all tests pass: `npm test`
* Start webpack-dev-server: `npm start`

If everything was set up correctly, a tab will open in your default browser and you will be able to navigate the application once it compiles.

## Project structure

### `lib/` - source folder
Contains app-specific JS code, stylesheets, YML translation files, etc. First level of the `lib/` directory primarily contains folders representing entities unique to this application, such as interpreters, searches, orders. Points of interest:

* lib/initialize_spa.js - entry point to the whole application.
* lib/app/app_pages.jsx - all pages currently available in the application with their respective web-routes.
* lib/app/routes.js - all public web-routes currently available in the application.
* lib/app/\_styles/utils - contains app's shared sass utilities and helpers, such as mixins and variables.

### `test/` - test folder

### `vendor/` - contains third-party assets such as fonts or stylesheets. 
Currently, **all** images and fonts must be put in this folder and not in `lib/` due to this application being a part of rails server's asset pipeline.

## Common contribution guidelines

* Use underscore_notation for naming both folders and files within the project
* Ensure `npm test` passes if you're changing existing .js or .jsx files
* Dont let source files grow too big, be it JS or sass, avoid having more than \~200 lines of logic in one single file, it's always better to extract some of that logic into a separate file or even a directory!

## JavaScript contribution guidelines
* Make sure your code editor can run eslint and picks up project's .eslintrc.js file
* Avoid relative imports in most cases. This project uses [module-resolver plugin](https://github.com/tleunen/babel-plugin-module-resolver) with `lib/` directory as root and `vendor/` directory as an alias
* Prefer `let` over `const` unless your variable is semantically a constant, as in `const PROJECT_ROOT = "./lib";`
* Only use index.js files to re-export a better named file from the same directory, as in `export { default as DatePicker } from "./date_picker";`, don't put actual code in index.js files

## Sass contribution guidelines
* This project uses scss syntax over sass syntax
* This project is built on [bulma](https://bulma.io/) and tries to re-use [bulma's utilities](https://github.com/jgthms/bulma/tree/master/sass/utilities)(such as mixins and colors). Before writing your mixin, check if bulma doesn't already have it.
* Do not use @import rules, prefer [@use rules](https://sass-lang.com/documentation/at-rules/use) instead
* Avoid relative imports in most cases. `lib/` and `node_modules/` directories are added to sass compiler's [includePaths option](https://sass-lang.com/documentation/js-api#includepaths), which makes, for example, a `lib/app/_styles/utils/colors.scss` file available via `@use "app/_styles/utils/colors";` in any part of the project
* Stylesheets must always be put into `_styles` directory. e.g `lib/search/_styles` `lib/search/interpreter/_styles` `lib/app/_styles` and so on
* Put *all* static files(such as fonts and images) into a corresponding directory within `vendor/` and not into `lib/`

## Example contribution 
Lets say we wanted to add a new page into our application, for example, a page for displaying searches. This section describes the basics of such process.

### Adding SearchPage
Since we probably do not have the Search resource in the application yet, lets create a directory for it first:

```cmd
mkdir lib/search
```

Now lets create a React template for our SearchPage in that directory:

```jsx
// lib/search/search_page.jsx
import React from "react";

export default function SearchPage() {
  return (
    <div className="search-page">
      <span>Hello from SearchPage!</span>
    </div>
  );
};

```

Next we will need to display this page in our application at appropriate route. The simplest way to do that is to add our page and its route directly to `lib/app/app_pages.jsx` file:

```jsx
// lib/app/app_pages.jsx
// ... other imports ...
import SearchPage from "search/search_page";

export default function AppPages() {
  return (
    <Switch>
      <AppPageRoute exact path="/searches/:id"><AppPage page={SearchPage}/></AppPageRoute>
      {// ... other pages ...}
    </Switch>
  );
}
```

At this point it's probably a good idea to check that we haven't broken any existing route in our app. This can be done by running tests with `npm test` command. The tests should pass and now we can navigate to http://localhost:8080/searches/123 in our browser. It should display "Hello from SearchPage!" if [webpack-dev-server](#getting-started) is running and everything was set up correctly.

### Styling SearchPage
Currently our page remains completely unstyled, so lets go ahead and style it. First we'll need a separate directory for stylesheets:

```cmd
mkdir lib/search/_styles
```

Now we can add our first sass stylesheet:

```scss
// lib/search/_styles/search_page.scss
@use "app/_styles/utils/colors" as c;
@use "app/_styles/utils/text";

.search-page {
  @include text.unselectable;
  background-color: c.$interpreters-green;
  color: c.$interpreters-yellow;
}
```

However, the stylesheet itself is not yet included in our application yet and SearchPage's appearance wont change. To fix that, we'll need to open the search_page.jsx file we created earlier and import the stylesheet in there:

```jsx
// lib/search/search_page.jsx
// note the .scss extension - it's required when importing non-js files such as stylesheets
import "search/_styles/search_page.scss"; 
import React from "react";

// ... other code ...
```

Navigate back to search page in your browser to see that its appearance has indeed changed.
