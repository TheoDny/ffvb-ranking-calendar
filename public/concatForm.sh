cat ./public/views/form.html > ./public/index.html &&
echo "<style type='text/css'>" >> ./public/index.html &&
cat ./public/styles/form.css >> ./public/index.html &&
echo "</style>" >> ./public/index.html &&
echo "<script type='text/javascript'>" >>  ./public/index.html &&
cat ./public/scripts/form.js >> ./public/index.html &&
echo "</script>" >> ./public/index.html &&
echo "Concat Success"
