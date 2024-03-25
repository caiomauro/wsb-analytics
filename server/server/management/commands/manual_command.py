from django.core.management.base import BaseCommand
from ...script import get_data
from ...models import StockSentiment, TickerStats, PostAnalysis

class Command(BaseCommand):
    help = 'Manually update data'
    def handle(self, *args, **options):
        data = get_data()
        stock_sentiment = data[0]
        post_analysis = data[1]
        for pair in stock_sentiment:
            StockSentiment.objects.create(stock=pair[0], sentiment=pair[1])
            try:
                ticker_stats = TickerStats.objects.get(stock=pair[0])

                ticker_stats.mentions += 1

                ticker_stats.save()
            except:
                TickerStats.objects.create(stock=pair[0], mentions=1)
        for analysis in post_analysis:
            PostAnalysis.objects.create(stock=analysis[0], prospect=analysis[1], summary=analysis[2], sentiment=analysis[3])
        self.stdout.write(self.style.SUCCESS('Data updated successfully'))
