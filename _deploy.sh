npm run build
cd dist
zip -r dist.zip ./
scp dist.zip root@167.172.75.71:/var/www/elite-eight/server
echo "dist zip uploaded to server!"
cd ..
rm -rf dist
