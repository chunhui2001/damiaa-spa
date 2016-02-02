#!/bin/bash
/usr/bin/rsync -zaP -rave "ssh -i /home/TTong/.ssh/keesh-s-ec2-keypair2.pem" --exclude=publish-*.sh --exclude=logs/ ./* ubuntu@52.69.117.163:/home/ubuntu/workspace/ionic-lab/
