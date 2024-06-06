from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import generics, renderers, viewsets, permissions
from endpoints.models import *
import random
from newsapi import NewsApiClient
from django.http import JsonResponse
from endpoints.serializer import *
from django.contrib.auth import get_user_model, authenticate, login, logout

newsapi = NewsApiClient(api_key='c329b95fd748460e9d812c20f549bb42')

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    customUser = get_user_model()
    queryset = customUser.objects.all()
    serializer_class = UserSerializer
    permisson_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filte/r(id=self.request.user.id)
        return queryset

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request):
        permission_classes = [permissions.IsAuthenticated]
        queryset = request.user
        serializer = self.serializer_class(queryset)
        return Response(serializer.data)

    def update(self, request):
        permission_classes = [permissions.IsAuthenticated]
        queryset = request.user
        serializer = self.serializer_class(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(['GET'])
def verify_email(request, email): 
    if email:
        prev_code = VerificationCode.objects.filter(email=email)
        if prev_code.exists():
            prev_code.delete()
        reg_code = random.randint(100000, 999999)
        subject = 'EVGamble: Verification Code'
        message = f'Your verification code for EVGamble is {reg_code}'
        try:
            send_mail(subject, message, settings.EMAIL_HOST_USER, [email], fail_silently=False)
            reg_code_obj = VerificationCode(email=email, code=reg_code)
            reg_code_obj.save()
            return Response({'message': 'Registration code sent'}, status=200)
        except Exception as e:
            return Response({'message': 'Failed to send email', 'error': str(e)}, status=500) 
    else:
        return Response({'message': 'Email is required'}, status=400)

@api_view(['GET'])
def get_news(request):
    top_headlines = newsapi.get_top_headlines(country='us', language='en', category='sports')
    return JsonResponse(top_headlines)

@api_view(['POST'])
def register_user(request):
    user_class = get_user_model()
    username = request.data.get('username')
    email = request.data.get('email')
    pword = request.data.get('password')
    bankroll = request.data.get('bankroll')
    category = request.data.get('category')
    promotions = request.data.get('promotions_opt_in')
    reg_code = request.data.get('code')

    if username and email and pword and reg_code and bankroll and category:
        # Validate registration code
        real_code = VerificationCode.objects.filter(email=email, code=reg_code)
        if not real_code.exists():
            return Response({'message': 'Invalid registration code'}, status=400)
        real_code.delete()

        #Create new user instance
        if user_class.objects.filter(email=email).exists():
            return Response({'message': 'User already exists'}, status=400)
        new_user = user_class.objects.create_user(email=email, password=pword, username=username, promotions=promotions, bankroll=bankroll, category=category)

        return Response({'message': 'User registered'}, status=201)
    else:
        return Response({'message': 'Missing required fields'}, status=400)

@api_view(['POST'])
def login_user(request):
    user_class = get_user_model()
    email = request.data.get('email')
    pword = request.data.get('password')
    long_session = request.data.get('long_session')
    user = authenticate(request, email=email, password=pword)
    if not user:
        return Response({'message': 'Invalid login credentials'}, status=400)
    login(request, user)
    if long_session:
        request.session.set_expiry(30*24*60*60)
    return Response({'message': 'Login successful'}, status=200)

@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({'message': 'User logged out'}, status=200)

@api_view(['GET'])
def user_authenticated(request):
    if request.user.is_authenticated:
        return Response({'true'}, status=200)