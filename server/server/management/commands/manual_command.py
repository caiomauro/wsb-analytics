from django.core.management.base import BaseCommand
from ...script import get_data
from ...models import StockSentiment

class Command(BaseCommand):
    help = 'Manually update data'

    def handle(self, *args, **options):
        stock_sentiments = get_data()  # Get the 50 most recent posts
        for pair in stock_sentiments:
            StockSentiment.objects.create(stock=pair[0], sentiment=pair[1])
        self.stdout.write(self.style.SUCCESS('Data updated successfully'))
