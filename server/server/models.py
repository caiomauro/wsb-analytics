from django.db import models


#This model will contain each stock and its sentiment and when that aquired
class StockSentiment(models.Model):
    stock = models.CharField(max_length=50)
    sentiment = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sentiment
    
    class Meta:
        app_label = 'server'

#This will contained the time a stock has been mentioned to create some basic pie charts
class TickerStats(models.Model):
    stock = models.CharField(max_length=50, unique=True)
    mentions = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sentiment
    
    class Meta:
        app_label = 'server'

#This model will contain the analysis/summary for each user's post. Goal is to have a daily report page.
class PostAnalysis(models.Model):
    # Define fields for your AnotherModel
    stock = models.CharField(max_length=50)
    summary = models.CharField(max_length=500)
    sentiment = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.field1
    
    class Meta:
        app_label = 'server'