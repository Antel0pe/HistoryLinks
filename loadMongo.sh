for entry in $1*
do
    mongoimport --uri=$2 --db=$3 --collection=$4 --file=$entry 
done