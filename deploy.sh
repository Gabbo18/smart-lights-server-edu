tar -cvf ./deploy.tar --exclude='node_modules' --exclude='samples' --exclude='env' ./*
caprover deploy -t ./deploy.tar
rm -r ./deploy.tar