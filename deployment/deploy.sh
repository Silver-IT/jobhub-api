cd /home/ubuntu/job-hub-api
git checkout prod 
git pull
npm install
npm run build
sudo pm2 restart jdlandscaping-api
exit
