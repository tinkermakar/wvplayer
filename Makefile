include .env

ifndef WVPLAYER_CI_HOST
$(error WVPLAYER_CI_HOST is not set)
endif

ifndef WVPLAYER_DEPLOY_DIR
$(error WVPLAYER_DEPLOY_DIR is not set)
endif

docker = docker --host ssh://$(WVPLAYER_CI_HOST) compose

deploy:
	$(MAKE) copy
	$(MAKE) up-build

up-build:
	$(docker) up --build --force-recreate -d

logs:
	$(docker) logs -f

copy:
	scp .env docker-compose.yml $(WVPLAYER_CI_HOST):$(WVPLAYER_DEPLOY_DIR)/
