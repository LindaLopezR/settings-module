// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by settings-module.js.
import { name as packageName } from "meteor/settings-module";

// Write your tests here!
// Here is an example.
Tinytest.add('settings-module - example', function (test) {
  test.equal(packageName, "settings-module");
});
