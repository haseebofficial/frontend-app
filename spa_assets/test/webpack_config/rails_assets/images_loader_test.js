import test from "tape";
import { imageImportMatcher, replaceImageImportWithAssetUrl } from "webpack_config/rails_assets/images_loader";

test("rails assets image loader", function(t) {
  t.test("imageImportMatcher", function(t) {
    t.test("matches vendor image imports", function(t) {
      let match = 'import logo from "vendor/images/logo.png"'.match(imageImportMatcher);

      t.true(match);

      t.end();
    });

    t.test("doesn't match non-vendor image imports", function(t) {
      let match = 'import image from "logo.png"'.match(imageImportMatcher);

      t.false(match);
    
      t.end();
    });

    t.test("matches any number of spaces", function(t) {
      let match = 'import   logo   from   "vendor/images/logo.png"'.match(imageImportMatcher);

      t.true(match);
    
      t.end();
    });

    t.test("matches singular quotes", function(t) {
      let match = "import logo from 'vendor/images/logo.png'".match(imageImportMatcher);

      t.true(match);
    
      t.end();
    });
  });

  t.test("replaceImageImportWithAssetUrl", function(t) {
    t.test("replaces imports", function(t) {
      let result = replaceImageImportWithAssetUrl("import logo from 'vendor/images/logo.png'");

      t.equal(result, `let logo = "<%= asset_path('spa_assets/logo.png') %>"`);
  
      t.end();
    });
  });
});