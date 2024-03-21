from django.db import models

class StockSentiment(models.Model):
    stock = models.CharField(max_length=50)
    sentiment = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sentiment
    
    class Meta:
        app_label = 'server'

class tickerStat(models.Model):
    stock = models.CharField(max_length=50, unique=True)
    mentions = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sentiment
    
    class Meta:
        app_label = 'server'

class PostAnalysis(models.Model):
    # Define fields for your AnotherModel
    stock = models.CharField(max_length=50)
    news = models.CharField(max_length=500)
    sentiment = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.field1
    
    class Meta:
        app_label = 'server'