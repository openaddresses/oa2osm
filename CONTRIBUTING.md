# Contributing

We ask that all contributions be made via a pull request rather than committing directly to master, to provide other contributors a chance to review proposed changes. If the pull request has not received any attention in a few days, in the interest of not stalling development it can be merged based on your judgement but where possible it should be approved by another contributor being being merged.

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
