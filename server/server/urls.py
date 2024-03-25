"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from .views import (AllStockMentions, DateRangeStockSentimentView,
                    LimitStockMentions, SpecificStockMentions,
                    StockSentimentView)

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/sentiment-pairs/', StockSentimentView.as_view(), name='stock_sentiment'),
    path('api/sentiment-pairs/range/', DateRangeStockSentimentView.as_view(), name='stock_sentiment_range'),
    path('api/stock-mentions/', AllStockMentions.as_view(), name="stock_mentions"),
    path('api/stock-mentions/limit/', LimitStockMentions.as_view(), name="stock_mentions_limit"),
    path('api/stock-mentions/stock/', SpecificStockMentions.as_view(), name="stock_mentions_stock")
]
