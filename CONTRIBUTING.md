# Releasing

- Bump package.json version
- `git add package.json`
- `git commit -m 'vX.X.X'`
- `git tag -a X.X.X -m 'X.X.X'`
- `git push`
- `git push --tags`
- In a new directory somewhere to ensure a fresh publish
- `git clone https://github.com/openaddresses/oa2osm.git`
- `cd oa2osm`
- `git checkout X.X.X`
- `npm publish`
