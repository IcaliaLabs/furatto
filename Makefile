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
