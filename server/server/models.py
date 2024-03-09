from django.db import models

class StockSentiment(models.Model):
    stock = models.CharField(max_length=50)
    sentiment = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sentiment
    
    class Meta:
        app_label = 'server'