FURATTO = ./css/furatto.css
FURATTO_SASS = ./scss/furatto.scss
DATE = $(shell date +%I:%M%p)
CHECK = \033[32m✔\033[39m
HR = ---------------------------------------------------


# Build Docs #

build:
	@echo "\n${HR}"
	@echo "Cooking furatto..."
	@echo "${HR}\n"
	@compass compile -c production_config.rb --force
	@echo "Spicing things with Compass...               ${CHECK}"
	@cat js/dropdown.js js/jpanel.js js/jquery.avgrund.js js/jquery.dropkick-1.0.0.js js/jquery.icheck.js js/jquery.tagsinput.js js/jquery.toolbar.js js/legacy.js js/picker.js js/picker.date.js js/picker.time.js js/rainbow-custom.min.js js/responsive-tables.js js/responsiveslides.js js/tooltip.js > js/furatto.js
	@./node_modules/.bin/uglifyjs -nc js/furatto.js > documentation/assets/js/furatto.min.tmp.js
	@cat documentation/assets/js/furatto.min.tmp.js > documentation/assets/js/furatto.min.js
	@rm documentation/assets/js/furatto.min.tmp.js
	@echo "Compiling and minifiying JS...               ${CHECK}"
	@cp -r fonts documentation/assets/
	@echo "Copying fonts to assets...                   ${CHECK}"
	@echo "\n${HR}"
	@echo "Furatto was successfully built at ${DATE}"
	@echo "${HR}\n"
	@echo "Thanks for using Furatto."
	@echo "Lov @kurenn and @icalialabs\n"
