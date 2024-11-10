#!/bin/bash
docker build -t myapp:latest .
kubectl apply -f k8s/
