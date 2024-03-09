from celery import Celery
from celery.schedules import crontab

app = Celery('server')

app.conf.beat_schedule = {
    'update-data-every-hour': {
        'task': 'server.tasks.update_data',
        'schedule': crontab(minute=0, hour='*'),  # Run every hour
    },
}

app.autodiscover_tasks()