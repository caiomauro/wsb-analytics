from django.http import JsonResponse
from django.views import View
from django.utils import timezone

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
