#!/bin/bash

if [ $UID -ne 0 ]; then
    echo "Script must be run as root. Please try again."
    exit
fi

_V=0
function log() {
    if [[ $_V -eq 1 ]]; then
        echo "$@"
    fi
}

# get correct home dir (when running as sudo)
USER_HOME=$(getent passwd $SUDO_USER | cut -d: -f6)

DEFAULT_IMAGE_DIR=$USER_HOME/Documents/Telepark/
DEFAULT_IMAGE_PATH=${DEFAULT_IMAGE_DIR}raspi-telepark.img
DEFAULT_ARCHIVE_PATH=${DEFAULT_IMAGE_DIR}raspi-telepark.tar.gz

# using verbose mode?
if [[ $* = *v* ]]; then
    _V=1
fi

# check if image already downloaded locally
log "Looking for image on local disk"

if [[ ! -e $DEFAULT_IMAGE_PATH ]]; then
    log "Did NOT find image at $DEFAULT_IMAGE_PATH"
    log "Looking for compressed gzip archive"

    if [[ -e $DEFAULT_ARCHIVE_PATH ]]; then
        log "Found gzip archive at $DEFAULT_ARCHIVE_PATH"
    else
        log "Did not find gzip archive at $DEFAULT_ARCHIVE_PATH"
        echo "Could not find a valid image or gzip archive in $DEFAULT_IMAGE_DIR"
        read -p "Would you like to download the latest image from GitHub? [Y/n] " yn
        case $yn in
            [Nn]* )
                echo "You chose not to download the latest image from GitHub. Exiting."
                exit
                ;;
            * ) 
                echo "Downloading latest image from GitHub"
                sudo -u $SUDO_USER mkdir -p $DEFAULT_IMAGE_DIR
                sudo -u $SUDO_USER wget -O $DEFAULT_ARCHIVE_PATH https://github.com/frillweeman/Telepark/releases/latest/download/raspi-telepark.tar.gz
                ;;
        esac
    fi
    
    # extract image from gzip archive
    echo "Extracting image from gzip archive"
    sudo -u $SUDO_USER tar xzf $DEFAULT_ARCHIVE_PATH -C $DEFAULT_IMAGE_DIR
    echo "Successfully extracted image"
    log "deleting gzip archive file"
    rm $DEFAULT_ARCHIVE_PATH &
fi

# prompt for space ID
echo
echo "   PARKING SPACE MAP"
echo
echo "   to Sparkman Drive"
echo "_____     ___     _____"
echo "|[8L]             [8R]|"
echo "|[7L]             [7R]|"
echo "|[6L]             [6R]|"
echo "|[5L]             [5R]|"
echo "|[4L]             [4R]|"
echo "|[3L]             [3R]|"
echo "|[2L]             [2R]|"
echo "|[1L]             [1R]|"
echo 
echo "|-------- SSB --------|"
echo
echo -en "Enter a parking space ID: "
read PLAYER_ID
echo

# look for disk
REMOVABLE_DEVS=($(
   grep -Hv ^0$ /sys/block/*/removable |
   sed s/removable:.*$/device\\/uevent/ |
   xargs grep -H ^DRIVER=sd |
   sed s/device.uevent.*$/size/ |
   xargs grep -Hv ^0$ |
   cut -d / -f 4
))

# add disk info to disk array
for dev in ${!REMOVABLE_DEVS[@]}; do
   let gb=`cat /sys/block/${REMOVABLE_DEVS[$dev]}/size`*512/1000000000
   REMOVABLE_DEVS[dev]=`echo ${REMOVABLE_DEVS[$dev]} \"$(sed -e s/\ *$//g </sys/block/${REMOVABLE_DEVS[$dev]}/device/model)\" "($gb GB)"`
done

case ${#REMOVABLE_DEVS[@]} in
   0 )
      echo "No SD cards found. Please insert and run this script again."
      exit
      ;;
   1 )
      echo "Only 1 removable disk found: ${REMOVABLE_DEVS[0]}"
      read -p "Would you like to use this one? [Y/n] " yn
      case $yn in
         [Nn]* )
            echo "No other SD cards found. Please insert and run this script again."
            exit
            ;;
         * )
            DEV=/dev/`echo ${REMOVABLE_DEVS[0]} | awk '{print $1}'`
            ;;
      esac
      ;;
   * )
      PS3="Choose a disk: "
      select dev in "${REMOVABLE_DEVS[@]}"
      do
         DEV=/dev/`echo $dev | awk '{print $1}'`
         echo "chosen"
      done
      ;;
esac

log "Flashing target: $DEV"

# we have an image at this point
printf "\nFlashing image. Please wait...\n\n"

dd if=$DEFAULT_IMAGE_PATH of=$DEV bs=4k status=progress

echo "Configuring player ID"

# mount boot partition and modify the file
mountPoint=/media/$SUDO_USER/boot
mkdir $mountPoint

mount ${DEV}1 $mountPoint
sed -i "s/PLAYER_ID=8R/PLAYER_ID=$PLAYER_ID/" $mountPoint/telepark.conf
umount $mountPoint
rm -r /media/$SUDO_USER/boot

printf "\nDone. You may remove the SD card.\n"
