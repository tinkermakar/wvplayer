# LAST (Local Area Streamer)

## Setup static IP

Took from:
- https://linuxize.com/post/how-to-configure-static-ip-address-on-ubuntu-20-04/
- https://tizutech.com/ubuntu-netplan-gateway4-has-been-deprecated

1. Create a `02...yaml` file in `/etc/netplan
    ```yml
      version: 2
      renderer: networkd
      ethernets:
        wlp3s0:
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

3. Open the port