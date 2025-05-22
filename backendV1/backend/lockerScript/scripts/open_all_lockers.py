#!/usr/bin/python3
#
# open_all_lockers.py
#
import os, sys
import time
import telnetlib

from settings import *

from services.RelayServices import RelayServices
from services.LockerServices import LockerServices

home_dir=os.path.expanduser("~")
sys.path.append(home_dir)

def debug(s):
#    print(f"{s}",file=sys.stderr)
    pass

def check_relay(host):
    debug(f"Checking connectivity relay module {host} ...")

    response=os.system(f"ping -c 1 -W 2 {host} 1>/dev/null 2>&1")
    # Check for response status code
    if response == 0:
        debug(f"{host} is UP and reachable!")
        return 1
    elif response == 2 or 256 or 512:
        debug(f"{host} is DOWN and No response from Server!")
        return 0
    else:
        debug(f"{host} is DOWN and Host Unreachable!")
        return 0

def open_locker(host, user, password, relay):
    debug(f"Connecting to {host} with user {user} and password {password} ...")
    try:
        tn=telnetlib.Telnet()
        tn.open(host, timeout=5)
    except:
        debug(f"Error: timeout ...")
        return 0

    welcome=b"\x1b[2J\x1b[31m\x1b[1mNumato Lab 32 Channel Ethernet Relay Module\x1b[0m\r\nEnter your user name and password to login\r\nUser Name: "
    tn.read_until(welcome, 3)
    tn.write(user.encode('ascii') + b"/\n")

    tn.read_until(b"Password: ",3)
    tn.write(password.encode('ascii') + b"/\n")
    tn.read_until(b"successfully",3)

    debug(f"Set relay {relay} on")
    command=f"relay on {relay}"
    tn.read_until(b">",3)
    tn.write(command.encode('ascii') + b"/\n/\n")
    tn.read_until(b">",3)

    time.sleep(0.2)

    debug(f"Set relay {relay} off")
    command=f"relay off {relay}"
    tn.read_until(b">",3)
    tn.write(command.encode('ascii') + b"/\n/\n")
    tn.read_until(b">",3)
    
    tn.close()
#
# Main code
#
all_relays=RelayServices.get_all_relays()
debug(f"all_relays: {all_relays}")

all_lockers=LockerServices.get_all_lockers()
debug(f"all_relays: {all_lockers}")

for l in range(len(all_lockers)):
    lockerid=all_lockers[l][1]
    
    relaymodule=all_lockers[l][4]
    relay=all_lockers[l][5]
    
    for r in range(len(all_relays)):
        if all_relays[r][1] == relaymodule:
            host=all_relays[r][2]
            user=all_relays[r][3]
            password=all_relays[r][4]

    print(f"Opening locker {lockerid} on relay module {host} connected to relay {relay} ...")
    if (check_relay(host)):
        open_locker(host, user, password, relay)

    time.sleep(1)
