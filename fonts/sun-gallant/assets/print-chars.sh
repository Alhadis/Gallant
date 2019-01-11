#!/bin/sh
count=0

for i in {32..126} {160..255}; do
	i=`printf %X $i`
	eval "printf '\x${i}'"
	count=$(($count + 1))
	[ $count -gt 29 ] && {
		printf '\n'
		count=0
	}
done
printf '\n'
