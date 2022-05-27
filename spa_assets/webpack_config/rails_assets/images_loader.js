export let imageImportMatcher = buildImageImportMatcher();

function buildImageImportMatcher() {
  let s =  '\\s+';
  let q = `["']`;
  let varName = '(.+)';
  let importPath = `${q}vendor/images/(.+)${q}`;

  return `import${s}${varName}${s}from${s}${importPath}`;
}

export function replaceImageImportWithAssetUrl(imageImport) {
  let match = imageImport.match(imageImportMatcher);
  let [, varName, imageName] = match;

  return `let ${varName} = "<%= asset_path('spa_assets/${imageName}') %>"`;
}