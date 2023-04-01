#!/bin/bash

# Get the current CPU and RAM utilization details
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}')
RAM=$(free -m | awk '/Mem:/ { printf("%.2f"), $3/$2*100 }')

# Print the CPU and RAM utilization details
echo "CPU Utilization: $CPU%"
echo "RAM Utilization: $RAM%"

