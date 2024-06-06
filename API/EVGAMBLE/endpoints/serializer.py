from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import *
from .views import *
from django.conf import settings
from datetime import datetime


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'promotions', 'bankroll', 'category']
        read_only_fields = ['email']
