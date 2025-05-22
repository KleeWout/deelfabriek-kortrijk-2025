#!/usr/bin/python3

import time
import telnetlib

def open_locker(lockerid):
    print(f"Opening locker {lockerid}")

    relay=ord(lockerid[:1])-ord('A')

    host="172.20.48.30"
    user="admin"
    password="admin"
    print(f"Connecting to {host} with user {user} and password {password} ...")

    try:
        tn=telnetlib.Telnet()
        tn.open(host, timeout=5)
    except:
        print(f"Error: timeout ...")
        return 0

    welcome=b"\x1b[2J\x1b[31m\x1b[1mNumato Lab 32 Channel Ethernet Relay Module\x1b[0m\r\nEnter your user name and password to login\r\nUser Name: "
    tn.read_until(welcome, 3)
    tn.write(user.encode('ascii') + b"/\n")

    tn.read_until(b"Password: ",3)
    tn.write(password.encode('ascii') + b"/\n")
    tn.read_until(b"successfully",3)

    command=f"relay on {int(lockerid[1:3])}"
    tn.read_until(b">",3)
    tn.write(command.encode('ascii') + b"/\n/\n")
    tn.read_until(b">",3)

    time.sleep(0.3)

    command=f"relay off {int(lockerid[1:3])}"
    tn.read_until(b">",3)
    tn.write(command.encode('ascii') + b"/\n/\n")
    tn.read_until(b">",3)
    
    tn.close()

    return 1

open_locker("A01")