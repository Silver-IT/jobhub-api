now=$(date +"%Y%m%d%H%M%S")
pg_dump -U root jobhub > ${now}_jobhub.sql
aws s3 cp ${now}_jobhub.sql s3://jdlandscaping-backups/db/
rm ${now}_jobhub.sql
