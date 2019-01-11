fonts := $(addsuffix /index.json,$(wildcard fonts/*))

all: \
	node_modules/get-options \
	fonts/sun-gallant/index.json \
	$(fonts)

%/index.json: %/glyphs.js %/encoding.js
	[ -f "$(@D)/build.opts" ] && opts=`sed -e's/^#.*//g' $(@D)/build.opts` || opts=""; \
	./tools/build-font-map.js $$opts $^ > $@

# Install/link dependencies
node_modules:; [ -d $@ ] || mkdir $@
node_modules/get-options: node_modules
	ln -fs ~/Labs/GetOptions $@ || npm install get-options

# Wipe generated files
clean:
	rm -f $(fonts)
.PHONY: clean
