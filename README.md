# Raspberry Pi K3s Homelab

This repository contains Kubernetes manifests for services running on my Raspberry Pi
using k3s and a 2TB HDD mounted at /mnt/data.

## Services
- nginx (static website)
- filebrowser (manage files on HDD)
- cloudflared (Cloudflare Tunnel access)

## Apply everything
kubectl apply -f k8s/
