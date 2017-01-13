#!/bin/sh

#
# chkconfig: 35 99 99
# description: Node.js chat
#

. /etc/rc.d/init.d/functions

DAEMON="/usr/bin/node"
ROOT_DIR="/home/gitlab-runner/chat"

SERVER="$ROOT_DIR/index.js"
DATE=$(date +"%F")
LOG_FILE="$ROOT_DIR/chat-log.$DATE.log"
ERROR_LOG_FILE="$ROOT_DIR/chat-err.$DATE.log"
NAME_SCREEN="aa8af3ebe14831a7cd1b6d1383a03755"

LOCK_FILE="$ROOT_DIR/lock/node-server"

do_start()
{
        if [ ! -f "$LOCK_FILE" ] ; then
                echo -n $"Starting $SERVER: "
                (sudo $DAEMON $SERVER > $LOG_FILE 2> $ERROR_LOG_FILE &) && echo_success || echo_failure
                RETVAL=$?
                echo
                [ $RETVAL -eq 0 ] && sudo touch $LOCK_FILE
        else
                echo "$SERVER is locked."
                RETVAL=1
        fi
}
do_stop()
{
        echo -n $"Stopping $SERVER: "
        pid=`ps -aefw | grep "$DAEMON $SERVER" | grep -v " grep " | awk '{print $2}'`
        sudo kill -9 $pid > /dev/null 2>&1 && echo_success || echo_failure
        RETVAL=$?
        echo
        [ $RETVAL -eq 0 ] && sudo rm -f $LOCK_FILE
}

case "$1" in
        start)
                do_start
                ;;
        stop)
                do_stop
                ;;
        restart)
                do_stop
                do_start
                ;;
        *)
                echo "Usage: $0 {start|stop|restart}"
                RETVAL=1
esac

exit $RETVAL