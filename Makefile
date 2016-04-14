test:
	node tests/integration-tests.js

pushall:
	git push origin master && npm publish
