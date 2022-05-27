task :before_assets_precompile do
  Dir.chdir('spa_assets') do
    system('npm i && npm run-script build')
  end
end
 
Rake::Task['assets:precompile'].enhance ['before_assets_precompile']