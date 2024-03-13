import schedule
import time
import subprocess

def run_manual_command():
    print("Running manual command")
    subprocess.run(["python", "server\\manage.py", "manual_command"])

# Schedule the command to run every 5 minutes
schedule.every(10).minutes.do(run_manual_command)

while True:
    schedule.run_pending()
    time.sleep(1)
