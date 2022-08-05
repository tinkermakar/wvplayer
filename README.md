# LAST (Local Area Streamer)

## Setup static IP

### Method 1. VIA Gnome Settings

Took from: https://linuxhint.com/configure-static-ip-address-linux/

1. Go to network's preferences --> IPv4

1. Set method to `Manual

1. Fill in:
    - Address: Desired static IP in the network
    - Netmask: `255.255.255.0`
    - Gateway: usually ends with 1
    - DNS: `8.8.8.8`

1. Press `Apply`

1. Let the network default to `0.0.0.0`


### Method 2. Via Netplan

Took from:
- https://linuxize.com/post/how-to-configure-static-ip-address-on-ubuntu-20-04/
- https://tizutech.com/ubuntu-netplan-gateway4-has-been-deprecated

1. Create a `02...yaml` file in `/etc/netplan
    ```yml
      version: 2
      renderer: networkd
      ethernets:
        {{interface}}:
          dhcp4: no
          addresses:
            - {{DESIRED ADDRESS}}/24
          routes:
            - to: default
              via: {{GATEWAY}}
          nameservers:
            addresses:
              - {{GATEWAY}}
              - 8.8.8.8
              - 1.1.1.1
    ```

1. Apply: `sudo netplan apply`

1. Open the port

## Autorun
1. Make the sell script executable
    ```bash
    chmod +x daemon/server.sh
    ```

1. Draft a `last.service` file based on the example

1. Do one of the two:
    1. copy `last.service` to `/lib/systemd/system/last.service`
    
    1. Add it with a symbolink:
        ```bash
        sudo ln -s /absolute/path/to/last.service /lib/systemd/system
        ```

1. Reload the daemon and start the `last` service
    ```bash
    sudo systemctl enable last.service
    sudo systemctl daemon-reload
    sudo service last start
    ```

1. Now the app may be managed as a regular service (e.g. `sudo service last restart`)
