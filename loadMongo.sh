for entry in $1/*
do
    mongoimport --collection=$2 --file=$entry --type=csv --headerline
done