#!/bin/sh

#
# chkconfig: 35 99 99
# description: sinopia
#

. /etc/rc.d/init.d/functions

DAEMON="/usr/bin/sinopia"
ROOT_DIR="/home/gitlab-runner"

NAME_SCREEN="1bfe979afcb0874eed518cea40402e3b"

LOCK_FILE="$ROOT_DIR/lock/sinopia-server"

do_start() {
    screen -ls | grep -i $NAME_SCREEN
    CHECK_EXIST=$?
    if [ $CHECK_EXIST -eq 1 ] ; then
        echo -n $"Starting sinopia: "
        (su gitlab-runner -c "screen -d -m -S $NAME_SCREEN $DAEMON") && echo_success || echo_failure
        RETVAL=$?
        echo
        [ $RETVAL -eq 0 ] && touch $LOCK_FILE
    else
        echo "$SERVER is locked."
        RETVAL=1
    fi
}
do_stop() {
    echo -n $"Stopping sinopia: "
    (su gitlab-runner -c "screen -X -S $NAME_SCREEN quit") && echo_success || echo_failure
    RETVAL=$?
    echo
    [ $RETVAL -eq 0 ] && rm -f $LOCK_FILE
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