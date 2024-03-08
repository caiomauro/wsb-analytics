# views.py
from django.http import JsonResponse
from django.views import View

# Import necessary functions from your integrated script
from .script import get_data

class StockSentimentView(View):
    def get(self, request):
        # Call the function to analyze posts and retrieve stock sentiments
        stock_sentiments = get_data()
        
        # Prepare the data to be returned as JSON
        data = {
            'stock_sentiments': stock_sentiments
        }
        
        # Return the data as JSON response
        return JsonResponse(data)