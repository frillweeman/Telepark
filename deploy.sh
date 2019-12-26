# build all react projects
npm run --prefix ui build
npm run --prefix signage-player build

# deploy everything
firebase deploy
