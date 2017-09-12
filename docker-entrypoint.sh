#!/bin/bash

if [ "${1}" == "" ]; then
    gulp serve
else
    /bin/sh -c "$*"
fi
