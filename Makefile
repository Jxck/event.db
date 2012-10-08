LIB = lib/*.js
TESTS = test/*.js
CONFIG = config/*

lint:
	fixjsstyle $(LIB) $(TESTS) $(CONFIG) index.js

test:
	@NODE_ENV=test node test/index.js

.PHONY: lint test
