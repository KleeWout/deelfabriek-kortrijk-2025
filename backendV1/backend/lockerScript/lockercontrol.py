import os
import time
import telnetlib

def check_relay(host):
    # Check connectivity to relay module (Windows)
    response = os.system(f"ping -n 1 -w 2000 {host} >nul")
    if response == 0:
        return 1
    else:
        return 0

def open_locker(host, user, password, relay):
    try:
        tn = telnetlib.Telnet()
        tn.open(host, timeout=5)
    except:
        return 0

    welcome = b"\x1b[2J\x1b[31m\x1b[1mNumato Lab 32 Channel Ethernet Relay Module\x1b[0m\r\nEnter your user name and password to login\r\nUser Name: "
    tn.read_until(welcome, 3)
    tn.write(user.encode('ascii') + b"/\n")

    tn.read_until(b"Password: ", 3)
    tn.write(password.encode('ascii') + b"/\n")
    tn.read_until(b"successfully", 3)

    command = f"relay on {relay}"
    tn.read_until(b">", 3)
    tn.write(command.encode('ascii') + b"/\n/\n")
    tn.read_until(b">", 3)

    time.sleep(0.2)

    command = f"relay off {relay}"
    tn.read_until(b">", 3)
    tn.write(command.encode('ascii') + b"/\n/\n")
    tn.read_until(b">", 3)

    tn.close()