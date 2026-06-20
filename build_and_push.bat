@echo off
echo ===== Building and pushing backend =====
cd backend-pinterest
docker build -t esthetic-api .
docker tag esthetic-api:latest jacobs51/esthetic-api:latest
docker push jacobs51/esthetic-api:latest
cd ..

echo.
echo ===== Building and pushing frontend =====
cd frontend-pinterest
docker build ^
  --build-arg VITE_API_BASE_URL=https://max.itstep.click/api ^
  --build-arg VITE_APP_IMAGE_URL=https://max.itstep.click/images ^
  --build-arg VITE_GOOGLE_CLIENT_ID=911542527173-rsr0s8elapousvqvskvqnmns61j9i3ev.apps.googleusercontent.com ^
  -t esthetic-web .
docker tag esthetic-web:latest jacobs51/esthetic-web:latest
docker push jacobs51/esthetic-web:latest
cd ..

echo.
echo DONE
pause