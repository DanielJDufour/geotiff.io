sudo apt-get install -y fluxbox gnome-screenshot libappindicator1 libindicator7 libnotify-bin libxss1 notify-osd recordmydesktop python-opencv tesseract-ocr wmctrl xdotool

echo 'installing reqs for tesseract'
sudo apt-get install -y autoconf autoconf-archive automake g++ libjpeg8-dev libpng12-dev libtiff5-dev libtool pkg-config zlib1g-dev

echo 'installing reqs for tesseract training'
sudo apt-get install -y libicu-dev libpango1.0-dev libcairo2-dev

echo 'building libleptonica required by Tesseract'
cd ~/
rm -fr ~/leptonica
git clone https://github.com/DanBloomberg/leptonica
cd leptonica
./autobuild
./configure
make
sudo make install

echo 'installing tesseract'
cd ~/
rm -fr ~/tesseract
git clone https://github.com/tesseract-ocr/tesseract/
cd tesseract
./autogen.sh
./configure
make
sudo make install

echo 'installing reqs for Goolge Chrome'
cd ~/
sudo apt-get install fonts-liberation gconf2-common gconf-service gconf-service-backend libgconf-2-4 xdg-utils
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome*.deb

echo 'installing chromedriver'
cd ~/

#git clone https://github.com/DanielJDufour/beryl
#pip install -e beryl/
