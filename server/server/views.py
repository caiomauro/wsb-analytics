import datetime

from django.http import JsonResponse
from django.utils import timezone
from django.views import View

from .models import StockSentiment


class StockSentimentView(View):
    def get(self, request):
        # Retrieve the query parameter 'count' indicating the number of records to retrieve
        count = request.GET.get('count')
        
        # Default to 10 records if 'count' is not provided or not a valid integer
        try:
            count = int(count)
        except (TypeError, ValueError):
            count = 20
        
        # Retrieve the specified number of most recent records
        most_recent_records = StockSentiment.objects.order_by('-created_at')[:count]

        # Prepare the data to be returned as JSON
        stock_sentiments = [(record.stock, record.sentiment) for record in most_recent_records]

        data = {
            'stock_sentiments': stock_sentiments
        }
        
        # Return the data as JSON response
        return JsonResponse(data)
    
class DateRangeStockSentimentView(View):
    def get(self, request):
        
        starting_date = request.GET.get('starting_date')

        records_in_range = StockSentiment.objects.filter(created_at__range=[starting_date,timezone.now()])

        stocks_in_range = [(record.stock, record.sentiment, record.created_at) for record in records_in_range]

        data = {
            'stock_sentiments': stocks_in_range
        }
            
        return JsonResponse(data)
    
class StockStats(View):
    def get(self, request):
        
        starting_date = request.GET.get('starting_date')

        records_in_range = StockSentiment.objects.filter(created_at__range=[starting_date,timezone.now()])

        stocks_in_range = [(record.stock, record.sentiment, record.created_at) for record in records_in_range]

        data = {
            'stock_sentiments': stocks_in_range
        }
            
        return JsonResponse(data)
